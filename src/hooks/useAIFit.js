import { useTranslation } from "react-i18next";
import { GoogleGenAI } from "@google/genai";

export const useAIFit = ({
  internship,
  personalContext,
  setIsAnalyzing,
  setFormData,
}) => {
  const { t } = useTranslation();
  async function getAIFit(internship, personalContext) {
    const ai = new GoogleGenAI({
      apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    });
    const { company, role, description } = internship;
    if (!company || !role || !personalContext) {
      throw new Error(
        "Company, role, and personal context are required fields.",
      );
    }
    const prompt = `${t("internshipWindow.tabs.AIFit.notReady.prompt.one")}
  
      ${t("internshipWindow.tabs.AIFit.notReady.prompt.two")}: ${personalContext}
      ${t("internshipWindow.tabs.AIFit.notReady.prompt.three")}: ${company} - ${role}
      ${t("internshipWindow.tabs.AIFit.notReady.prompt.four")}: ${description ? description : t("internshipWindow.tabs.AIFit.notReady.prompt.five")}
  
      ${t("internshipWindow.tabs.AIFit.notReady.prompt.six")}:
        {
          "score": <${t("internshipWindow.tabs.AIFit.notReady.prompt.seven")}>,
          "overview": "<${t("internshipWindow.tabs.AIFit.notReady.prompt.eight")}>",
          "missingRequirements" (${t("internshipWindow.tabs.AIFit.notReady.prompt.nine")}): [
            "<${t("internshipWindow.tabs.AIFit.notReady.prompt.ten")}>",
            "<${t("internshipWindow.tabs.AIFit.notReady.prompt.eleven")}>"
          ],
          "matchingSkills" (${t("internshipWindow.tabs.AIFit.notReady.prompt.twelve")}): [
            "<${t("internshipWindow.tabs.AIFit.notReady.prompt.thirteen")}>",
            "<${t("internshipWindow.tabs.AIFit.notReady.prompt.fourteen")}>"
          ]
        }`;
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          // This forces the AI to only output valid JSON
          responseMimeType: "application/json",
        },
      });

      // Return the plain text directly
      return JSON.parse(response.text);
    } catch (error) {
      console.error("AI Error:", error);
      return "Error generating analysis. Please try again.";
    }
  }

  async function handleAIFit() {
    setIsAnalyzing(true);
    setFormData((prevData) => ({
      ...prevData,
      AIFit: "", // Clear previous AI Fit data
    }));
    try {
      const response = await getAIFit(internship, personalContext.text);
      setFormData((prevData) => ({
        ...prevData,
        AIFit: response,
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  }
  return { handleAIFit };
};
