/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // 1. Tells Next.js to generate the static 'out' folder
  basePath: "/interntrack", // 2. Fixes your asset paths so they don't 404 in the subfolder
  reactCompiler: true,
  images: {
    unoptimized: true, // 3. Disables server-side image optimization (required for static exports)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.logo.dev",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
