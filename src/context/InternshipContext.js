"use client";
import { createContext, useState, useContext, useEffect } from "react";
import { INITIAL_DATA } from "../data/internships-mock.js";
import { useAuthenticationChanges } from "@/hooks/useAuthenticationChanges.js";
import { useListenToData } from "@/hooks/useListenToData.js";
import { INITIAL_evaluationWeights } from "@/data/evaluationWeights-mock.js";

// 1. Create the Context
const InternshipContext = createContext();

// 2. Create the Provider Component
export function InternshipProvider({ children }) {
  const [internshipWindow, setInternshipWindow] = useState({
    active: false,
    internship: null,
  });
  const [profile, setProfile] = useState({});

  const [searchQuery, setSearchQuery] = useState("");

  const [internships, setInternships] = useState(INITIAL_DATA);

  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(null);

  const [personalContext, setPersonalContext] = useState({
    active: false,
    text: "",
  });

  const [activeLayout, setActiveLayout] = useState("board");

  const [sort, setSort] = useState("status");

  const [evaluationCriteria, setEvaluationCriteria] = useState(
    INITIAL_evaluationWeights,
  );

  useEffect(() => {
    console.log(evaluationCriteria);
  }, [evaluationCriteria]);

  useAuthenticationChanges({ setInternships, setLoading, setUser });
  useListenToData({
    user,
    setInternships,
    setLoading,
    setPersonalContext,
    setActiveLayout,
    setSort,
    setProfile,
    setEvaluationCriteria,
  });

  return (
    <InternshipContext.Provider
      value={{
        internshipWindow,
        setInternshipWindow,
        searchQuery,
        setSearchQuery,
        internships,
        setInternships,
        loading,
        setLoading,
        user,
        setUser,
        personalContext,
        setPersonalContext,
        activeLayout,
        setActiveLayout,
        sort,
        setSort,
        profile,
        setProfile,
        evaluationCriteria,
        setEvaluationCriteria,
      }}
    >
      {children}
    </InternshipContext.Provider>
  );
}

// 3. Create a custom hook to use it easily
export function useInternship() {
  return useContext(InternshipContext);
}

export function useLoading() {
  return useContext(InternshipContext);
}

export function useUser() {
  return useContext(InternshipContext);
}

export function useInternshipWindow() {
  return useContext(InternshipContext);
}

export function usePersonalContext() {
  return useContext(InternshipContext);
}

export function useActiveLayout() {
  return useContext(InternshipContext);
}

export function useSort() {
  return useContext(InternshipContext);
}

export function useProfile() {
  return useContext(InternshipContext);
}

export function useEvaluationCriteria() {
  return useContext(InternshipContext);
}
