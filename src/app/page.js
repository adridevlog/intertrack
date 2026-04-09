"use client";

import { useState } from "react";
import LayoutSelector from "./components/LayoutSelector";
import { INITIAL_DATA } from "./data/internships-mock";
import { List, LayoutGrid } from "lucide-react";
import StatusColumn from "./components/StatusColumn";
import InternshipList from "./components/InternshipList";

export default function Home() {
  const [activeLayout, setActiveLayout] = useState("board");
  const [internships, setInternships] = useState(INITIAL_DATA);
  const initialStatus = [
    {
      name: "To Apply",
      internships: internships.filter(
        (internship) => internship.status === "toApply",
      ),
    },
    {
      name: "Waiting for Response",
      internships: internships.filter(
        (internship) => internship.status === "waitingforResponse",
      ),
    },
    {
      name: "Considering Offer",
      internships: internships.filter(
        (internship) => internship.status === "consideringOffer",
      ),
    },
    {
      name: "Accepted",
      internships: internships.filter(
        (internship) => internship.status === "accepted",
      ),
    },
  ];
  console.log(initialStatus);

  const [status, setStatus] = useState(initialStatus);
  return (
    <main className=" font-sans flex min-h-screen flex-col items-center justify-between p-8 bg-slate-50 ">
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
          <select className="ml-2 p-2 font-medium text-gray-600 bg-white ring-2 ring-gray-200 rounded focus:ring-2 focus:ring-blue-500 active:ring-0">
            <option value="status">Status (Default)</option>
            <option value="evaluation">Evaluation score (Default)</option>
            <option value="deadline">Deadline</option>
            <option value="progress">Requirements progress (Default)</option>
          </select>
        </div>
      </div>
      <div className="overflow-hidden w-full">
        {activeLayout === "board" && (
          <div className="flex flex-row overflow-x-auto flex-nowrap w-full gap-5">
            {status.map((statusItem) => {
              const { name, internships } = statusItem;
              return (
                <StatusColumn
                  key={name}
                  name={name}
                  internships={internships}
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
                {internships.map((internship) => (
                  <InternshipList
                    key={internship.id}
                    internship={internship}
                    status={status}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
