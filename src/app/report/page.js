"use client";

import { useState } from "react";
import { useUser } from "@/context/InternshipContext";
export default function Report() {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    message: "",
  });

  // 2. State to manage the submission status (loading, success, error)
  const [status, setStatus] = useState("");

  // 3. Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 4. Handle the actual form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the page from reloading!
    setStatus("loading");

    try {
      // Send the data to Web3Forms
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "7cb6f618-b6ec-44d5-9465-3d1824539583", // ⚠️ PASTE YOUR WEB3FORMS KEY HERE
          name: formData.name,
          email: user.email,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus("success");
        // Clear the form
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <main className="flex flex-col pt-52 sm:pt-32 font-sans min-h-screen w-full h-full px-8 sm:px-10 lg:px-20 xl:px-40  bg-slate-50 gap-8">
      <div className="text-2xl text-gray-800 font-semibold">Report a bug</div>
      <div className="text-gray-600 text-lg">
        Fill in this form and submit it to help InternTrack grow fast and
        steadily. Your feedback is appreciated.
      </div>
      <div className="mt-14 mb-10 bg-white border border-gray-200 p-8 md:p-12 rounded-3xl shadow-xl shadow-gray-200/50">
        {/* THE FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* NAME INPUT */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-xl font-bold text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all text-2xl mt-4 text-gray-600"
                placeholder="Enter your name"
              />
            </div>
          </div>

          {/* MESSAGE INPUT */}
          <div className="space-y-2">
            <label
              htmlFor="message"
              className="text-xl font-bold text-gray-700"
            >
              Mensaje
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all resize-none text-2xl mt-4 text-gray-600"
              placeholder="Describe the bug..."
            ></textarea>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full h-14 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {status === "loading" ? "Enviando..." : "Enviar Mensaje"}
          </button>

          {/* FEEDBACK MESSAGES */}
          {status === "success" && (
            <p className="text-green-600 text-center font-medium mt-4">
              ¡Mensaje enviado con éxito! Te responderé pronto.
            </p>
          )}
          {status === "error" && (
            <p className="text-red-600 text-center font-medium mt-4">
              Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
