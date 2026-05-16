import { STATUS_STYLES } from "../data/STATUS_STYLES";
import { Star } from "lucide-react";
import { calculateScore } from "../tools/functions";

export default function InternshipList({
  internship,
  statusList,
  setInternshipWindow,
  evaluationWeights,
}) {
  let statusName;
  let statusStyle;
  const averageScore = calculateScore(internship.evaluation, evaluationWeights);
  const progress = (
    (Object.values(internship.requirements).filter((r) => r.done).length /
      internship.requirements.length) *
    100
  ).toFixed(0);
  statusList.map((s) => {
    let array = s.name.split(" ");
    array[0] = array[0].toLowerCase();
    if (array.join("") === internship.status) {
      statusName = s.name;
      statusStyle =
        STATUS_STYLES[array.join("")] || "bg-gray-200 text-gray-800";
    }
  });
  const deadline = new Date(internship.deadline).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <tr
      key={internship.id}
      className=" cursor-pointer group hover:shadow-2xl  transition-all duration-300 hover:-translate-x-3 hover:bg-cyan-50 group"
      onClick={() => {
        setInternshipWindow({
          active: true,
          internship: internship,
        });
      }}
    >
      <td className="p-4">
        <div className="text-base font-semibold text-slate-900 sm:text-lg md:text-xl tracking-wide group-hover:text-blue-800">
          {internship.company}
        </div>
        <div className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-500">
          {internship.role}
        </div>
      </td>
      <td className={`p-4 `}>
        <span
          className={`text-xs sm:text-xs md:text-sm lg:text-base inline-flex items-center px-4 py-1.5 rounded-3xl font-medium border ${statusStyle}`}
        >
          {statusName}
        </span>
      </td>

      <td className="p-4 text-gray-600">{deadline}</td>
      <td className="p-4 text-amber-600 font-semibold ">
        <div
          className="flex items-center gap-1
         flex-row"
        >
          <Star className=" fill-amber-400 w-6 h-6 text-amber-600  pb-1" />
          {averageScore}
        </div>
      </td>
      <td className="p-4 ">
        <div className=" flex items-center gap-2">
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
      </td>
    </tr>
  );
}
