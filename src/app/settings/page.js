"use client";

import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  updatePreferenceInCloud,
  deleteCriteriumInCloud,
} from "@/tools/firebaseActions";
import { useEvaluationCriteria } from "@/context/InternshipContext";
import { useUser } from "@/context/InternshipContext";
import { calculateEvaluationKeyValue } from "@/tools/functions";
import { X } from "lucide-react";

export default function Settings() {
  const { user } = useUser();
  const [view, setView] = useState("languagePreference");
  const { t, i18n } = useTranslation();
  const { evaluationCriteria } = useEvaluationCriteria();
  const criteriaWidth = calculateEvaluationKeyValue(evaluationCriteria);

  const [localCriteria, setLocalCriteria] = useState({});
  const [criteriumInput, setCriteriumInput] = useState("");

  useEffect(() => {
    const syncState = async () => {
      setLocalCriteria(evaluationCriteria || {});
    };

    syncState();
  }, [evaluationCriteria]);

  const handleSaveToCloud = () => {
    updatePreferenceInCloud("evaluationCriteria", localCriteria, user);
  };

  const handleAddCriterium = () => {
    const trimmedInput = criteriumInput.trim();
    // Prevent empty strings or duplicate keys
    if (!trimmedInput || localCriteria.hasOwnProperty(trimmedInput)) return;

    const newCriteria = {
      ...localCriteria,
      [trimmedInput]: 1, // Default weight of 1
    };

    // Update locally and in cloud
    setLocalCriteria(newCriteria);
    updatePreferenceInCloud("evaluationCriteria", newCriteria, user);
    setCriteriumInput("");
  };

  useEffect(() => {
    console.log(evaluationCriteria);
  }, [evaluationCriteria]);
  return (
    <main className="flex pt-52 sm:pt-28 font-sans min-h-screen w-full h-full  p-8 bg-slate-50 gap-8">
      <div className="flex flex-col gap-5 text-lg text-gray-700 border-r border-r-slate-400 pr-6 w-30 md:w-50">
        <div
          className={`${view === "languagePreference" && "text-indigo-600"} ${view !== "languagePreference" && "text-gray-700 cursor-pointer"}`}
          onClick={() => {
            if (view !== "languagePreference") {
              setView("languagePreference");
            }
          }}
        >
          Language preference
        </div>
        <div
          className={`${view === "evaluationCriteria" && "text-indigo-600"} ${view !== "evaluationCriteria" && "text-gray-700 cursor-pointer"}`}
          onClick={() => {
            if (view !== "evaluationCriteria") {
              setView("evaluationCriteria");
            }
          }}
        >
          Evaluation criteria
        </div>
      </div>
      <div className="flex flex-col p-2 flex-1">
        {view === "languagePreference" && (
          <>
            <div className="font-semibold text-xl sm:text-2xl text-gray-800">
              Language preference
            </div>
            <div className="text-gray-600 mt-2">
              Set your preferred language for Interntrack
            </div>
            <div className=" flex items-center gap-2 bg-gray-100 rounded-lg py-3 px-5 mt-6 w-min">
              <Globe className="w-5 h-5 text-gray-500" />
              <select
                onChange={(e) => {
                  updatePreferenceInCloud("language", e.target.value, user);
                }}
                value={i18n.language}
                className="bg-transparent text-gray-700 font-medium focus:outline-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
          </>
        )}
        {view === "evaluationCriteria" && (
          <>
            <div className="font-semibold text-xl sm:text-2xl text-gray-800">
              Evaluation Criteria
            </div>
            <div className="text-gray-600 mt-2">
              Set your preferred evaluation criteria for your internships and
              their weights, where 1 means not important and 10 means very
              important
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <input
                className="focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-slate-100 focus:bg-white rounded-lg px-3 py-1.5 font-medium text-gray-600"
                placeholder="Write your criterium and 'Enter'"
                value={criteriumInput}
                onChange={(e) => {
                  setCriteriumInput(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddCriterium();
                }}
              ></input>
              <button
                className="bg-indigo-600 text-white font-semibold px-4 py-1.5 rounded-lg hover:opacity-80 cursor-pointer transition-all duration-300"
                onClick={handleAddCriterium}
              >
                Add Criterium
              </button>
            </div>
            <div className="flex flex-col gap-3 mt-6">
              {Object.entries(localCriteria)
                .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
                .map(([key, weight]) => {
                  return (
                    <div key={key} className="flex flex-row items-center gap">
                      <div
                        className="text-gray-500 font-semibold uppercase"
                        style={{ width: `${criteriaWidth}px` }}
                      >
                        {key}
                      </div>
                      <input
                        className="w-30 sm:w-50 md:w-75 lg:flex-1 max-w-170 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        type="range"
                        min="1"
                        max="10"
                        value={weight}
                        onChange={(e) => {
                          setLocalCriteria((prev) => ({
                            ...prev,
                            [key]: Number(e.target.value),
                          }));
                        }}
                        onMouseUp={handleSaveToCloud}
                        onTouchEnd={handleSaveToCloud}
                      ></input>
                      <div className="text-lg text-gray-700 ml-6 font-semibold">
                        {weight}
                      </div>
                      <X
                        className="w-8 h-8 text-red-700 rounded-full p-1.25 hover:bg-slate-100 transition-all ml-3 cursor-pointer"
                        onClick={() => {
                          const newCriteria = { ...localCriteria };
                          delete newCriteria[key];

                          setLocalCriteria(newCriteria);
                          deleteCriteriumInCloud(key, user);
                        }}
                      ></X>
                    </div>
                  );
                })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
