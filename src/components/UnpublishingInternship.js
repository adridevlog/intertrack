import { updateInternship } from "@/tools/firebaseActions";

export default function UnpublishingInternship({
  setUnpublishingInternship,
  unpublishingInternship,
  user,
}) {
  const closeWindow = () => {
    setUnpublishingInternship(false);
  };
  return (
    <div
      className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-120 px-backdrop-blur-xs"
      onClick={closeWindow} // Optional: closes when clicking outside
    >
      <div
        className=" w-110 bg-white rounded-2xl shadow-2xl overflow-y-auto pb-6 px-6 pt-14 relative flex flex-col gap-12 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-lg text-center text-gray-700">
          Are you sure you want to unpublish this internship?
        </p>
        <div className="flex justify-between items-center">
          <button
            className="hover:bg-slate-100 hover:text-gray-800 rounded-lg px-5 py-3 text-xl text-gray-600 font-medium  transition-all cursor-pointer"
            onClick={closeWindow}
          >
            Cancel
          </button>
          <button
            className="hover:bg-slate-100 hover:text-red-700 rounded-lg px-5 py-3 text-xl text-red-600 font-medium  transition-all cursor-pointer"
            onClick={() => {
              updateInternship(
                unpublishingInternship.internship.id,
                { isPublic: false },
                user,
              );
              closeWindow();
            }}
          >
            Unpublish
          </button>
        </div>
      </div>
    </div>
  );
}
