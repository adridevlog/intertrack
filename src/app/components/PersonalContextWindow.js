import { updatePersonalContext } from "../tools/functions.js";
import { usePersonalContext } from "../context/InternshipContext.js";
import { useState } from "react";
import { useUser } from "../context/InternshipContext.js";
import { useTranslation } from "react-i18next";

export const PersonalContextWindow = () => {
  const { t } = useTranslation();
  const { personalContext, setPersonalContext } = usePersonalContext();
  const [formText, setFormText] = useState(personalContext.text || "");
  const { user } = useUser();

  const closeWindow = () => {
    setPersonalContext({ ...personalContext, active: false });
  };
  const handleSaveChanges = () => {
    updatePersonalContext({ text: formText }, user);
    setPersonalContext({ text: formText, active: false });
  };

  return (
    <div
      className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-120 px-backdrop-blur-xs"
      onClick={closeWindow} // Optional: closes when clicking outside
    >
      <div
        className="w-[90%] max-w-3xl h-[90%]  bg-white rounded-2xl shadow-2xl overflow-y-auto py-4 px-6 relative flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-2">
          <div className="text-lg sm:text-xl font-bold text-gray-800">
            {t("navbar.profile.personalContext.title")}
          </div>

          <button
            onClick={() =>
              setPersonalContext({ ...personalContext, active: false })
            }
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 
                  w-12 h-12 rounded-full font-bold text-xl cursor-pointer transition-all duration-100"
          >
            ✕
          </button>
        </div>
        <div className="text-gray-600 text-sm sm:text-base mb-4">
          {t("navbar.profile.personalContext.description")}
        </div>
        <textarea
          value={formText}
          onChange={(e) => setFormText(e.target.value)}
          className="w-full h-64 p-4 mt-4 border border-gray-300 rounded-lg  resize-none bg-gray-100 py-2 px-2 focus:outline-none focus:ring-4 focus:ring-gray-100 focus:bg-white text-lg text-gray-700 transition-all"
          placeholder="Enter your personal context here..."
        />
        <button
          className="text-white text-md bg-indigo-600 hover:bg-indigo-800 transition-all px-4 py-2 rounded-lg cursor-pointer font-medium tracking-wide mt-6"
          onClick={handleSaveChanges}
        >
          {t("navbar.profile.personalContext.saveButton")}
        </button>
      </div>
    </div>
  );
};
