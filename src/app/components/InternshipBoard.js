import {
  MapPin,
  Calendar,
  StarIcon,
  Star,
  DollarSign,
  Clock,
} from "lucide-react";
import { motion } from "motion/react";
import { calculateScore } from "../tools/functions";
import CompanyLogo from "./CompanyLogo.js";

export default function InternshipBoard({
  internship,
  setInternshipWindow,
  evaluationWeights,
}) {
  let {
    role,
    evaluation,
    company,
    position,
    location,
    status,
    deadline,
    salary,
    duration,
  } = internship;
  const averageScore = calculateScore(evaluation, evaluationWeights);
  const progress = (
    (Object.values(internship.requirements).filter((r) => r.done).length /
      internship.requirements.length) *
    100
  ).toFixed(0);
  const deadlineDate = new Date(deadline).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const handleDragStart = (e) => {
    // Save the ID of the internship being dragged into the browser's memory
    e.dataTransfer.setData("text/plain", internship.id);

    setTimeout(() => {
      e.target.style.opacity = "0.5";
    }, 0);
  };

  const handleDragEnd = (e) => {
    // Restore opacity when the drag finishes
    e.target.style.opacity = "1";
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="flex flex-col p-6 border border-slate-200 bg-white rounded-xl gap-1 cursor-pointer hover:shadow-2xl  transition-all duration-300 hover:-translate-y-2 hover:bg-cyan-50 group"
      onClick={() => {
        setInternshipWindow({
          active: true,
          internship: internship,
        });
      }}
    >
      <div className="flex flex-row justify-between items-center">
        <div className="flex gap-3 items-center">
          <CompanyLogo companyName={company} size={25} />
          <div className="font-semibold text-xl text-black group-hover:text-blue-800 transition-all">
            {company}
          </div>
        </div>

        <div className="border border-amber-300 text-amber-700  px-2 py-1 rounded-lg bg-amber-50 font-semibold flex flex-row gap-1 items-center">
          <Star className=" fill-amber-400 w-6 h-6 text-amber-600  pb-1" />
          <div className="text-md">{averageScore}</div>
        </div>
      </div>
      <div className="text-gray-600 font-semibold  text-md">{role}</div>
      <div className="mt-3 flex flex-row gap-2 items-center text-md text-gray-800 ">
        {location && (
          <div className="rounded-lg py-1 px-2 bg-slate-100 text-gray-700 border border-slate-300 flex flex-row gap-1 items-center ">
            <MapPin className="w-4 h-4 text-gray-700 " />
            <div className="text-xs">{location}</div>
          </div>
        )}
        {deadline && (
          <div className="rounded-lg p-2 bg-slate-100 text-gray-700 border border-slate-300 flex flex-row gap-1 items-center py-1 px-2">
            <Calendar className="w-4 h-4 text-gray-700" />
            <div className="text-xs">{deadlineDate}</div>
          </div>
        )}
        {salary && (
          <div className="rounded-lg p-2 bg-slate-100 text-gray-700 border border-slate-300 flex flex-row gap-0.5 items-center py-1 px-2">
            <DollarSign className="w-4 h-4 text-gray-700" />
            <div className="text-xs">{salary}</div>
          </div>
        )}
        {duration && (
          <div className="rounded-lg p-2 bg-slate-100 text-gray-700 border border-slate-300 flex flex-row gap-1 items-center py-1 px-2">
            <Clock className="w-4 h-4 text-gray-700" />
            <div className="text-xs">{duration}</div>
          </div>
        )}
      </div>
      {internship.requirements.length > 0 && (
        <div className="flex items-center gap-2 mt-4">
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {progress}%
          </span>
        </div>
      )}
    </div>
  );
}
