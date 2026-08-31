import { useTranslation } from "react-i18next";
import { STATUS_STYLES } from "../data/STATUS_STYLES";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import CompanyLogo from "./CompanyLogo.js";
import {
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  Clock3,
  Star,
  Bookmark,
} from "lucide-react";
import {
  getDaysUntil,
  calculateScore,
  calculateEvaluationKeyValue,
} from "../tools/functions";
import {
  useInternship,
  useUser,
  usePersonalContext,
} from "../context/InternshipContext.js";
import {
  addInternship,
  updateInternship,
  deleteInternship,
} from "../tools/functions.js";
import { GoogleGenAI } from "@google/genai";

const ICON_MAP = {
  location: MapPin,
  salary: DollarSign,
  duration: Clock,
  category: Briefcase,
};

const internshipWindowViews = [
  "Overview",
  "AI Fit",
  "Requirements",
  "Interview",
  "Evaluation",
];

export default function InternshipWindow({
  internship,

  setInternshipWindow,
  statusList,
  evaluationWeights,
}) {
  const { t } = useTranslation();
  const statusListString = [
    t("board.toApply"),
    t("board.waitingForResponse"),
    t("board.consideringOffer"),
    t("board.accepted"),
  ];

  const internshipWindowViewsStrings = [
    t("internshipWindow.tabs.overview.title"),
    t("internshipWindow.tabs.AIFit.title"),
    t("internshipWindow.tabs.requirements.title"),
    t("internshipWindow.tabs.interview.title"),
    t("internshipWindow.tabs.evaluation.title"),
  ];

  const internshipWindowCriteria = [
    t("internshipWindow.tabs.evaluation.criteria.location"),
    t("internshipWindow.tabs.evaluation.criteria.supervisor"),
    t("internshipWindow.tabs.evaluation.criteria.prestige"),
    t("internshipWindow.tabs.evaluation.criteria.salary"),
    t("internshipWindow.tabs.evaluation.criteria.duration"),
  ];
  const [formData, setFormData] = useState({
    company: internship?.company || "",
    role: internship?.role || "",
    category: internship?.category || "",
    deadline: internship?.deadline || "",
    excerpt: internship?.excerpt || "",
    location: internship?.location || "",
    salary: internship?.salary || "",
    duration: internship?.duration || "",
    requirements: internship?.requirements || [],
    interview: internship?.interview || { date: "", tips: "", notes: "" },
    evaluation: internship?.evaluation || { salary: 10 },
    marked: internship?.marked || false,
    AIFit: internship?.AIFit || "",
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { setInternships, internships } = useInternship();
  const { user } = useUser();
  const { personalContext } = usePersonalContext();
  const averageScore = calculateScore(formData.evaluation, evaluationWeights);
  const evaluationKeysWidth = calculateEvaluationKeyValue(formData.evaluation);

  const [activeView, setActiveView] = useState("Overview");
  const [editRequirement, setEditRequirement] = useState(false);
  const [requirementInput, setRequirementInput] = useState("");
  const interviewDaysAway =
    formData.interview.date === ""
      ? null
      : getDaysUntil(formData.interview.date);

  const closeWindow = () => {
    setInternshipWindow({ active: false, internship: null });
  };

  const {
    company,
    role,
    id,
    deadline,
    category,
    excerpt,
    place,
    duration,
    location,
    salary,
    marked,
  } = internship || {};
  let statusName;
  let statusStyle;
  statusList.map((s, i) => {
    let array = s.name.split(" ");
    array[0] = array[0].toLowerCase();
    if (array.join("") === internship.status) {
      statusName = statusListString[i];
      statusStyle =
        STATUS_STYLES[array.join("")] || "bg-gray-200 text-gray-800";
    }
  });

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
      console.log("AI Fit Response:", response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  }

  const handleRequirementInputChange = (e) => {
    setRequirementInput(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInterviewChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      interview: {
        ...prevData.interview,
        [name]: value,
      },
    }));
  };

  const handleCheck = (e, index) => {
    const checkedStatus = formData.requirements[index]?.done;
    let d;
    if (checkedStatus === true) {
      d = false;
    } else {
      d = true;
    }
    setFormData((prevData) => ({
      ...prevData,
      requirements: prevData.requirements.map((req, i) =>
        i === index ? { ...req, done: d } : req,
      ),
    }));
  };

  const handleEvalChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      evaluation: {
        ...prevData.evaluation,
        [name]: value,
      },
    }));
  };

  const handleSaveChanges = () => {
    updateInternship(id, formData, user);

    closeWindow();
  };

  const handleDeleteInternship = () => {
    deleteInternship(id, user);
    closeWindow();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const newRequirements = [
        ...formData.requirements,
        {
          id: `r${formData.requirements.length}`,
          text: e.target.value,
          done: false,
        },
      ];
      setFormData((prevData) => ({
        ...prevData,
        requirements: newRequirements,
      }));
      setRequirementInput("");
      setEditRequirement(false);
    }
  };

  const progress = (
    (Object.values(formData.requirements).filter((r) => r.done).length /
      formData.requirements.length) *
    100
  ).toFixed(0);

  let progressStyle;

  if (progress === NaN) {
    progressStyle = "w-0";
  } else {
    progressStyle = `w-${progress}`;
  }

  return (
    <div
      className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-120 px-backdrop-blur-xs"
      onClick={closeWindow} // Optional: closes when clicking outside
    >
      <div
        className="w-[90%] max-w-3xl h-[90%]  bg-white rounded-2xl shadow-2xl overflow-y-auto py-6 px-6 relative flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-0.75 left-3">
          {!formData.marked && (
            <Bookmark
              className=" w-7 h-7 text-gray-500 "
              onClick={(e) => {
                e.stopPropagation(); // Prevent the click from propagating to the parent div
                setFormData((prevData) => ({
                  ...prevData,
                  marked: true,
                }));
              }}
            />
          )}
          {formData.marked && (
            <Bookmark
              className=" w-7 h-7 text-amber-600 fill-amber-400 "
              onClick={(e) => {
                e.stopPropagation(); // Prevent the click from propagating to the parent div
                setFormData((prevData) => ({
                  ...prevData,
                  marked: false,
                }));
              }}
            />
          )}
        </div>
        <div className="shrink-0">
          <div className="flex justify-between items-center mb-2">
            <div className="flex flex-row gap-4 items-center">
              <CompanyLogo companyName={company} size={32} />
              <h2 className="text-2xl font-bold text-black">{company}</h2>
              <p className={`px-3 py-1 rounded-full border ${statusStyle}`}>
                {statusName}
              </p>
            </div>

            <button
              onClick={closeWindow}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 
            w-12 h-12 rounded-full font-bold text-xl cursor-pointer transition-all duration-100"
            >
              ✕
            </button>
          </div>

          <div className="text-gray-600">
            <p className="text-md font-semibold mb-2">{role}</p>
          </div>
          <div className="mt-4 flex flex-row gap-5 border-b border-gray-300 pb-2 overflow-hidden overflow-x-auto flex-nowrap">
            {internshipWindowViews.map((view, i) => {
              const isActiveStyle =
                activeView === view
                  ? "text-indigo-700"
                  : "text-gray-500 hover:text-gray-900";
              return (
                <div key={view} className="relative text-nowrap">
                  <div
                    className={`text-md font-medium cursor-pointer ${isActiveStyle} transition-all duration-100`}
                    onClick={() => setActiveView(view)}
                  >
                    {internshipWindowViewsStrings[i]}
                  </div>
                  {activeView === view && (
                    <motion.span
                      className="absolute left-0 -bottom-2 h-0.75 w-full bg-indigo-700"
                      layoutId="view-underline"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    ></motion.span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex grow overflow-y-auto px-2 py-6">
          {activeView === "Overview" && (
            <div className="flex flex-col gap-5 pb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <OverviewBaseInput
                  name="company"
                  label={t("internshipWindow.tabs.overview.sections.company")}
                  valueInput={formData.company}
                  type="text"
                  handleChange={handleChange}
                />
                <OverviewBaseInput
                  name="role"
                  label={t("internshipWindow.tabs.overview.sections.role")}
                  valueInput={formData.role}
                  type="text"
                  handleChange={handleChange}
                />
                <OverviewBaseInput
                  label={t("internshipWindow.tabs.overview.sections.field")}
                  name="category"
                  valueInput={formData.category}
                  type="text"
                  handleChange={handleChange}
                />
                <OverviewBaseInput
                  name="deadline"
                  label={t("internshipWindow.tabs.overview.sections.deadline")}
                  valueInput={formData.deadline}
                  type="date"
                  handleChange={handleChange}
                />
              </div>
              <OverviewBaseInput
                name="excerpt"
                label={t("internshipWindow.tabs.overview.sections.description")}
                valueInput={formData.excerpt}
                type="text"
                rows="3"
                handleChange={handleChange}
              />

              <div className="flex flex-row flex-wrap gap-2 row-gap-2 pb-6">
                <OverviewBottomInput
                  name="location"
                  label={t("internshipWindow.tabs.overview.sections.location")}
                  valueInput={formData.location}
                  handleChange={handleChange}
                />
                <OverviewBottomInput
                  name="duration"
                  label={t("internshipWindow.tabs.overview.sections.duration")}
                  valueInput={formData.duration}
                  handleChange={handleChange}
                />
                <OverviewBottomInput
                  name="salary"
                  label={t("internshipWindow.tabs.overview.sections.salary")}
                  valueInput={formData.salary}
                  handleChange={handleChange}
                />
              </div>
            </div>
          )}
          {activeView == "AI Fit" && (
            <div className="flex flex-col w-full">
              {formData.AIFit === "" && (
                <div className="w-full h-full flex flex-col gap-6 bg-indigo-50/50 p-6 border border-slate-200 rounded-lg items-center justify-center">
                  <div className="text-lg text-indigo-900 font-bold tracking-wide">
                    {t("internshipWindow.tabs.AIFit.notReady.title")}
                  </div>
                  <div className="text-sm text-indigo-700/80  text-center">
                    {t("internshipWindow.tabs.AIFit.notReady.description")}
                  </div>
                  {!isAnalyzing && (
                    <button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm flex items-center justify-center gap-2 mx-auto transition-colors disabled:opacity-50 cursor-pointer"
                      onClick={handleAIFit}
                    >
                      <span>✨</span>
                      {t("internshipWindow.tabs.AIFit.notReady.button")}
                    </button>
                  )}
                  {isAnalyzing && (
                    <button className="bg-indigo-600/70 text-white font-bold py-2 px-6 rounded-lg shadow-sm flex items-center justify-center gap-2 mx-auto transition-colors disabled:opacity-50">
                      {t("internshipWindow.tabs.AIFit.notReady.loading")}
                    </button>
                  )}
                </div>
              )}
              {formData.AIFit !== "" && !isAnalyzing && (
                <div className="animate-in fade-in duration-500">
                  <div className="flex flex-col sm:flex-row gap-6 mb-6">
                    <div className="flex-1 bg-linear-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shrink-0 sm:w-64 flex flex-col justify-center items-center relative overflow-hidden shadow-lg shadow-indigo-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-target absolute -right-4 -bottom-4 w-32 h-32 text-white opacity-10"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="6"></circle>
                        <circle cx="12" cy="12" r="2"></circle>
                      </svg>
                      <div className="text-[10px] uppercase tracking-widest font-bold text-indigo-200 mb-2 relative z-10">
                        {t("internshipWindow.tabs.AIFit.ready.score")}
                      </div>
                      <div className="text-6xl font-black relative z-10">
                        {formData.AIFit.score}
                        <span className="text-3xl text-indigo-300">%</span>
                      </div>
                    </div>
                    <div className="flex-2 bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100">
                      <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-brain w-4 h-4"
                          aria-hidden="true"
                        >
                          <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path>
                          <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path>
                          <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"></path>
                          <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"></path>
                          <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"></path>
                          <path d="M3.477 10.896a4 4 0 0 1 .585-.396"></path>
                          <path d="M19.938 10.5a4 4 0 0 1 .585.396"></path>
                          <path d="M6 18a4 4 0 0 1-1.967-.516"></path>
                          <path d="M19.967 17.484A4 4 0 0 1 18 18"></path>
                        </svg>
                        {t("internshipWindow.tabs.AIFit.ready.assessment")}
                      </h4>
                      <p className="text-sm text-slate-700 font-medium leading-relaxed">
                        {formData.AIFit.overview}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
                      <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3">
                        {t("internshipWindow.tabs.AIFit.ready.matching")}
                      </h4>
                      <ul className="space-y-2">
                        {formData.AIFit.matchingSkills.map((skill, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm font-medium text-emerald-900"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-circle-check-big w-4 h-4 text-emerald-500 shrink-0 mt-0.5"
                              aria-hidden="true"
                            >
                              <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                              <path d="m9 11 3 3L22 4"></path>
                            </svg>
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-red-50 rounded-xl p-5 border border-red-100">
                      <h4 className="text-xs font-bold text-red-800 uppercase tracking-wider mb-3">
                        {t("internshipWindow.tabs.AIFit.ready.missing")}
                      </h4>
                      <ul className="space-y-2">
                        {formData.AIFit.missingRequirements.map(
                          (requirement, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-sm font-medium text-red-900"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-circle-x w-4 h-4 text-red-500 shrink-0 mt-0.5"
                                aria-hidden="true"
                              >
                                <path d="M21 12A9 9 0 1 1 12 3a9 9 0 0 1 9 9Z"></path>
                                <path d="m15 9-6 6M9 9l6 6"></path>
                              </svg>
                              {requirement}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>
                  <button
                    onClick={handleAIFit}
                    className="my-6  hover:text-gray-800  hover:bg-gray-50 text-gray-600 font-bold py-2 px-6 rounded-lg shadow-sm flex items-center justify-center gap-1 mx-auto transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <span>🔄</span>{" "}
                    {t("internshipWindow.tabs.AIFit.ready.recalculate")}
                  </button>
                </div>
              )}
            </div>
          )}
          {activeView == "Requirements" && (
            <div className="flex flex-col w-full">
              <div className="flex flex-col items-center gap-2 mt-4 w-full">
                <div className="flex justify-between w-full">
                  <span className="text-gray-800 tracking-wide font-bold text-lg">
                    {t(
                      "internshipWindow.tabs.requirements.sections.progressTitle",
                    )}
                  </span>
                  <span
                    className={`text-xl ${progress === "100" ? "text-green-700" : "text-indigo-800"} font-black tracking-wide`}
                  >
                    {progress === NaN ? "0" : progress}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-2.5 ${progress === "100" ? "bg-green-500" : "bg-indigo-600"} rounded-full transition-all duration-400 `}
                    style={{
                      width: `${progress === undefined ? "0" : progress}%`,
                    }}
                  />
                </div>
              </div>
              <div className="mt-6">
                <span className="text-black text-lg">
                  {t("internshipWindow.tabs.requirements.sections.itemsTitle")}
                </span>
                <div className="flex flex-col mt-4">
                  {formData.requirements.map((requirement, index) => {
                    const style = formData.requirements[index]?.done
                      ? "line-through text-gray-500"
                      : "text-gray-800";
                    return (
                      <div
                        key={requirement.id}
                        className="flex gap-2 
                        py-1 border-b justify-between border-gray-300 items-center"
                      >
                        <div
                          className="flex gap-2 cursor-pointer items-center "
                          onClick={(e) => handleCheck(e, index)}
                        >
                          <input
                            type="checkbox"
                            key={`${requirement.id}input`}
                            checked={formData.requirements[index]?.done}
                            readOnly
                            className="w-4 h-4  bg-blue-500 rounded focus:ring-indigo-500 focus:ring-2 transition-all duration-200 border-none cursor-pointer"
                          />
                          <span className={style}>{requirement.text}</span>
                        </div>

                        <div
                          className="text-red-700 hover:bg-gray-100 cursor-pointer text-base p-0 rounded-full transition-all w-8 h-8 flex items-center justify-center"
                          onClick={() => {
                            const newRequirements = [...formData.requirements];
                            newRequirements.splice(index, 1);
                            setFormData({
                              ...formData,
                              requirements: newRequirements,
                            });
                          }}
                        >
                          ✕
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div
                  className="flex gap-3 items-baseline mt-4 pb-6
                "
                >
                  <input
                    className="text-base text-gray-700 rounded-xl bg-gray-200 border-2 border-gray-300 w-80 px-2 py-0.5 mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder={t(
                      "internshipWindow.tabs.requirements.sections.inputPlaceholder",
                    )}
                    value={requirementInput}
                    onChange={handleRequirementInputChange}
                    onKeyDown={handleKeyDown}
                  ></input>
                  <button
                    className="text-white text-md bg-indigo-600 hover:bg-indigo-800 transition-all px-4 h-8 py-0 rounded-lg cursor-pointer font-medium tracking-wide"
                    onClick={() => {
                      const newRequirements = [
                        ...formData.requirements,
                        {
                          id: `r${formData.requirements.length}`,
                          text: requirementInput,
                          done: false,
                        },
                      ];
                      setFormData((prevData) => ({
                        ...prevData,
                        requirements: newRequirements,
                      }));
                      setRequirementInput("");
                      setEditRequirement(false);
                    }}
                  >
                    {t("internshipWindow.tabs.requirements.sections.add")}
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeView === "Interview" && (
            <div className="flex flex-col w-full">
              <div className="flex flex-col bg-blue-50 p-6 gap-3 w-full fit-content h-fit rounded-lg border border-blue-200">
                <div className="uppercase text-base text-blue-800 font-semibold">
                  {t("internshipWindow.tabs.interview.title")}
                </div>
                <input
                  type="datetime-local"
                  className="text-gray-900 text-lg rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  value={formData.interview.date}
                  onChange={handleInterviewChange}
                  name="date"
                ></input>
                {interviewDaysAway !== null && interviewDaysAway > 0 && (
                  <div className="flex flex-row gap-2 items-center mt-2">
                    <Clock3 className="w-12 h-12 text-white bg-indigo-600 p-2 rounded-xl"></Clock3>
                    <div className="flex flex-col  justify-between">
                      <div className="uppercase text-sm text-blue-900 font-medium">
                        {t("internshipWindow.tabs.interview.countdown")}
                      </div>
                      <div className="font-extrabold text-lg text-amber-700">
                        {interviewDaysAway}{" "}
                        {t("internshipWindow.tabs.interview.daysLeft")}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-black font-semibold text-lg mt-7">
                {t("internshipWindow.tabs.interview.preparationStrategy")}
              </div>
              <div className="mt-4 flex flex-col items-baseline w-full gap-4 pb-6">
                <OverviewBaseInput
                  type="text"
                  name="tips"
                  handleChange={handleInterviewChange}
                  valueInput={formData.interview.tips}
                  label={t("internshipWindow.tabs.interview.tips")}
                  rows="3"
                />

                <OverviewBaseInput
                  type="text"
                  name="notes"
                  handleChange={handleInterviewChange}
                  valueInput={formData.interview.notes}
                  label={t("internshipWindow.tabs.interview.notes")}
                  rows="3"
                />
              </div>
            </div>
          )}
          {activeView === "Evaluation" && (
            <div className="flex flex-col w-full gap-8">
              <div className="bg-amber-100 p-6 border border-amber-200 flex flex-col sm:flex-row justify-between rounded-lg gap-4">
                <div className="flex flex-col gap-2">
                  <p className="font-bold text-md text-amber-800">
                    {t("internshipWindow.tabs.evaluation.title")}
                  </p>
                  <p className="text-amber-600">
                    {t("internshipWindow.tabs.evaluation.scoreDescription.one")}{" "}
                    {Object.keys(formData.evaluation).length}{" "}
                    {t("internshipWindow.tabs.evaluation.scoreDescription.two")}
                  </p>
                </div>
                <div className="bg-amber-50 border-2 border-amber-200 p-4  flex gap-2 items-center rounded-md">
                  <Star className="w-7.5 h-7.5 fill-amber-500  text-amber-600"></Star>
                  <div className="text-3xl text-amber-600 font-extrabold flex">
                    {averageScore}
                  </div>
                  <div className="text-md text-amber-400 font-semibold">
                    / 10{" "}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 w-full pb-6">
                {Object.entries(formData.evaluation).map(([key, value], i) => {
                  const width = `w-[${evaluationKeysWidth}px]`;
                  return (
                    <div className="flex items-center" key={`evaluation${key}`}>
                      <div
                        className={`text-gray-800 text-md font-medium whitespace-nowrap`}
                        style={{ width: `${evaluationKeysWidth}px` }}
                      >
                        {internshipWindowCriteria[i]}
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        name={key}
                        value={value}
                        onChange={handleEvalChange}
                        className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      ></input>
                      <div className="text-lg text-gray-700 ml-6 font-semibold">
                        {value}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className="shrink-0 px-4 py-4 flex flex-row justify-between border-t border-gray-300 rounded-b-2xl">
          <button
            className="text-red-600 hover:text-red-800 px-4 py-2 rounded-lg cursor-pointer tracking-wide font-bold transition-all"
            onClick={handleDeleteInternship}
          >
            {t("internshipWindow.buttons.delete")}
          </button>
          <div className="flex gap-3 items-center">
            <button
              className="text-gray-700 hover:bg-gray-200 transition-all text-md rounded-lg px-4 py-2 cursor-pointer tracking-wide font-medium"
              onClick={closeWindow}
            >
              {t("internshipWindow.buttons.cancel")}
            </button>
            <button
              className="text-white text-md bg-indigo-600 hover:bg-indigo-800 transition-all px-4 py-2 rounded-lg cursor-pointer font-medium tracking-wide"
              onClick={handleSaveChanges}
            >
              {t("internshipWindow.buttons.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const OverviewBaseInput = ({
  name,
  valueInput,
  type,
  rows,
  handleChange,
  label,
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {type === "text" && (
        <>
          <p className="uppercase text-gray-500 text-md tracking-wide font-medium">
            {label}
          </p>
          <textarea
            className="text-gray-900 text-lg rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={rows || 1}
            value={valueInput}
            onChange={handleChange}
            name={name}
          />
        </>
      )}
      {type === "date" && (
        <>
          <div className="flex flex-col gap-2">
            <p className="uppercase text-gray-500 text-md tracking-wide font-medium">
              {label}
            </p>

            <input
              type="date"
              className="text-gray-900 text-lg rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={valueInput}
              onChange={handleChange}
              name={name}
            />
          </div>
        </>
      )}
    </div>
  );
};

const OverviewBottomInput = ({ name, valueInput, handleChange, label }) => {
  const IconComponent = ICON_MAP[name.toLowerCase()] || MapPin;
  return (
    <div className="flex flex-col gap-2 bg-gray-100 rounded-md p-2">
      <div className="text-gray-600 flex flex-row gap-1 items-center text-sm">
        <IconComponent className="w-4 h-4" />
        <p>{label}</p>
      </div>
      <input
        className="text-gray-900 text-sm rounded-md border border-gray-300 px-1 py-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-semibold"
        value={valueInput}
        onChange={handleChange}
        name={name}
      ></input>
    </div>
  );
};
