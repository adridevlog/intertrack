"use client";
import { createContext, useState, useContext } from "react";
import { INITIAL_DATA } from "../data/internships-mock.js";
// 1. Create the Context
const InternshipContext = createContext();

// 2. Create the Provider Component
export function InternshipProvider({ children }) {
  const [internshipWindow, setInternshipWindow] = useState({
    active: false,
    internship: null,
  });

  const [searchQuery, setSearchQuery] = useState("");

  const [internships, setInternships] = useState(INITIAL_DATA);

  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(null);

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
