"use client";

import { useState, useEffect } from "react";
import LayoutSelector from "./components/LayoutSelector";
import { INITIAL_DATA } from "./data/internships-mock";
import { INITIAL_evaluationWeights } from "./data/evaluationWeights-mock";
import { List, LayoutGrid } from "lucide-react";
import StatusColumn from "./components/StatusColumn";
import InternshipList from "./components/InternshipList";
import InternshipWindow from "./components/InternshipWindow";
import { useInternship } from "./context/InternshipContext.js";
import { calculateScore } from "./tools/functions";

export default function Home() {
  const [activeLayout, setActiveLayout] = useState("board");
  const { internshipWindow, setInternshipWindow, internships, setInternships } =
    useInternship();
  const [evaluationWeights, setEvaluationWeights] = useState(
    INITIAL_evaluationWeights,
  );
  const [sort, setSort] = useState("status");

  const statusList = [
    {
      name: "To Apply",
      status: "toApply",
    },
    {
      name: "Waiting for Response",
      status: "waitingforResponse",
    },
    {
      name: "Considering Offer",
      status: "consideringOffer",
    },
    {
      name: "Accepted",
      status: "accepted",
    },
  ];

  const updateInternshipStatus = (internshipId, newStatus) => {
    setInternships((prevInternships) => {
      return prevInternships.map((intern) => {
        // Find the one we dragged
        if (intern.id === internshipId) {
          // Return a copy of it with the updated status
          return { ...intern, status: newStatus };
        }
        // Leave all other internships exactly as they are
        return intern;
      });
    });
  };

  useEffect(() => {
    if (internshipWindow.active) {
      // Prevent scrolling on the body
      document.body.style.overflow = "hidden";
    } else {
      // Restore scrolling
      document.body.style.overflow = "unset";
    }

    // Cleanup function in case the component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [internshipWindow.active]); // Re-run this whenever the window opens or closes

  let sortedInternships = [...internships];

  if (sort === "status") {
    sortedInternships.sort((a, b) => {
      return (
        statusList.findIndex((s) => s.status === b.status) -
        statusList.findIndex((s) => s.status === a.status)
      );
    });
  } else if (sort === "evaluation") {
    sortedInternships.sort((a, b) => {
      const scoreA = calculateScore(a.evaluation, evaluationWeights);
      const scoreB = calculateScore(b.evaluation, evaluationWeights);
      return scoreB - scoreA; // Sort descending
    });
  } else if (sort === "deadline") {
    sortedInternships.sort(
      (a, b) => new Date(a.deadline) - new Date(b.deadline),
    );
  } else if (sort === "progress") {
    sortedInternships.sort((a, b) => {
      const progressA =
        Object.values(a.requirements).filter((r) => r.done).length /
        a.requirements.length;
      const progressB =
        Object.values(b.requirements).filter((r) => r.done).length /
        b.requirements.length;
      return progressB - progressA; // Sort descending
    });
  }

  return (
    <main className="mt-22 pt-14 font-sans flex min-h-screen h-full flex-col items-center justify-between p-8 bg-slate-50 ">
      {internshipWindow?.active && (
        <InternshipWindow
          internship={internshipWindow?.internship}
          setInternships={setInternships}
          setInternshipWindow={setInternshipWindow}
          statusList={statusList}
          evaluationWeights={evaluationWeights}
          internships={sortedInternships}
        ></InternshipWindow>
      )}
      <div
        className={`w-full max-w-7xl flex flex-col gap-8 transition-all duration-300 ${
          internshipWindow.active
            ? "blur-md pointer-events-none select-none"
            : ""
        }`}
      >
        <div className="w-full flex flex-row justify-between items-center">
          <div className="flex flex-row text-black border border-gray-300 rounded-xl p-3 gap-2 bg-white">
            <LayoutSelector
              name="Board"
              Icon={LayoutGrid}
              activeLayout={activeLayout}
              setActiveLayout={setActiveLayout}
            />
            <LayoutSelector
              name="List"
              Icon={List}
              activeLayout={activeLayout}
              setActiveLayout={setActiveLayout}
            />
          </div>
          <div className="text-gray-500 font-semibold">
            Sort by:
            <select
              className="ml-2 p-2 font-medium text-gray-600 bg-white ring-2 ring-gray-200 rounded focus:ring-2 focus:ring-blue-500 active:ring-0"
              onChange={(e) => setSort(e.target.value)}
              value={sort}
            >
              <option value="status">Status</option>
              <option value="evaluation">Evaluation score</option>
              <option value="deadline">Deadline</option>
              <option value="progress">Requirements progress</option>
            </select>
          </div>
        </div>
        <div className="overflow-hidden w-full">
          {activeLayout === "board" && (
            <div className="flex flex-row overflow-x-auto flex-nowrap w-full gap-5">
              {statusList.map((statusItem) => {
                const { name, status } = statusItem;
                return (
                  <StatusColumn
                    key={name}
                    name={name}
                    internships={sortedInternships}
                    status={status}
                    setInternshipWindow={setInternshipWindow}
                    evaluationWeights={evaluationWeights}
                    handleStatusChange={updateInternshipStatus}
                  ></StatusColumn>
                );
              })}
            </div>
          )}
          {activeLayout === "list" && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden overflow-x-auto flex-nowrap">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 md:text-md lg:text-lg uppercase tracking-wider">
                    <th className="p-4 font-semibold">Company / Role</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Deadline</th>
                    <th className="p-4 font-semibold">Score</th>
                    <th className="p-4 font-semibold">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedInternships.map((internship) => (
                    <InternshipList
                      key={internship.id}
                      internship={internship}
                      statusList={statusList}
                      setInternshipWindow={setInternshipWindow}
                      evaluationWeights={evaluationWeights}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
