import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./components/Navbar";
import { InternshipProvider } from "./context/InternshipContext.js";
import I18nProvider from "./context/I18nProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "InternTrack",
  description: "Track and evaluate your internships",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <I18nProvider>
          <InternshipProvider>
            <NavBar></NavBar>
            {children}
          </InternshipProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
