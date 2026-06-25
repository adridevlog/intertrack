"use client";

import Image from "next/image";
import { Search, Plus, LogOut } from "lucide-react";
import { useInternship, useUser } from "../context/InternshipContext.js";
import { useState } from "react";
import { newInternship } from "../data/newInternship.js";
import { addInternship } from "../tools/functions.js";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase.js";

export default function Navbar() {
  const {
    internshipWindow,
    setInternshipWindow,
    internships,
    setInternships,
    searchQuery,
    setSearchQuery,
  } = useInternship();
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useUser();
  const handleAddInternship = async () => {
    // 1. Wait for Firebase to create it and give us the ID
    const newId = await addInternship(newInternship, user);

    // 2. Attach the ID to our local object
    const internshipWithId = {
      ...newInternship,
      id: newId,
    };

    // 3. Open the window using the object that now has the correct ID
    setInternshipWindow({
      active: true,
      internship: internshipWithId,
    });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowDropdown(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="z-100 fixed w-full flex items-center flex-row justify-between p-6  bg-white border-b-2 border-slate-200 font-sans">
      <div className="text-slate-800 text-2xl font-bold">InternTrack</div>
      <div className="flex flex-row items-center gap-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 " />
          <input
            placeholder="Search roles, companies"
            className="pl-10 rounded-4xl bg-gray-100 py-2 px-2 focus:outline-none focus:ring-4 focus:ring-gray-100 focus:bg-white text-lg text-gray-700 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          ></input>
        </div>
        <button
          className="h-11 flex flex-row bg-indigo-600 rounded-4xl px-4 py-2 text-lg font-bold gap-4 align-center cursor-pointer hover:bg-indigo-700 transition-colors"
          onClick={handleAddInternship}
        >
          <Plus className="w-6 h-6 self-center"></Plus>
          <span className="self-center">Add New</span>
        </button>
        {user && (
          <div className="relative ml-2">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-11 h-11 rounded-full border-2 border-slate-200 hover:border-indigo-500 transition-all overflow-hidden focus:outline-none cursor-pointer flex items-center justify-center bg-gray-100"
            >
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  width={44}
                  height={44}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer" // Important for Google images to load correctly
                />
              ) : (
                // Fallback initial if the user doesn't have a Google picture
                <span className="text-lg font-bold text-gray-500">
                  {user.displayName ? user.displayName.charAt(0) : "U"}
                </span>
              )}
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <>
                {/* Invisible overlay to close dropdown when clicking outside */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowDropdown(false)}
                ></div>

                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border border-slate-100 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {user.displayName}
                    </p>
                    <p className="text-xs font-medium text-slate-500 truncate">
                      {user.email}
                    </p>
                  </div>

                  <div className="p-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Log Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
