import InternshipBoard from "./InternshipBoard";
import { STATUS_STYLES } from "../data/STATUS_STYLES";

export default function StatusColumn({
  internships,
  name,
  setInternshipWindow,
  evaluationWeights,
  status,
  handleStatusChange,
}) {
  const filteredInternships = internships.filter((i) => i.status === status);
  const styleArray = name.split(" ");
  styleArray[0] = styleArray[0].toLowerCase();
  const statusStyle =
    STATUS_STYLES[styleArray.join("")] || "bg-gray-200 text-gray-800";

  const handleDragOver = (e) => {
    e.preventDefault(); // Crucial! Without this, the drop event will never fire.
  };

  const handleDrop = (e) => {
    e.preventDefault();

    // Read the ID we saved during onDragStart
    const draggedInternshipId = e.dataTransfer.getData("text/plain");

    // Do nothing if the ID is missing
    if (!draggedInternshipId) return;

    // Call a function to update our React State (we will write this in Step 3)
    handleStatusChange(draggedInternshipId, status); // 'status' is the column's target status (e.g., 'accepted')
  };
  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="flex flex-col min-w-100 grow-0 basis-auto shrink-0 gap-4 pb-14"
    >
      <div
        className={`rounded-xl font-semibold border px-5 py-3 text-lg flex flex-row justify-between ${statusStyle}`}
      >
        <div>{name}</div>
        <div>{filteredInternships.length}</div>
      </div>
      {filteredInternships.map((internship) => {
        return (
          <InternshipBoard
            key={internship.id}
            internship={internship}
            setInternshipWindow={setInternshipWindow}
            evaluationWeights={evaluationWeights}
          ></InternshipBoard>
        );
      })}
    </div>
  );
}
