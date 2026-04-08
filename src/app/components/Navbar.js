import { Search, Plus } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="flex items-center flex-row justify-between p-6  bg-white border-b-2 border-slate-200 font-sans">
      <div className="text-slate-800 text-3xl font-bold">InternTrack</div>
      <div className="flex flex-row items-center gap-6">
        <div className="relative">
          <Search className="w-6 h-6 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 " />
          <input
            placeholder="Search roles, companies"
            className="pl-12 rounded-4xl bg-gray-100 py-4 px-6 focus:outline-none focus:ring-4 focus:ring-gray-100 focus:bg-white text-xl text-gray-700 transition-all"
          ></input>
        </div>
        <button className="h-15 flex flex-row bg-indigo-600 rounded-4xl px-6 py-4 text-xl font-bold gap-4 align-center cursor-pointer hover:bg-indigo-700 transition-colors">
          <Plus className="w-6 h-6 self-center"></Plus>
          <span className="self-center">Add New</span>
        </button>
      </div>
    </nav>
  );
}
