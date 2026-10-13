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
  deleteField,
  arrayRemove,
  arrayUnion,
  limit,
  startAfter,
  collectionGroup,
  orderBy,
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

export const updateUserDoc = async (updatedFields, user) => {
  if (!user) return;
  const userDocRef = doc(db, "users", user.uid);
  await setDoc(userDocRef, updatedFields, { merge: true });
};

export const deleteNetwork = async (
  networkType,
  connectionUsername,
  userId,
) => {
  if (!userId) return;
  const docRef = doc(db, "users", userId);
  await updateDoc(docRef, {
    [networkType]: arrayRemove(connectionUsername),
  });
};

export async function addNetwork(networkType, username, userId) {
  if (!userId) return;
  const docRef = doc(db, "users", userId);
  await updateDoc(docRef, {
    [networkType]: arrayUnion(username),
  });
}

export const deleteCriteriumInCloud = async (criteriumKey, user) => {
  if (!user) return;
  try {
    // Make sure this path exactly matches your updatePreferenceInCloud path!
    const docRef = doc(db, "users", user.uid, "config", "preferences");

    // Using dot notation to target ONLY the specific criterium inside the map
    await updateDoc(docRef, {
      [`evaluationCriteria.${criteriumKey}`]: deleteField(),
    });
  } catch (error) {
    console.error("Error deleting criterium:", error);
  }
};

export const updatePersonalContext = async (updatedFields, user) => {
  const docRef = doc(db, "users", user.uid, "config", "personalContext");
  await setDoc(docRef, updatedFields);
};

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

export const getDiscoverPosts = async (lastDoc = null, fetchLimit = 12) => {
  try {
    const internshipsRef = collectionGroup(db, "internships");
    const constraints = [
      where("isPublic", "==", true),
      orderBy("createdAt", "desc"), // CRITICAL: You must save a 'createdAt' timestamp when creating internships!
    ];

    if (lastDoc) constraints.push(startAfter(lastDoc));
    constraints.push(limit(fetchLimit));

    const q = query(internshipsRef, ...constraints);
    const snapshot = await getDocs(q);

    const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const newLastDoc = snapshot.docs[snapshot.docs.length - 1] || null;

    return { posts, lastDoc: newLastDoc };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { posts: [], lastDoc: null };
  }
};

export const getDiscoverPeers = async (
  lastDoc = null,
  fetchLimit = 12,
  user,
  phase = "institution",
) => {
  try {
    const usersRef = collection(db, "users");
    const constraints = [where("isPublic", "==", true)];

    // Phase 1: Only people at the same institution
    if (phase === "institution" && user?.institution) {
      constraints.push(where("institution", "==", user.institution));
    }
    // Phase 2: Only people in the same location
    else if (phase === "location" && user?.location) {
      constraints.push(where("location", "==", user.location));
    }
    // Phase 3 ("all") naturally runs with just isPublic == true

    if (lastDoc) constraints.push(startAfter(lastDoc));
    constraints.push(limit(fetchLimit));

    const q = query(usersRef, ...constraints);
    const snapshot = await getDocs(q);

    const peers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const newLastDoc = snapshot.docs[snapshot.docs.length - 1] || null;

    return { peers, lastDoc: newLastDoc };
  } catch (error) {
    console.error("Error fetching peers:", error);
    return { peers: [], lastDoc: null };
  }
};
