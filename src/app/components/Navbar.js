"use client";

import { Search, Plus } from "lucide-react";
import { useInternship } from "../context/InternshipContext.js";
import { useEffect } from "react";
import { newInternship } from "../data/newInternship.js";

export default function Navbar() {
  const { internshipWindow, setInternshipWindow, internships, setInternships } =
    useInternship();
  const handleAddInternship = async () => {
    await setInternships([...internships, newInternship]);
    await setInternshipWindow({
      active: true,
      internship: newInternship,
    });
  };

  useEffect(() => {}, [internships]);

  return (
    <nav className="z-100 fixed w-full flex items-center flex-row justify-between p-6  bg-white border-b-2 border-slate-200 font-sans">
      <div className="text-slate-800 text-2xl font-bold">InternTrack</div>
      <div className="flex flex-row items-center gap-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 " />
          <input
            placeholder="Search roles, companies"
            className="pl-10 rounded-4xl bg-gray-100 py-2 px-2 focus:outline-none focus:ring-4 focus:ring-gray-100 focus:bg-white text-lg text-gray-700 transition-all"
          ></input>
        </div>
        <button
          className="h-11 flex flex-row bg-indigo-600 rounded-4xl px-4 py-2 text-lg font-bold gap-4 align-center cursor-pointer hover:bg-indigo-700 transition-colors"
          onClick={handleAddInternship}
        >
          <Plus className="w-6 h-6 self-center"></Plus>
          <span className="self-center">Add New</span>
        </button>
      </div>
    </nav>
  );
}
