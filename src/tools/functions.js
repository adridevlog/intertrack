import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebase.js";
import { useUser } from "../context/InternshipContext.js";

export const getDaysUntil = (dateString) => {
  if (!dateString) return null;
  const target = new Date(dateString);
  const now = new Date();
  const diffTime = target - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export function calculateScore(evaluation, weights) {
  let totalScore = 0;
  let totalWeight = 0;
  Object.values(weights).forEach((weight) => {
    totalWeight += weight;
  });
  Object.entries(evaluation).map(([key, score]) => {
    totalScore += score * (weights[key] / totalWeight);
  });
  return totalScore.toFixed(1);
}

export function calculateEvaluationKeyValue(evaluation) {
  let width = 0;
  Object.keys(evaluation).forEach((key) => {
    if (width < key.length) {
      width = key.length;
    }
  });
  width = width * 10 + 15;
  return width;
}

export function calculateProgress(requirements) {
  const progress =
    requirements.length > 0
      ? (
          (Object.values(requirements).filter((r) => r.done).length /
            requirements.length) *
          100
        ).toFixed(0)
      : "0";
  let progressStyle;

  if (!progress) {
    progressStyle = "w-0";
  } else {
    progressStyle = `w-${progress}`;
  }

  return { progress, progressStyle };
}

export function prepareInternships(
  internships,
  searchQuery,
  sort,
  statusList,
  evaluationWeights,
) {
  let filteredInternships = internships.filter((internship) => {
    // If the search bar is empty, this simply returns true for everything
    if (internship.status === "finalized") return false;
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
  return sortedInternships;
}

export function getMonthYearRange(startDate, durationInWeeks) {
  const start = new Date(startDate);

  // Create end date by adding the duration in days (weeks * 7)
  const end = new Date(start.getTime());
  end.setDate(start.getDate() + durationInWeeks * 7);

  // Use Intl.DateTimeFormat for clean, localized "Month Year" strings
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  });

  return {
    startDate: formatter.format(start),
    endDate: formatter.format(end),
  };
}
