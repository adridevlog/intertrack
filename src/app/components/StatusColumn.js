import InternshipBoard from "./InternshipBoard";
import { STATUS_STYLES } from "../data/STATUS_STYLES";

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
        className={`rounded-xl font-semibold border px-5 py-3 text-lg flex flex-row justify-between ${statusStyle}`}
      >
        <div>{name}</div>
        <div>{internships.length}</div>
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
