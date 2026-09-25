export default function Terms() {
  return (
    <main className="flex flex-col pt-52 sm:pt-32 font-sans min-h-screen w-full h-full px-8 sm:px-10 lg:px-20 xl:px-40  bg-slate-50 gap-8 text-gray-800 pb-16">
      <h2 className="text-2xl text-gray-800 font-semibold">Terms of Service</h2>
      <p>
        <strong>Effective Date:</strong> September 23, 2026
      </p>

      <h3 className="text-xl font-medium">1. Acceptance of Terms</h3>
      <p>
        By accessing or using Interntrack, you agree to be bound by these Terms
        of Service. If you do not agree, please do not use the platform.
      </p>

      <h3 className="text-xl font-medium">
        2. Nature of the Platform & Disclaimer of Affiliation
      </h3>
      <p>
        Interntrack is an independent student portfolio project designed to help
        students track and evaluate internship applications. It is strictly a
        free, non-commercial tool. Interntrack is <strong>not</strong>{" "}
        officially affiliated with, endorsed by, or sponsored by École
        Polytechnique or any of the companies, laboratories, or institutions
        mentioned in user profiles or internship logs.
      </p>

      <h3 className="text-xl font-medium">3. User-Generated Content</h3>
      <p>
        You retain ownership of the data and reviews you post on Interntrack.
        However, by setting your profile or internships to &ldquo;Public&rdquo;,
        you grant us permission to display this content to other users.
      </p>
      <ul>
        <li>
          You are solely responsible for the content you publish, including
          personal reviews of companies.
        </li>
        <li>
          You agree not to post content that is defamatory, illegal, abusive, or
          explicitly violates the privacy of others.
        </li>
        <li>
          We reserve the right to remove any content or terminate accounts that
          violate these guidelines or degrade the integrity of the platform.
        </li>
      </ul>

      <h3 className="text-xl font-medium">4. Limitation of Liability</h3>
      <p>
        Interntrack is provided on an &ldquo;AS IS&ldquo; and &ldquo;AS
        AVAILABLE&ldquo; basis. While we strive to keep the platform secure and
        functional, we make no warranties regarding data loss, uptime, or the
        absolute accuracy of the platform. We shall not be held liable for any
        damages arising from your use of the service.
      </p>

      <h3 className="text-xl font-medium">5. Governing Law</h3>
      <p>
        These Terms shall be governed and construed in accordance with the laws
        of Spain, without regard to its conflict of law provisions.
      </p>
    </main>
  );
}
