"use client";

import { useState } from "react";
import LayoutSelector from "./components/LayoutSelector";
import { INITIAL_DATA } from "./data/internships-mock";
import { List, LayoutGrid } from "lucide-react";
import StatusColumn from "./components/StatusColumn";

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
    <main className=" font-sans flex min-h-screen flex-col items-center justify-between p-24 bg-slate-50 ">
      <div className="w-full flex flex-row justify-between">
        <div className="flex flex-row text-black border border-gray-300 rounded-xl p-4 gap-2 bg-white">
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
        <div className="text-black">
          Sort by:
          <select className="ml-2 p-2 rounded">
            <option value="deadline">Deadline</option>
          </select>
        </div>
      </div>
      <div className="overflow-hidden w-full">
        {activeLayout === "board" && (
          <div className="flex flex-row overflow-x-auto flex-nowrap w-full gap-8">
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
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Company / Role</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Location</th>
                  <th className="p-4 font-semibold">Deadline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {internships.map((internship) => (
                  <tr
                    key={internship.id}
                    className="hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">
                        {internship.company}
                      </div>
                      <div className="text-sm text-slate-500">
                        {internship.role}
                      </div>
                    </td>
                    <td className="p-4">
                      {status.map((s) => {
                        let array = s.name.split(" ");
                        array[0] = array[0].toLowerCase();
                        if (array.join("") === internship.status) {
                          return s.name;
                        }
                      })}
                    </td>
                    <td className="p-4">{internship.place}</td>
                    <td className="p-4">
                      {new Date(internship.deadline).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
