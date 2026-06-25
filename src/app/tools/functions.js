import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../../firebase.js";
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

export const addInternship = async (newInternshipData, user) => {
  const colRef = collection(db, "users", user.uid, "internships");
  // 1. Save the reference to a variable
  const docRef = await addDoc(colRef, newInternshipData);
  // 2. Return the ID!
  return docRef.id;
};

// Update an existing internship (like changing status on drag-and-drop or checking a box)
export const updateInternship = async (id, updatedFields, user) => {
  const docRef = doc(db, "users", user.uid, "internships", id);
  await updateDoc(docRef, updatedFields);
};

// Delete an internship
export const deleteInternship = async (id, user) => {
  const docRef = doc(db, "users", user.uid, "internships", id);
  await deleteDoc(docRef);
};

export const updatePreferenceInCloud = async (key, value, user) => {
  if (!user) return;
  const settingsDocRef = doc(db, "users", user.uid, "config", "preferences");

  // By using [key]: value, this function can update ANY setting dynamically
  await setDoc(settingsDocRef, { [key]: value }, { merge: true });
};
