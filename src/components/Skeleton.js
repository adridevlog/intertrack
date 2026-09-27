export function Skeleton({ className }) {
  // bg-slate-200 gives it that light gray placeholder color
  // animate-pulse creates the breathing effect
  return <div className={`bg-slate-200 animate-pulse ${className}`}></div>;
}

export default function ProfileSkeleton() {
  return (
    <div className="relative flex flex-col gap-8 w-full">
      {/* Cover Photo Skeleton */}
      <section className="rounded-2xl border border-gray-200 overflow-hidden">
        <Skeleton className="h-48 w-full" />

        <div className="w-full p-8 relative pt-16 bg-white flex flex-col">
          {/* Avatar Cutout Skeleton */}
          <div className="absolute -top-13 left-6 bg-white rounded-full p-1 w-26 h-26 z-20">
            <Skeleton className="w-full h-full rounded-full" />
          </div>

          {/* Name and Username */}
          <Skeleton className="h-8 w-64 rounded-md mb-2" />
          <Skeleton className="h-5 w-32 rounded-md mb-4" />

          {/* Institution and Location Pills */}
          <div className="flex gap-5">
            <Skeleton className="h-8 w-40 rounded-lg" />
            <Skeleton className="h-8 w-32 rounded-lg" />
          </div>
        </div>
      </section>

      {/* About Section Skeleton */}
      <section className="rounded-2xl border border-gray-200 overflow-hidden p-8 bg-white">
        <Skeleton className="h-6 w-24 rounded-md mb-4" />
        <Skeleton className="h-4 w-full rounded-md mb-2" />
        <Skeleton className="h-4 w-5/6 rounded-md mb-2" />
        <Skeleton className="h-4 w-4/6 rounded-md" />
      </section>
    </div>
  );
}

export function LoginSkeleton() {
  return (
    <div className=" min-h-screen bg-slate-50  fixed inset-0  flex items-center justify-center z-120 px-backdrop-blur-xs">
      <Skeleton className="absolute flex items-center  rounded-lg top-2 right-2"></Skeleton>
      <div className="flex w-122 h-70 flex-col items-center bg-white rounded-xl shadow-lg gap-2 p-9">
        <Skeleton className=" h-10 w-54 rounded-md mb-4"></Skeleton>
        <Skeleton className="h-6 w-full rounded-md"></Skeleton>
        <Skeleton className="mt-4 h-13 w-full rounded-md mb-4"></Skeleton>
        <Skeleton className="h-6 w-54 rounded-md mb-4"></Skeleton>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <main className="2xl:px-50 3xl:px-60 pt-52 sm:pt-36 font-sans flex min-h-screen h-full flex-col  p-8 bg-slate-50 ">
      <div className="w-full flex flex-col sm:flex-row justify-between gap-10 items-start sm:items-center">
        <Skeleton className="rounded-xl w-60 h-18"></Skeleton>
        <Skeleton className="rounded-xl w-80 h-13"></Skeleton>
      </div>

      <Skeleton className="mt-8 rounded-full w-36 h-12"></Skeleton>
      <Skeleton className="mt-10 w-full h-400"></Skeleton>
    </main>
  );
}
