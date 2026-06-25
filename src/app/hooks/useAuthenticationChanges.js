import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase.js";
import {
  useInternship,
  useLoading,
  useUser,
} from "../context/InternshipContext.js";

export const useAuthenticationChanges = () => {
  const { setInternships } = useInternship();
  const { setLoading } = useLoading();
  const { setUser } = useUser();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setInternships([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);
};
