export default function Cookies() {
  return (
    <main className="flex flex-col pt-52 sm:pt-32 font-sans min-h-screen w-full h-full px-8 sm:px-10 lg:px-20 xl:px-40  bg-slate-50 gap-8 text-gray-800 pb-16">
      <h2 className="text-2xl text-gray-800 font-semibold">Cookie Policy</h2>
      <p>
        <strong>Effective Date:</strong> September 23, 2026
      </p>

      <h3 className="text-xl font-medium">1. What Are Cookies?</h3>
      <p>
        Cookies are small text files stored on your device by your web browser
        when you visit a website. They help the site function properly and
        provide analytical insights.
      </p>

      <h3 className="text-xl font-medium">2. How We Use Cookies</h3>
      <p>Interntrack uses cookies for two specific purposes:</p>
      <ul>
        <li>
          <strong>Essential Cookies:</strong> We use Firebase Authentication,
          which relies on strict, essential cookies and local storage tokens to
          keep you securely logged into your account as you navigate the
          platform. The platform cannot function without these.
        </li>
        <li>
          <strong>Analytics Cookies:</strong> We use Google Analytics to measure
          how users interact with our website. This helps us identify bugs and
          understand which features are most useful. These cookies collect
          aggregated, anonymous data regarding your site visit.
        </li>
      </ul>

      <h3 className="text-xl font-medium">3. Managing Cookies</h3>
      <p>
        You can instruct your browser to refuse all non-essential cookies or to
        indicate when a cookie is being sent. However, if you disable essential
        cookies, you may not be able to log in or use the core features of your
        Interntrack dashboard.
      </p>
    </main>
  );
}
