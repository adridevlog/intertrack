import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase.js";
import {
  useInternship,
  useLoading,
  useUser,
} from "../context/InternshipContext.js";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase.js";
import { updateDoc } from "firebase/firestore";
export const useAuthenticationChanges = ({
  setInternships,
  setLoading,
  setUser,
}) => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser?.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            if (
              currentUser.photoURL &&
              userData.photoURL !== currentUser.photoURL
            ) {
              await updateDoc(userDocRef, {
                photoURL: currentUser.photoURL,
                displayName: currentUser.displayName || "Anonymous Student",
              });
              // Update local userData object so the state sets correctly immediately
              userData.photoURL = currentUser.photoURL;
              userData.displayName = currentUser.displayName;
            }
            setUser({
              uid: currentUser?.uid,
              email: currentUser?.email,

              ...userData,
            });
          } else {
            setUser(currentUser);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
        setInternships([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [setInternships, setLoading, setUser]);
};
