import { useEffect } from "react";
import { doc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase.js";
import {
  useInternship,
  useLoading,
  useUser,
  usePersonalContext,
} from "../context/InternshipContext.js";

export const useListenToData = ({
  user,
  setInternships,
  setLoading,
  setPersonalContext,
  setActiveLayout,
  setSort,
}) => {
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

    return () => {
      unsubSettings();
      unsubInternships();
      unsubPersonalContext();
    };
  }, [
    user,
    setInternships,
    setLoading,
    setPersonalContext,
    setActiveLayout,
    setSort,
  ]);
};
