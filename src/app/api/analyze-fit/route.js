"use server";

import { GoogleGenAI } from "@google/genai";

export async function getAIFit(internship, personalContext) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const { company, role, description } = internship;
  if (!company || !role || !personalContext) {
    throw new Error("Company, role, and personal context are required fields.");
  }
  const prompt = `You are an expert career counselor. Please analyze the fit between my personal context and an internship opportunity.

  Personal Context: ${personalContext}
  Internship: ${company} - ${role}
  Description: ${description ? description : "No description provided."}

  You MUST respond with a valid JSON object using exactly this structure:
    {
      "score": <a number out of 100 evaluating the overall fit>,
      "overview": "<a 40 to 80 word paragraph explaining why this is or isn't a good fit. Include pros and cons in your reasoning.>",
      "missingRequirements" (has to be an array): [
        "<a specific skill or requirement the user might be missing>",
        "<another potential challenge or con>"
      ],
      "matchingSkills" (has to be an array): [
        "<a specific skill or strength the user possesses that aligns with the internship>",
        "<another strength or relevant experience>"
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
