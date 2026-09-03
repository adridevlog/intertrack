"use client";

import { useUser } from "@/context/InternshipContext";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { getUserByUsername } from "@/tools/firebaseActions.js";
import Image from "next/image.js";

function ProfileContent() {
  const searchParams = useSearchParams();
  const profileUsername = searchParams.get("u");
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [editing, setEditing] = useState(false);
  console.log(profileData);
  console.log(user);

  useEffect(() => {
    async function loadProfile() {
      if (profileUsername) {
        setIsLoading(true);
        const data = await getUserByUsername(profileUsername);
        setProfileData(data);
        setIsLoading(false);
      }
    }
    loadProfile();
  }, [profileUsername]);
  return (
    <main className="flex flex-col pt-52 sm:pt-36 font-sans min-h-screen w-full h-full  p-8 bg-slate-50 ">
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          Loading profile...:
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 overflow-hidden">
          <div className="h-48 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 relative w-full">
            <div className="absolute -bottom-13 left-4 bg-white rounded-full p-1 w-26 h-26 flex items-center justify-center">
              {profileData?.photoURL ? (
                <Image
                  alt="Profile"
                  src={profileData.photoURL}
                  width={100}
                  height={100}
                  className="object-cover rounded-full"
                />
              ) : (
                <span className="text-white font-bold text-4xl">
                  {profileData?.username?.[0]?.toUpperCase() || "?"}
                </span>
              )}
            </div>
          </div>
          <div className="w-full flex p-8 relative pt-16">
            <button className="absolute top-2 right-3 text-black">Edit</button>
            <div className="text-black text-2xl font-black">
              {profileData?.displayName}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
export default function Profile() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading profile...
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
