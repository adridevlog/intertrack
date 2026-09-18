import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "../../firebase.js";
import { p } from "motion/react-client";

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

export const updatePersonalContext = async (updatedFields, user) => {
  const docRef = doc(db, "users", user.uid, "config", "personalContext");
  await setDoc(docRef, updatedFields);
};

/*export async function getUserByUsername(username) {
  try {
    if (!username) return null;
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null; // No user found with that username
    }
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    const internshipsColRef = collection(
      db,
      "users",
      userDoc.id,
      "internships",
    );
    const internshipsSnapshot = await getDocs(internshipsColRef);
    const internshipsData = internshipsSnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    return {
      id: userDoc.id,
      internships: internshipsData,
      ...userData,
    };
  } catch (error) {
    console.error("Error fetching profile by username:", error);
    return null;
  }
}*/

export const editProfile = (key, value, user) => {
  if (!user) return;
  const docRef = doc(db, "users", user.uid);
  setDoc(docRef, { [key]: value }, { merge: true });
};

export async function getUserByUsername(username) {
  try {
    if (!username) return null;
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    // We removed the internships fetch from here!
    return {
      id: userDoc.id,
      ...userData,
    };
  } catch (error) {
    console.error("Error fetching profile by username:", error);
    return null;
  }
}

export async function checkUsernameAvailability(requestedUsername) {
  if (!requestedUsername || requestedUsername.length < 3) return false;

  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", requestedUsername));
    const querySnapshot = await getDocs(q);

    // If empty is true, the username doesn't exist yet (it's available)
    return querySnapshot.empty;
  } catch (error) {
    console.error("Error checking username:", error);
    return false;
  }
}

export async function getPublicInternships(targetUserId) {
  try {
    const internshipsRef = collection(db, "users", targetUserId, "internships");
    // THIS is the line that prevents the permission crash:
    const q = query(internshipsRef, where("isPublic", "==", true));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching public internships:", error);
    return [];
  }
}
