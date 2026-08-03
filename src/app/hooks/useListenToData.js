import { useEffect } from "react";
import { doc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase.js";
import {
  useInternship,
  useLoading,
  useUser,
  usePersonalContext,
  useAIFit,
} from "../context/InternshipContext.js";

export const useListenToData = ({ setActiveLayout, setSort }) => {
  const { user } = useUser();
  const { loading, setLoading } = useLoading();
  const { internships, setInternships } = useInternship();
  const { personalContext, setPersonalContext } = usePersonalContext();
  const { AIFit, setAIFit } = useAIFit();

  useEffect(() => {
    if (!user) return;

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

    const AIFitDocRef = doc(db, "users", user.uid, "config", "AIFit");

    // Fetch user preferences (like sorting)
    const unsubSettings = onSnapshot(settingsDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.sort) setSort(data.sort || "status");
        if (data.layout) setActiveLayout(data.layout || "board");
      }
    });

    const unsubInternships = onSnapshot(internshipsColRef, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log(items);
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

    const unsubAIFit = onSnapshot(AIFitDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAIFit(data);
      }
    });

    return () => {
      unsubSettings();
      unsubInternships();
      unsubPersonalContext();
      unsubAIFit();
    };
  }, [
    user,
    setInternships,
    setLoading,
    setPersonalContext,
    setActiveLayout,
    setSort,
    setAIFit,
  ]);
};
