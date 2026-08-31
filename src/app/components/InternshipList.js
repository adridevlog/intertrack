import { useTranslation } from "react-i18next";
import { STATUS_STYLES } from "../data/STATUS_STYLES";
import { Star, Bookmark } from "lucide-react";
import { calculateScore } from "../tools/functions";
import CompanyLogo from "./CompanyLogo";
import { updateInternship } from "../tools/functions";
import { useUser } from "../context/InternshipContext";

export default function InternshipList({
  internship,
  statusList,
  setInternshipWindow,
  evaluationWeights,
}) {
  const { t } = useTranslation();
  const statusListString = [
    t("board.toApply"),
    t("board.waitingForResponse"),
    t("board.consideringOffer"),
    t("board.accepted"),
  ];
  const { user } = useUser();
  let statusName;
  let statusStyle;
  const averageScore = calculateScore(internship.evaluation, evaluationWeights);
  const progress = (
    (Object.values(internship.requirements).filter((r) => r.done).length /
      internship.requirements.length) *
    100
  ).toFixed(0);
  statusList.map((s, i) => {
    let array = s.name.split(" ");
    array[0] = array[0].toLowerCase();
    if (array.join("") === internship.status) {
      statusName = statusListString[i];
      statusStyle =
        STATUS_STYLES[array.join("")] || "bg-gray-200 text-gray-800";
    }
  });
  const deadline = internship.deadline
    ? new Date(internship.deadline).toLocaleDateString(t("list.language"), {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : t("list.noDeadline");

  return (
    <tr
      key={internship.id}
      className={`border ${internship.marked ? "bg-amber-100 border-amber-200" : "bg-white border-slate-200"} cursor-pointer group hover:shadow-xl  transition-all duration-300 hover:-translate-x-2 hover:bg-blue-50 group relative`}
      onClick={() => {
        setInternshipWindow({
          active: true,
          internship: internship,
        });
      }}
    >
      <td className="px-4 py-6 flex items-center gap-4">
        <div className="absolute -top-0.75 left-3">
          {!internship.marked && (
            <Bookmark
              className=" w-6 h-6 text-gray-500 "
              onClick={(e) => {
                e.stopPropagation(); // Prevent the click from propagating to the parent div
                updateInternship(internship.id, { marked: true }, user);
              }}
            />
          )}
          {internship.marked && (
            <Bookmark
              className=" w-6 h-6 text-amber-600 fill-amber-400 "
              onClick={(e) => {
                e.stopPropagation(); // Prevent the click from propagating to the parent div
                updateInternship(internship.id, { marked: false }, user);
              }}
            />
          )}
        </div>
        <CompanyLogo companyName={internship.company} />
        <div>
          <div className="text-base font-semibold text-slate-900 sm:text-lg md:text-xl tracking-wide group-hover:text-blue-800">
            {internship.company}
          </div>
          <div className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-500">
            {internship.role}
          </div>
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
