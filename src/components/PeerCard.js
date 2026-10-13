import React, { useState } from "react";
import {
  MapPin,
  GraduationCap,
  UserPlus,
  UserCheck,
  Link as LinkIcon,
  Clock,
} from "lucide-react";
import { addNetwork, deleteNetwork } from "../tools/firebaseActions.js";
import { useUser } from "../context/InternshipContext.js";
import Link from "next/link.js";

/**
 * PeerCard Component
 * Drop this into your Discover.js grid!
 *
 * NOTE: In your actual Next.js app, replace the standard <a> tag wrapper
 * with import Link from 'next/link' and use <Link href={`/profile?u=${peer.username}`}>
 */
export const PeerCard = ({ peer }) => {
  const { user } = useUser();
  // Local state for the visual showcase (replace with your Firebase logic)
  const [isFollowing, setIsFollowing] = useState(false);
  const [connectState, setConnectState] = useState("connect"); // 'connect', 'requested', 'connected'

  const handleFollow = (e) => {
    e.preventDefault(); // Prevents the card from navigating to the profile
    e.stopPropagation();
    setIsFollowing(!isFollowing);
    addNetwork("following", peer.username, user.uid);
    addNetwork("followers", user.username, peer.id);
    // Add your Firebase logic here: await addNetwork("following", ...)
    // Add your Firebase logic here: await addNetwork("following", ...)
  };

  const handleConnect = (e) => {
    e.preventDefault(); // Prevents the card from navigating to the profile
    e.stopPropagation();

    if (connectState === "connect") {
      addNetwork("requests", user.username, peer.id);
      setConnectState("requested");
    } else if (connectState === "requested") {
      deleteNetwork("requests", user.username, peer.id);
      setConnectState("connect");
    } else if (connectState === "connected") {
      deleteNetwork("connections", user.username, peer.id);
      deleteNetwork("connections", peer.username, user.uid);
      setConnectState("connect");
    }

    // Add your Firebase logic here: await addNetwork("requests", ...)
  };

  return (
    <Link
      href={`/profile?u=${peer?.username}`} // Replace with your Next.js route: `/?u=${peer?.username}`
      className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-4 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 group relative overflow-hidden"
    >
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

      {/* Header: Avatar & Names */}
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-linear-to-br from-indigo-100 to-purple-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0 text-indigo-600 font-bold text-xl">
          {peer?.photoURL ? (
            <img
              src={peer.photoURL}
              alt={peer.displayName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            peer?.displayName?.charAt(0).toUpperCase() || "?"
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-700 transition-colors truncate">
            {peer?.displayName}
          </h3>
          <p className="text-sm font-semibold text-indigo-600 truncate">
            @{peer?.username}
          </p>
        </div>
      </div>

      {/* Context: Institution & Location */}
      <div className="flex flex-col gap-2.5 mt-2">
        {peer?.institution && (
          <div className="flex items-start gap-2.5 text-sm text-slate-600 font-medium">
            <GraduationCap className="w-4.5 h-4.5 text-slate-400 mt-0.5 shrink-0" />
            <span className="line-clamp-2 leading-snug">
              {peer.institution}
            </span>
          </div>
        )}
        {peer?.location && (
          <div className="flex items-start gap-2.5 text-sm text-slate-600 font-medium">
            <MapPin className="w-4.5 h-4.5 text-slate-400 mt-0.5 shrink-0" />
            <span className="truncate">{peer.location}</span>
          </div>
        )}
      </div>

      {/* Actions: Follow & Connect */}
      <div className="flex items-center gap-2 mt-auto pt-5">
        <button
          onClick={handleConnect}
          className={`
            flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer 
            ${
              connectState === "connect"
                ? "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
                : connectState === "requested"
                  ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                  : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
            }
          `}
        >
          {connectState === "connect" && (
            <>
              <LinkIcon className="w-4 h-4" /> Connect
            </>
          )}
          {connectState === "requested" && (
            <>
              <Clock className="w-4 h-4" /> Requested
            </>
          )}
          {connectState === "connected" && (
            <>
              <UserCheck className="w-4 h-4" /> Connected
            </>
          )}
        </button>

        <button
          onClick={handleFollow}
          className={`
            flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer
            ${
              isFollowing
                ? "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 border border-transparent"
                : "bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 shadow-sm"
            }
          `}
        >
          {isFollowing ? (
            <>Following</>
          ) : (
            <>
              <UserPlus className="w-4 h-4" /> Follow
            </>
          )}
        </button>
      </div>
    </Link>
  );
};
