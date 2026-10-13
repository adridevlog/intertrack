const API_URL = "http://universities.hipolabs.com";
import { useState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";

export default function EducationInstitution({ formData, setFormData }) {
  const firstRender = useRef(true);
  const [institutionsList, setInstitutionsList] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchInstitutions = async () => {
      if (firstRender.current) {
        firstRender.current = false;
        return;
      }
      if (
        formData.institution.trim() === "" ||
        formData.institution.length < 3
      ) {
        setInstitutionsList([]);
        setShowDropdown(false);
        return;
      }
      try {
        const response = await fetch(
          `${API_URL}/search?name=${formData.institution}`,
        );
        const data = await response.json();
        setInstitutionsList(data);
        setShowDropdown(true);
      } catch (error) {
        console.error("Error fetching institutions:", error);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchInstitutions();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [formData.institution]);

  return (
    <div className="relative">
      <input
        className="text-md text-gray-700 focus:outline-none bg-gray-100 focus:bg-white focus:ring-3  ring-blue-50 rounded-lg font-medium px-3 py-0.5 w-60"
        value={formData.institution}
        onChange={(e) => {
          setFormData((prev) => ({
            ...prev,
            institution: e.target.value,
          }));
          setShowDropdown(true);
        }}
      />

      {showDropdown && (
        <div className="absolute top-8 -left-8 overflow-y-scroll max-h-50 w-80 border border-gray-300 rounded-lg bg-white z-10">
          {institutionsList.length > 0 &&
            institutionsList
              .filter(
                (institution, index, self) =>
                  index === self.findIndex((t) => t.name === institution.name),
              )
              .map((institution) => (
                <div
                  key={institution.name}
                  className="bg-white text-gray-700 hover:bg-gray-100 cursor-pointer px-3 py-2"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      institution: institution.name,
                    }));
                    setShowDropdown(false);
                  }}
                >
                  {institution.name}
                  <span className="text-gray-500 text-sm ml-2">
                    {institution.country}
                  </span>
                  <span className="text-gray-400 text-sm ml-2">
                    {institution.alpha_two_code}
                  </span>
                </div>
              ))}
          <div
            className="bg-slate-50 text-indigo-600 hover:bg-indigo-100 font-medium cursor-pointer px-4 py-3 text-sm flex items-center justify-between"
            onClick={() => {
              setShowDropdown(false);
            }}
          >
            <span>Use "{formData.institution}"</span>
            <Plus className="w-4 h-4" />
          </div>
        </div>
      )}
    </div>
  );
}
