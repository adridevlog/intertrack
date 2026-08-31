"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LayoutSelector from "./components/LayoutSelector";
import { INITIAL_DATA } from "./data/internships-mock";
import { INITIAL_evaluationWeights } from "./data/evaluationWeights-mock";
import { List, LayoutGrid, Globe } from "lucide-react";
import StatusColumn from "./components/StatusColumn";
import InternshipList from "./components/InternshipList";
import InternshipWindow from "./components/InternshipWindow";
import {
  useInternship,
  usePersonalContext,
} from "./context/InternshipContext.js";
import { calculateScore } from "./tools/functions";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db, googleProvider } from "../../firebase.js";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import {
  updateInternship,
  updatePreferenceInCloud,
} from "./tools/functions.js";
import { useAuthenticationChanges } from "./hooks/useAuthenticationChanges.js";
import { useListenToData } from "./hooks/useListenToData.js";
import { useLoading, useUser } from "./context/InternshipContext.js";
import { PersonalContextWindow } from "./components/PersonalContextWindow.js";

export default function Home() {
  const { t, i18n } = useTranslation();
  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };
  const { user, setUser } = useUser();
  const { loading, setLoading } = useLoading();
  const [activeLayout, setActiveLayout] = useState("board");
  const { personalContext, setPersonalContext } = usePersonalContext();
  const {
    internshipWindow,
    setInternshipWindow,
    internships,
    setInternships,
    searchQuery,
  } = useInternship();
  const [evaluationWeights, setEvaluationWeights] = useState(
    INITIAL_evaluationWeights,
  );
  const [sort, setSort] = useState("status");
  useAuthenticationChanges();
  useListenToData({ setActiveLayout, setSort });

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handlePreferenceChange = (e) => {
    const { name, value } = e.target;
    updatePreferenceInCloud(name, value, user);
  };

  const statusList = [
    {
      name: "To Apply",
      status: "toApply",
    },
    {
      name: "Waiting for Response",
      status: "waitingforResponse",
    },
    {
      name: "Considering Offer",
      status: "consideringOffer",
    },
    {
      name: "Accepted",
      status: "accepted",
    },
  ];

  const statusListString = [
    t("board.toApply"),
    t("board.waitingForResponse"),
    t("board.consideringOffer"),
    t("board.accepted"),
  ];

  const updateInternshipStatus = (internshipId, newStatus) => {
    updateInternship(internshipId, { status: newStatus }, user);
  };

  useEffect(() => {
    if (internshipWindow.active) {
      // Prevent scrolling on the body
      document.body.style.overflow = "hidden";
    } else {
      // Restore scrolling
      document.body.style.overflow = "unset";
    }

    // Cleanup function in case the component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [internshipWindow.active]); // Re-run this whenever the window opens or closes

  // 2. Filter the internships based on the search query
  let filteredInternships = internships.filter((internship) => {
    // If the search bar is empty, this simply returns true for everything
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    const companyMatch =
      internship.company?.toLowerCase().includes(query) || false;
    const roleMatch = internship.role?.toLowerCase().includes(query) || false;

    return companyMatch || roleMatch;
  });

  let sortedInternships = [...filteredInternships];
  sortedInternships.sort((a, b) => {
    // 1. PINNED LOGIC: Always bubble marked internships to the top
    if (a.marked && !b.marked) return -1;
    if (!a.marked && b.marked) return 1;

    // 2. SECONDARY SORT: If they are both marked (or both unmarked), apply the user's chosen sort
    if (sort === "status") {
      return (
        statusList.findIndex((s) => s.status === b.status) -
        statusList.findIndex((s) => s.status === a.status)
      );
    }

    if (sort === "evaluation") {
      const scoreA = calculateScore(a.evaluation, evaluationWeights);
      const scoreB = calculateScore(b.evaluation, evaluationWeights);
      return scoreB - scoreA;
    }

    if (sort === "deadline") {
      // Handle cases where a deadline might be empty to avoid crashing the sort
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    }

    if (sort === "progress") {
      // Added a fallback to `|| 1` to prevent dividing by zero if requirements array is empty
      const progressA =
        Object.values(a.requirements).filter((r) => r.done).length /
        (a.requirements.length || 1);
      const progressB =
        Object.values(b.requirements).filter((r) => r.done).length /
        (b.requirements.length || 1);
      return progressB - progressA;
    }

    return 0; // Default fallback
  });

  if (loading) return <div>Loading your cloud workspace...</div>;
  if (!user) {
    return (
      <div className="  min-h-screen bg-slate-50  fixed inset-0  flex items-center justify-center z-120 px-backdrop-blur-xs">
        <div className="absolute flex items-center gap-2 bg-gray-100 rounded-lg p-2 top-2 right-2">
          <Globe className="w-5 h-5 text-gray-500" />
          <select
            onChange={changeLanguage}
            value={i18n.language}
            className="bg-transparent text-gray-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
        <div className="flex p-10 flex-col items-center justify-center gap-2 bg-white rounded-xl shadow-lg">
          <p className="text-3xl font-black text-slate-900 font-sans">
            InternTrack
          </p>
          <p className="text-base text-slate-500 font-medium">
            {t("login.description")}
          </p>
          <button
            onClick={handleLogin}
            className="mt-6 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
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
              className="lucide lucide-log-in w-5 h-5"
              aria-hidden="true"
            >
              <path d="m10 17 5-5-5-5"></path>
              <path d="M15 12H3"></path>
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
            </svg>
            {t("login.button")}
          </button>
          <p className="mt-6 text-xs text-slate-400 flex items-center justify-center gap-1">
            {t("login.footer")}
          </p>
        </div>
      </div>
    );
  }
  return (
    <main className=" pt-52 sm:pt-36 font-sans flex min-h-screen h-full flex-col items-center justify-between p-8 bg-slate-50 ">
      {internshipWindow?.active && (
        <InternshipWindow
          internship={internshipWindow?.internship}
          setInternships={setInternships}
          setInternshipWindow={setInternshipWindow}
          statusList={statusList}
          evaluationWeights={evaluationWeights}
          internships={sortedInternships}
        ></InternshipWindow>
      )}
      {personalContext.active && (
        <PersonalContextWindow
          text={personalContext.text}
          setText={setPersonalContext}
        />
      )}
      <div
        className={`w-full max-w-7xl flex flex-col gap-8 transition-all duration-300 ${
          internshipWindow.active
            ? "blur-md pointer-events-none select-none"
            : ""
        }`}
      >
        <div className="absolute flex items-center gap-2 bg-gray-100 rounded-lg p-2 top-25 right-6">
          <Globe className="w-5 h-5 text-gray-500" />
          <select
            onChange={changeLanguage}
            value={i18n.language}
            className="bg-transparent text-gray-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
        <div className="w-full flex flex-col sm:flex-row justify-between gap-10 items-start sm:items-center">
          <div className="flex flex-row text-black border border-gray-300 rounded-xl p-3 gap-2 bg-white">
            <LayoutSelector
              name="Board"
              Icon={LayoutGrid}
              activeLayout={activeLayout}
              setActiveLayout={handlePreferenceChange}
              string={t("board.title")}
            />
            <LayoutSelector
              name="List"
              Icon={List}
              activeLayout={activeLayout}
              setActiveLayout={handlePreferenceChange}
              string={t("list.title")}
            />
          </div>
          <div className="text-gray-500 font-semibold">
            {t("sorting.title")}
            <select
              className="ml-2 p-2 font-medium text-gray-600 bg-white ring-2 ring-gray-200 rounded focus:ring-2 focus:ring-blue-500 active:ring-0"
              name="sort"
              onChange={handlePreferenceChange}
              value={sort}
            >
              <option value="status">{t("sorting.status")}</option>
              <option value="evaluation">{t("sorting.evaluationScore")}</option>
              <option value="deadline">{t("sorting.deadline")}</option>
              <option value="progress">
                {t("sorting.requirementsProgress")}
              </option>
            </select>
          </div>
        </div>
        <div className="overflow-hidden w-full">
          {activeLayout === "board" && (
            <div className="flex flex-row overflow-x-auto flex-nowrap w-full gap-5">
              {statusList.map((statusItem, i) => {
                const { name, status } = statusItem;
                return (
                  <StatusColumn
                    key={name}
                    name={name}
                    internships={sortedInternships}
                    status={status}
                    setInternshipWindow={setInternshipWindow}
                    evaluationWeights={evaluationWeights}
                    handleStatusChange={updateInternshipStatus}
                    string={statusListString[i]}
                  ></StatusColumn>
                );
              })}
            </div>
          )}
          {activeLayout === "list" && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden overflow-x-auto flex-nowrap">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 md:text-md lg:text-lg uppercase tracking-wider">
                    <th className="p-4 font-semibold">{t("list.company")}</th>
                    <th className="p-4 font-semibold">{t("list.status")}</th>
                    <th className="p-4 font-semibold">{t("list.deadline")}</th>
                    <th className="p-4 font-semibold">{t("list.score")}</th>
                    <th className="p-4 font-semibold">{t("list.progress")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedInternships.map((internship) => (
                    <InternshipList
                      key={internship.id}
                      internship={internship}
                      statusList={statusList}
                      setInternshipWindow={setInternshipWindow}
                      evaluationWeights={evaluationWeights}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
