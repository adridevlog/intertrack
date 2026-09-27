"use client";

import { Globe } from "lucide-react";
import { useUser } from "@/context/InternshipContext";
import { signInWithPopup } from "firebase/auth";
import { googleProvider } from "../../../firebase";
import { auth } from "../../../firebase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginSkeleton } from "@/components/Skeleton";
const dictionnary = {
  en: {
    description: "The intelligent internship tracking solution for students.",
    button: "Sign in with Google",
    footer: "Securely synced with Firebase.",
  },
  es: {
    description:
      "La solución inteligente para estudiantes que monitoriza prácticas",
    button: "Inicia sesión con Google",
    footer: "Sincronizado de forma segura con Firebase.",
  },
};

export default function Login() {
  const [language, setLanguage] = useState("en");
  const { user, loading } = useUser();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  useEffect(() => {
    // REVERSE GUARD: If they are already logged in, send them to the dashboard
    if (!loading && user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading || user) {
    return <LoginSkeleton />;
  }

  return (
    <div className="  min-h-screen bg-slate-50  fixed inset-0  flex items-center justify-center z-120 px-backdrop-blur-xs">
      <div className="absolute flex items-center gap-2 bg-gray-100 rounded-lg p-2 top-2 right-2">
        <Globe className="w-5 h-5 text-gray-500" />
        <select
          onChange={(e) => {
            setLanguage(e.target.value);
          }}
          className="bg-transparent text-gray-700 font-medium focus:outline-none cursor-pointer"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </div>
      <div className="flex p-10 flex-col items-center justify-center gap-2 bg-white rounded-xl shadow-lg">
        <p className="text-3xl font-black text-slate-900 font-sans">
          InternTrack
        </p>
        <p className="text-base text-slate-500 font-medium">
          {dictionnary[language].description}
        </p>
        <button
          onClick={handleLogin}
          className="mt-6 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-log-in w-5 h-5"
            aria-hidden="true"
          >
            <path d="m10 17 5-5-5-5"></path>
            <path d="M15 12H3"></path>
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
          </svg>
          {dictionnary[language].button}
        </button>
        <p className="mt-6 text-xs text-slate-400 flex items-center justify-center gap-1">
          {dictionnary[language].footer}
        </p>
      </div>
    </div>
  );
}
