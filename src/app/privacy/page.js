export default function Privacy() {
  return (
    <main className="flex flex-col pt-52 sm:pt-32 font-sans min-h-screen w-full h-full px-8 sm:px-10 lg:px-20 xl:px-40  bg-slate-50 gap-8 text-gray-800 pb-16">
      <h2 className="text-2xl text-gray-800 font-semibold">Privacy Policy</h2>
      <p>
        <strong>Effective Date:</strong> September 23, 2026
      </p>

      <h3 className="text-xl font-medium">1. Introduction</h3>
      <p>
        Welcome to Interntrack. This Privacy Policy explains how your personal
        information is collected, used, and protected when you use our platform.
        Interntrack is currently operated as a free, independent student
        project. By using the service, you consent to the practices described in
        this policy.
      </p>

      <h3 className="text-xl font-medium">2. Information We Collect</h3>
      <p>
        We collect information to provide and improve our service. This
        includes:
      </p>
      <ul>
        <li>
          <strong>Account Information:</strong> Your email address and
          authentication details when you sign up.
        </li>
        <li>
          <strong>Profile Data:</strong> Information you choose to provide, such
          as your username, display name, institution, location, technical
          skills, and a personal bio.
        </li>
        <li>
          <strong>User-Generated Content:</strong> The internship logs, personal
          reviews, evaluation criteria, and statuses you actively add to your
          profile.
        </li>
        <li>
          <strong>Usage Data:</strong> We use Google Analytics to understand how
          visitors interact with the site (e.g., page views, time spent, and
          general geographic region).
        </li>
      </ul>

      <h3 className="text-xl font-medium">3. How We Use Your Information</h3>
      <p>Your data is strictly used to:</p>
      <ul>
        <li>
          Operate and maintain your Interntrack account and personal dashboard.
        </li>
        <li>
          Display your public profile and public internship logs to other peers
          and potential employers on the platform, provided you have set your
          profile to &ldquo;Public&rdquo;.
        </li>
        <li>
          Analyze general platform traffic and usage trends via Google Analytics
          to improve the user experience.
        </li>
      </ul>

      <h3 className="text-xl font-medium">4. Data Storage & Security</h3>
      <p>
        Your data is securely stored using Google Cloud&lsquo;s Firebase
        infrastructure. Private configurations and private internship logs are
        secured by strict database rules and are inaccessible to anyone other
        than you.
      </p>

      <h3 className="text-xl font-medium">
        5. Your Data Rights (GDPR Compliance)
      </h3>
      <p>
        You have the right to access, correct, or delete your personal data.
      </p>
      <ul>
        <li>
          <strong>Modification:</strong> You can edit your profile data, toggle
          your profile visibility, and manage your internship logs directly from
          your dashboard settings.
        </li>
        <li>
          <strong>Deletion:</strong> Because automated account deletion is not
          yet available in the user interface, you can request complete erasure
          of your account and associated data by emailing{" "}
          <strong>aarroyoestrela@gmail.com</strong>. Your data will be
          permanently wiped from the Firestore database upon request.
        </li>
      </ul>

      <h3 className="text-xl font-medium">6. Contact Us</h3>
      <p>
        For any questions regarding this Privacy Policy or your data, please
        contact aarroyoestrela@gmail.com.
      </p>
    </main>
  );
}
