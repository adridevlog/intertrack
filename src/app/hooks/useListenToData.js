import { useEffect } from "react";
import { doc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase.js";
import {
  useInternship,
  useLoading,
  useUser,
} from "../context/InternshipContext.js";

export const useListenToData = ({
  setActiveLayout,

  setSort,
}) => {
  const { user } = useUser();
  const { loading, setLoading } = useLoading();
  const { internships, setInternships } = useInternship();

  useEffect(() => {
    if (!user) return;

    // Path setup: Every user gets their own document for settings, and collection for internships
    const settingsDocRef = doc(db, "users", user.uid, "config", "preferences");
    const internshipsColRef = collection(db, "users", user.uid, "internships");

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

    return () => {
      unsubSettings();
      unsubInternships();
    };
  }, [user]);
};
