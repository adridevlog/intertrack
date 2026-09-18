import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Check, AlertTriangle, RotateCcw } from "lucide-react";

export default function HoldToConfirmButton({
  onComplete,
  duration = 2.5,
  id,
  formData,
  setFormData,
  updateInternship,
  user,
}) {
  const [isPressing, setIsPressing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(formData.status === "deleted");
  const isPressingRef = useRef(false);

  // Pointer events handle both mouse and touch screens beautifully
  const handlePointerDown = (e) => {
    // Prevent default to avoid selecting text or triggering context menus on mobile
    e.preventDefault();
    if (isCompleted) return;

    isPressingRef.current = true;
    setIsPressing(true);
  };

  const handlePointerUp = () => {
    isPressingRef.current = false;
    setIsPressing(false);
  };

  const handleReset = () => {
    const newFormData = { ...formData, status: "accepted" };
    updateInternship(id, newFormData, user);
    setFormData(newFormData);
    setIsCompleted(false);
    setIsPressing(false);
    isPressingRef.current = false;
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        {/* Explosion/Ripple Effect upon completion */}
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0.8, scale: 1 }}
              animate={{ opacity: 0, scale: 1.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 bg-emerald-500 rounded-2xl pointer-events-none"
            />
          )}
        </AnimatePresence>

        <motion.button
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          // Mobile safeguards
          style={{
            WebkitTapHighlightColor: "transparent",
            touchAction: "none",
          }}
          className={`
            relative overflow-hidden rounded-2xl border 
            flex items-center justify-center px-8 py-4 w-72 h-16
            select-none cursor-pointer transition-colors duration-300
            ${
              isCompleted
                ? "bg-emerald-500/10 border-emerald-500/50"
                : "bg-gray-800/50 border-gray-700 hover:border-gray-600"
            }
          `}
          whileTap={!isCompleted ? { scale: 0.96 } : { scale: 1 }}
        >
          {/* Progress Bar Background */}
          {!isCompleted && (
            <motion.div
              className="absolute left-0 top-0 bottom-0 bg-linear-to-r from-red-600 to-rose-500 z-0"
              initial={{ width: "0%" }}
              animate={{ width: isPressing ? "100%" : "0%" }}
              transition={{
                duration: isPressing ? duration : 0.4,
                ease: isPressing ? "linear" : "easeOut",
              }}
              onAnimationComplete={() => {
                // If animation reaches 100% and we are STILL pressing
                if (isPressingRef.current && isPressing) {
                  setIsCompleted(true);
                  if (onComplete) onComplete();
                }
              }}
            />
          )}

          {/* Button Content */}
          <div className="relative z-10 flex items-center gap-3 w-full justify-center">
            <AnimatePresence mode="wait">
              {isCompleted ? (
                <motion.div
                  key="completed"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="flex items-center gap-2 text-emerald-400 font-semibold"
                >
                  <Check size={20} strokeWidth={3} />
                  <span>Deleted</span>
                </motion.div>
              ) : (
                <motion.div
                  key="pressing"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  className={`flex items-center gap-2 font-medium transition-colors duration-300 ${isPressing ? "text-white" : "text-gray-300"}`}
                >
                  <Trash2
                    size={20}
                    className={isPressing ? "animate-pulse" : ""}
                  />
                  <span className="w-32 text-left">
                    {isPressing ? "Keep holding..." : "Hold to Delete"}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.button>
      </div>

      {/* Reset Button (For demo purposes) */}
      <AnimatePresence>
        {isCompleted && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleReset}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            <RotateCcw size={14} />
            Reset Demo
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
