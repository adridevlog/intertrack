import { MapPin, Calendar, StarIcon, Star } from "lucide-react";
import { motion } from "motion/react";
import { calculateScore } from "../tools/functions";

export default function InternshipBoard({
  internship,
  setInternshipWindow,
  evaluationWeights,
}) {
  let { role, evaluation, company, position, location, status, deadline } =
    internship;
  const averageScore = calculateScore(evaluation, evaluationWeights);
  const progress = (
    (Object.values(internship.requirements).filter((r) => r.done).length /
      internship.requirements.length) *
    100
  ).toFixed(0);
  deadline = new Date(deadline).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  return (
    <div
      className="flex flex-col p-6 border border-slate-200 bg-white rounded-xl gap-1 cursor-pointer hover:shadow-2xl  transition-all duration-300 hover:-translate-y-2 hover:bg-cyan-50 group"
      onClick={() => {
        setInternshipWindow({
          active: true,
          internship: internship,
        });
      }}
    >
      <div className="flex flex-row justify-between">
        <div className="font-semibold text-xl text-black group-hover:text-blue-800 transition-all">
          {company}
        </div>
        <div className="border border-amber-300 text-amber-700  px-2 py-1 rounded-lg bg-amber-50 font-semibold flex flex-row gap-1 items-center">
          <Star className=" fill-amber-400 w-6 h-6 text-amber-600  pb-1" />
          <div className="text-md">{averageScore}</div>
        </div>
      </div>
      <div className="text-gray-600 font-semibold  text-md">{role}</div>
      <div className="mt-3 flex flex-row gap-2 items-center text-md text-gray-800 ">
        <div className="rounded-lg py-1 px-2 bg-slate-100 text-gray-700 border border-slate-300 flex flex-row gap-1 items-center ">
          <MapPin className="w-5 h-5 text-gray-700  pb-1" />
          <div className="text-xs">{location}</div>
        </div>
        <div className="rounded-lg p-2 bg-slate-100 text-gray-700 border border-slate-300 flex flex-row gap-1 items-center py-1 px-2">
          <Calendar className="w-5 h-5 text-gray-700 pb-1" />
          <div className="text-xs">{deadline}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">{progress}%</span>
      </div>
    </div>
  );
}
