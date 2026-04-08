"use client";
import { motion } from "motion/react";

export default function LayoutSelector({
  name,
  Icon,
  activeLayout,
  setActiveLayout,
}) {
  const bg =
    activeLayout === name.toLowerCase()
      ? "transparent text-blue-600"
      : "transparent text-gray-600";
  return (
    <motion.div
      className="relative flex flex flex-row items-center"
      onClick={() => {
        setActiveLayout(name.toLowerCase());
      }}
      whileTap={{ scale: 0.85 }}
    >
      {activeLayout === name.toLowerCase() && (
        <motion.div
          className="bg-blue-50 absolute rounded-xl top-0 left-0 w-full h-full"
          layoutId="layout-indicator"
          style={{ boxShadow: "0px 4px 20px rgba(59, 130, 246, 0.4)" }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 22,
            mass: 0.8, // Adjust these to make the sliding faster or bouncier
          }}
        ></motion.div>
      )}
      <div
        className={`z-10 flex flex-row gap-4 py-4 px-4 rounded-xl hover:bg-gray-100 cursor-pointer ${bg}`}
      >
        <Icon className="w-7 h-7" />
        <span className="text-xl font-semibold">{name}</span>
      </div>
    </motion.div>
  );
}
