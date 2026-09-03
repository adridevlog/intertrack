"use client";
import { useState } from "react";
import Image from "next/image";

export default function CompanyLogo({ companyName, size = 32 }) {
  const [hasError, setHasError] = useState(false);
  const token = process.env.NEXT_PUBLIC_LOGODEV_KEY;

  // 1. If no company name is typed yet, or the API image fails to load, show the fallback
  if (!companyName || hasError) {
    return (
      <div
        className="bg-indigo-100 text-indigo-700 font-black flex items-center justify-center rounded-md border border-indigo-200 shrink-0"
        style={{ width: size, height: size, fontSize: size * 0.5 }}
      >
        {companyName ? companyName.charAt(0).toUpperCase() : "🏢"}
      </div>
    );
  }

  // 2. The Smart Guess Algorithm:
  // "DeepMind" -> "deepmind.com"
  // "Google France" -> "googlefrance.com" (might fail, but falls back gracefully)
  const guessedDomain =
    companyName.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com";

  return (
    <div style={{ width: size, height: size }} className="relative shrink-0">
      <Image
        src={`https://img.logo.dev/${guessedDomain}?token=${token}&size=${size * 2}&format=png`}
        alt={`${companyName} logo`}
        fill
        className="rounded-md object-contain bg-white"
        onError={() => setHasError(true)} // Crucial: Triggers the fallback if our .com guess is wrong
        sizes={`${size}px`}
      />
    </div>
  );
}
