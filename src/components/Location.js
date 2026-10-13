import { useState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";

const API_URL = "https://geocoding-api.open-meteo.com/v1";

export default function Location({ formData, setFormData }) {
  const firstRender = useRef(true);
  const [locationsList, setLocationsList] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      if (firstRender.current) {
        firstRender.current = false;
        return;
      }
      if (formData.location.trim() === "" || formData.location.length < 3) {
        setLocationsList([]);
        setShowDropdown(false);
        return;
      }
      try {
        const response = await fetch(
          `${API_URL}/search?name=${formData.location}`,
        );
        const data = await response.json();
        setLocationsList(data.results || []);
        setShowDropdown(true);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchLocations();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [formData.location]);

  return (
    <div className="relative">
      <input
        className="text-md text-gray-700 focus:outline-none bg-gray-100 focus:bg-white focus:ring-3  ring-blue-50 rounded-lg font-medium px-3 py-0.5 w-60"
        placeholder="Enter location"
        value={formData.location}
        onChange={(e) => {
          setFormData((prev) => ({
            ...prev,
            location: e.target.value,
          }));
          setShowDropdown(true);
        }}
      />

      {showDropdown && (
        <div className="absolute top-8 -left-8 overflow-y-scroll max-h-50 w-80 border border-gray-300 rounded-lg bg-white z-10">
          {locationsList.length > 0 &&
            locationsList
              .filter(
                (institution, index, self) =>
                  index ===
                  self.findIndex(
                    (t) =>
                      t.name === institution.name &&
                      t.admin1 === institution.admin1 &&
                      t.country === institution.country,
                  ),
              )
              .map((location) => {
                return (
                  <div
                    key={`${location.name}-${location.admin1}-${location.country}`}
                    className="bg-white text-gray-700 hover:bg-gray-100 cursor-pointer px-3 py-2"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        location: `${location.admin1}, ${location.country}`,
                      }));
                      setShowDropdown(false);
                    }}
                  >
                    {location.name}
                    <span className="text-gray-500 text-sm ml-2">
                      {location.admin1}
                    </span>
                    <span className="text-gray-400 text-sm ml-2">
                      {location.country}
                    </span>
                  </div>
                );
              })}
          <div
            className="bg-slate-50 text-indigo-600 hover:bg-indigo-100 font-medium cursor-pointer px-4 py-3 text-sm flex items-center justify-between"
            onClick={() => {
              setShowDropdown(false);
            }}
          >
            <span>Use "{formData.location}"</span>
            <Plus className="w-4 h-4" />
          </div>
        </div>
      )}
    </div>
  );
}
