"use client";

import { useState, useEffect } from "react";
import { Building, GraduationCap } from "lucide-react";
import DiscoverSelector from "../../components/DiscoverSelector.js";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
  getDiscoverPeers,
  getDiscoverPosts,
} from "../../tools/firebaseActions.js";
import { useUser } from "../../context/InternshipContext.js";
import Link from "next/link.js";
import { PeerCard } from "../../components/PeerCard.js";

export default function DiscoverPage() {
  const [activeDiscoverLayout, setActiveDiscoverLayout] = useState("peers");
  const [peers, setPeers] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [posts, setPosts] = useState([]);

  const [lastPeerDoc, setLastPeerDoc] = useState(null);
  const [lastPostDoc, setLastPostDoc] = useState(null);
  const [hasMorePeers, setHasMorePeers] = useState(true);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [peerPhase, setPeerPhase] = useState("institution"); // "institution" -> "location" -> "all"
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  const filterKnownPeers = (newPeers, currentUser) => {
    if (!currentUser) return newPeers;

    // Combine all known usernames into a single Set
    const knownUsernames = new Set([
      ...(currentUser.connections || []),
      ...(currentUser.followers || []),
      ...(currentUser.following || []),
      currentUser.username, // Always filter out the user's own profile!
    ]);

    // Keep only the peers whose username is NOT in the Set
    return newPeers.filter((peer) => !knownUsernames.has(peer.username));
  };

  const sortPeersByMutualConnections = (newPeers, currentUser) => {
    const myConnections = currentUser?.connections || [];

    return [...newPeers].sort((a, b) => {
      const aMutual = (a.connections || []).filter((c) =>
        myConnections.includes(c),
      ).length;
      const bMutual = (b.connections || []).filter((c) =>
        myConnections.includes(c),
      ).length;
      return bMutual - aMutual; // Highest mutual connections first
    });
  };

  useEffect(() => {
    if (!user) return;

    const loadInitialData = async () => {
      setLoading(true);
      // 1. Fetch Posts
      /*const postData = await getDiscoverPosts(null, 12);
      setPosts(postData.posts);
      setLastPostDoc(postData.lastDoc);
      if (postData.posts.length < 12) setHasMorePosts(false);*/

      let currentPhase = "institution";
      let currentLastDoc = null;
      let validNewPeers = [];
      let fetchedPeers = [];
      while (validNewPeers.length === 0 && currentPhase) {
        const result = await getDiscoverPeers(
          currentLastDoc,
          12,
          user,
          currentPhase,
        );
        fetchedPeers = result.peers;
        currentLastDoc = result.lastDoc;

        validNewPeers = filterKnownPeers(fetchedPeers, user);

        // If this phase dried up, prepare the next phase for the loop
        if (fetchedPeers.length < 12) {
          if (currentPhase === "institution") currentPhase = "location";
          else if (currentPhase === "location") currentPhase = "all";
          else {
            currentPhase = null;
          }
          currentLastDoc = null; // Reset pagination for the new phase
        }
      }

      // Update the global states so the "Load More" button knows exactly where to pick up
      setPeerPhase(currentPhase);
      setLastPeerDoc(currentLastDoc);
      if (!currentPhase) setHasMorePeers(false);

      if (validNewPeers.length > 0) {
        const sortedPeers = sortPeersByMutualConnections(validNewPeers, user);
        setPeers(sortedPeers);
      } else {
        setPeers([]); // Safely handle the case where literally no one exists
      }
      setLoading(false);
    };

    loadInitialData();
  }, [user]);

  const handleLoadMorePosts = async () => {
    if (!hasMorePosts) return;
    const moreData = await getDiscoverPosts(lastPostDoc, 12);
    setPosts((prev) => [...prev, ...moreData.posts]);
    setLastPostDoc(moreData.lastDoc);
    if (moreData.posts.length < 12) setHasMorePosts(false);
  };

  const handleLoadMorePeers = async () => {
    if (!hasMorePeers || !user) return;

    let currentPhase = peerPhase;
    let currentLastDoc = lastPeerDoc;
    let fetchedPeers = [];
    let validNewPeers = [];

    // We use a loop so if a phase returns 0 users, it auto-advances to the next phase
    // without making the user click "Load More" again and seeing nothing happen.
    while (validNewPeers.length === 0 && currentPhase) {
      const result = await getDiscoverPeers(
        currentLastDoc,
        12,
        user,
        currentPhase,
      );
      const fetchedPeers = result.peers;
      currentLastDoc = result.lastDoc;

      validNewPeers = filterKnownPeers(fetchedPeers, user);

      // If this phase dried up, prepare the next phase for the loop/next click
      if (fetchedPeers.length < 12) {
        if (currentPhase === "institution") currentPhase = "location";
        else if (currentPhase === "location") currentPhase = "all";
        else {
          currentPhase = null; // We reached the end of the internet
          setHasMorePeers(false);
        }
        currentLastDoc = null; // Reset pagination for the new phase
      }
    }

    setPeerPhase(currentPhase);
    setLastPeerDoc(currentLastDoc);

    if (validNewPeers.length > 0) {
      const sortedNewPeers = sortPeersByMutualConnections(validNewPeers, user);

      setPeers((prev) => {
        // Merge arrays and filter out duplicates.
        // Duplicates happen when Phase 2 (Location) fetches someone who was already fetched in Phase 1 (Institution).
        const combined = [...prev, ...sortedNewPeers];
        const uniquePeers = Array.from(
          new Map(combined.map((p) => [p.id, p])).values(),
        );

        // Remove the current user from the discover feed!
        return uniquePeers.filter((p) => p.id !== user.uid);
      });
    }
  };

  return (
    <main className="flex flex-col xl:flex-row pt-52 sm:pt-28 font-sans min-h-screen w-full h-full  p-8 bg-slate-50 gap-8">
      <div className="flex-2">Posts</div>
      <div className="flex-1 sticky border-2 p-2 rounded-lg ">
        <div className="flex flex-row text-black border border-gray-300 rounded-xl p-3 gap-2 bg-white">
          <DiscoverSelector
            name="Peers"
            Icon={GraduationCap}
            activeLayout={activeDiscoverLayout}
            setActiveLayout={setActiveDiscoverLayout}
            string={"Peers"}
          />
          <DiscoverSelector
            name="Institutions"
            Icon={Building}
            activeLayout={activeDiscoverLayout}
            setActiveLayout={setActiveDiscoverLayout}
            string={"Institutions"}
          />
        </div>
        <div>Filters</div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-6">
          {activeDiscoverLayout === "peers" &&
            peers.map((peer) => {
              console.log(peer);
              return <PeerCard key={peer.id} peer={peer} />;
            })}
        </div>
      </div>
    </main>
  );
}
