"use client";

import {
  getUserByUsername,
  updateUserDoc,
  deleteNetwork,
  addNetwork,
} from "@/tools/firebaseActions.js";
import { useState, useEffect } from "react";
import { useUser, useProfile } from "@/context/InternshipContext";
import { motion } from "motion/react";
import Link from "next/link";
import { Check, X } from "lucide-react";

export default function Network() {
  const [activeView, setActiveView] = useState("connections");
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const [networkData, setNetworkData] = useState({
    connections: [],
    followers: [],
    following: [],
    requests: [],
  });
  const [networkSearchQuery, setNetworkSearchQuery] = useState("");

  const filteredNetworkData = networkData?.[activeView]?.filter(
    (connection) => {
      const searchLower = networkSearchQuery.toLowerCase();
      return (
        connection.displayName?.toLowerCase().includes(searchLower) ||
        connection.username?.toLowerCase().includes(searchLower)
      );
    },
  );

  useEffect(() => {
    const fetchNetworkData = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const connectionPromises = (user.connections || []).map(
            (conn) => getUserByUsername(conn), // Adjust this if the property is named differently
          );
          const followerPromises = (user.followers || []).map((foll) =>
            getUserByUsername(foll),
          );
          const followingPromises = (user.following || []).map((foll) =>
            getUserByUsername(foll),
          );
          const requestPromises = (user.requests || []).map((req) =>
            getUserByUsername(req),
          );

          const [connectionsData, followersData, followingData, requestsData] =
            await Promise.all([
              Promise.all(connectionPromises),
              Promise.all(followerPromises),
              Promise.all(followingPromises),
              Promise.all(requestPromises),
            ]);

          setNetworkData({
            connections: connectionsData.filter(Boolean),
            followers: followersData.filter(Boolean),
            following: followingData.filter(Boolean),
            requests: requestsData.filter(Boolean),
          });
        } catch (error) {
          console.error("Error fetching network data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchNetworkData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-gray-500">
        Loading network...
      </div>
    );
  }

  return (
    <main className="flex flex-col pt-52 sm:pt-28 font-sans w-full h-full xl:px-60 p-8 bg-slate-50 gap-8">
      <div className="flex-1 flex gap-2 mb-3 h-10">
        {["connections", "followers", "following", "requests"].map((view) => (
          <div
            key={view}
            className="text-slate-700 px-5 py-3 rounded-lg relative cursor-pointer font-medium capitalize flex items-center justify-center transition-colors"
            onClick={() => setActiveView(view)}
          >
            {activeView === view && (
              <motion.div
                layoutId="networkTabIndicator"
                className="absolute inset-0 bg-indigo-200/40 border-b-4 border-indigo-400 rounded-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}

            <span className="relative z-10">{view}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 items-baseline justify-start w-full">
        <input
          className="outline-none py-2 px-4 w-60 text-gray-500 rounded-full mb-4 bg-slate-100 text-lg placeholder:text-gray-400 
          focus:bg-white
          focus:ring-amber-200 focus:ring-2 transition-all"
          placeholder="Search..."
          value={networkSearchQuery}
          onChange={(e) => setNetworkSearchQuery(e.target.value)}
        ></input>
        {filteredNetworkData?.map((connection) => {
          if (!connection) return null;

          return (
            <Link
              href={`/profile?u=${connection.username}`}
              key={connection.id}
              className="flex items-center gap-4 py-4 px-6 border border-gray-100 rounded-xl hover:shadow-md transition-all text-black w-full justify-between"
            >
              <div className="flex items-center gap-4 relative">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xl">
                  {connection.username?.[0]?.toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-800">
                    {connection.displayName}
                  </span>
                  <span className="text-sm text-gray-500">
                    @{connection.username}
                  </span>
                </div>
                <div className="text-sm text-blue-500 hover:underline transition-all absolute top-1 left-31 text-nowrap">
                  &#183; Visit profile
                </div>
              </div>
              <div className="">
                <span className="text-sm text-gray-500">
                  {connection.status}
                </span>
              </div>
              {activeView !== "requests" ? (
                <button
                  className="text-red-500 hover:text-red-700 cursor-pointer transition-all px-4 py-2 rounded-lg hover:bg-red-50"
                  onClick={(e) => {
                    e.preventDefault();
                    deleteNetwork(activeView, connection.username, user.uid);
                    if (activeView === "connections") {
                      deleteNetwork(
                        "connections",
                        user.username,
                        connection.id,
                      );
                    } else if (activeView === "followers") {
                      deleteNetwork("following", user.username, connection.id);
                    } else if (activeView === "following") {
                      deleteNetwork("followers", user.username, connection.id);
                    }
                  }}
                >
                  Remove
                </button>
              ) : (
                <div className="flex flex-row gap-2 items-center">
                  <button
                    className="text-green-500 hover:text-green-700 cursor-pointer transition-all px-4 py-2 rounded-lg hover:bg-green-50"
                    onClick={(e) => {
                      try {
                        addNetwork(
                          "connections",
                          connection.username,
                          user.uid,
                        );
                        addNetwork("connections", user.username, connection.id);
                        deleteNetwork(
                          "requests",
                          connection.username,
                          user.uid,
                        );
                        deleteNetwork("requests", user.username, connection.id);
                      } catch (error) {
                        console.error("Error adding connection:", error);
                      }
                      e.preventDefault();
                    }}
                  >
                    <Check className="w-6 h-6" />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700 cursor-pointer transition-all px-4 py-2 rounded-lg hover:bg-red-50"
                    onClick={(e) => {
                      e.preventDefault();
                      deleteNetwork("requests", connection.username, user.uid);
                      deleteNetwork("requests", user.username, connection.id);
                    }}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </main>
  );
}
