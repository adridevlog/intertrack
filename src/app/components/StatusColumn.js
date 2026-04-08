import InternshipBoard from "./InternshipBoard";

const STATUS_STYLES = {
  toApply: "bg-slate-100 border-slate-300 text-slate-600",
  waitingforResponse: "bg-amber-50 text-amber-700  border-amber-200",
  consideringOffer: "bg-blue-50 text-purple-700 border-blue-200",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function StatusColumn({ internships, name }) {
  console.log(name);
  const styleArray = name.split(" ");
  styleArray[0] = styleArray[0].toLowerCase();
  const statusStyle =
    STATUS_STYLES[styleArray.join("")] || "bg-gray-200 text-gray-800";

  console.log(styleArray.join(""));
  return (
    <div className="flex flex-col min-w-100 grow-0 basis-auto shrink-0 gap-4">
      <div
        className={`rounded-xl font-semibold border pl-4 py-4 text-xl ${statusStyle}`}
      >
        {name}
      </div>
      {internships.map((internship) => {
        return (
          <InternshipBoard
            key={internship.id}
            internship={internship}
          ></InternshipBoard>
        );
      })}
    </div>
  );
}
