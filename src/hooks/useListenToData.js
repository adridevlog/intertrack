import { useEffect } from "react";
import { doc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase.js";
import {
  useInternship,
  useLoading,
  useUser,
  usePersonalContext,
} from "../context/InternshipContext.js";
import { useTranslation } from "react-i18next";
import { INITIAL_evaluationWeights } from "@/data/evaluationWeights-mock.js";

export const useListenToData = ({
  user,
  setInternships,
  setLoading,
  setPersonalContext,
  setActiveLayout,
  setSort,
  setProfile,
  setEvaluationCriteria,
}) => {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    if (!user) return;

    const changeLanguage = (e) => {
      i18n.changeLanguage(e);
    };

    // Path setup: Every user gets their own document for settings, and collection for internships
    const settingsDocRef = doc(db, "users", user.uid, "config", "preferences");
    const internshipsColRef = collection(db, "users", user.uid, "internships");
    const personalContextDocRef = doc(
      db,
      "users",
      user.uid,
      "config",
      "personalContext",
    );
    const profileDocRef = doc(db, "users", user.uid);

    // Fetch user preferences (like sorting)
    const unsubSettings = onSnapshot(settingsDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log(data.evaluationCriteria);
        if (data.sort) setSort(data.sort || "status");
        if (data.layout) setActiveLayout(data.layout || "board");
        if (data.evaluationCriteria) {
          setEvaluationCriteria(
            data.evaluationCriteria || INITIAL_evaluationWeights,
          );
        }
        if (data.language) changeLanguage(data.language || "en");
      }
    });

    const unsubInternships = onSnapshot(internshipsColRef, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setInternships(items);
      setLoading(false);
    });

    const unsubPersonalContext = onSnapshot(
      personalContextDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPersonalContext((prev) => ({
            ...prev,
            text: data.text || "",
          }));
        } else {
          // If the document doesn't exist yet, just ensure the text is empty
          setPersonalContext((prev) => ({
            ...prev,
            text: "",
          }));
        }
      },
    );

    const unsubProfile = onSnapshot(profileDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile(data);
      }
    });

    return () => {
      unsubSettings();
      unsubInternships();
      unsubPersonalContext();
      unsubProfile();
    };
  }, [
    user,
    setInternships,
    setLoading,
    setPersonalContext,
    setActiveLayout,
    setSort,
    setProfile,
    setEvaluationCriteria,
    i18n,
  ]);
};
