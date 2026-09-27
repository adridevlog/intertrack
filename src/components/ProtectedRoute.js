"use client";

import { useUser } from "@/context/InternshipContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DashboardSkeleton } from "./Skeleton";

export default function ProtectedRoute({ children }) {
  // Make sure your InternshipContext exports a loading state!
  // e.g., const [authLoading, setAuthLoading] = useState(true);
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If Firebase has finished checking and there is NO user, kick them out
    if (!loading && !user) {
      router.replace("/login"); // Use replace so they can't hit "Back" to return to the dashboard
    }
  }, [user, loading, router]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  // If Firebase finishes and there is no user, return null to prevent a flash of the dashboard before the redirect fires
  if (!user) {
    return null;
  }

  // If there is a user, render the protected page
  return <>{children}</>;
}
