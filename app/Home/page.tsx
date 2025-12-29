 "use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface AnalyzeResult {
  success: boolean;
  data: {
    file_name: string;
    score: number;
    skills: string[];
    insights: string[];
    career_primary: string;
    career_alternatives: string[];
    predictions: { career: string; confidence: number }[];
  };
  error?: string;
}

export default function HomePage() {
  const router = useRouter();

  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.type !== "application/pdf") {
      alert("Only PDF files are allowed");
      e.target.value = "";
      return;
    }

    setFile(selected);
    setFileName(selected.name);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!file) {
      alert("Please upload a PDF first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data: AnalyzeResult = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Analysis failed");
      }

      // Pass the analysis data via query or state (for simplicity, using sessionStorage)
      sessionStorage.setItem("analysisData", JSON.stringify(data.data));

      router.push("/Results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white overflow-hidden">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
        <div className="container-fluid px-4">
          <Link href="/" className="navbar-brand fw-bold fs-4 text-primary">
            CareerPath AI
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        className="py-5 text-white text-center position-relative"
        style={{
          background: "radial-gradient(circle at top, #6366f1, #1e1b4b)",
        }}
      >
        <div className="container position-relative z-1">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="display-4 fw-bold mb-3"
          >
            Welcome to CareerPath AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lead opacity-75"
          >
            Upload your resume and get instant AI-powered analysis
          </motion.p>
        </div>

        {/* Glow */}
        <div
          className="position-absolute top-0 start-50 translate-middle-x"
          style={{
            width: "420px",
            height: "420px",
            background: "#818cf8",
            filter: "blur(130px)",
            opacity: 0.45,
          }}
        />
      </section>

      {/* Upload Section */}
      <section
        className="py-5"
        style={{ background: "linear-gradient(135deg, #f8f9ff, #eef2ff)" }}
      >
        <div className="container text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="fw-bold mb-4"
          >
            Upload Your Resume
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="card mx-auto border-0 shadow-lg rounded-4 p-4"
            style={{ maxWidth: "520px" }}
          >
            <input
              type="file"
              accept="application/pdf"
              className="form-control mb-3"
              onChange={handleFileChange}
            />

            {fileName && (
              <p className="text-success fw-semibold mb-2">
                ✅ Uploaded: {fileName}
              </p>
            )}

            <button
              className="btn btn-primary btn-lg rounded-pill shadow"
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze Resume"}
            </button>

            {error && (
              <p className="mt-3 text-danger fw-semibold">{error}</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-5 bg-white">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center fw-bold mb-5"
          >
            Why Choose Us?
          </motion.h2>

          <div className="row g-4 text-center">
            {[
              { title: "Smart Screening", desc: "AI-powered resume analysis." },
              { title: "Resume Scoring", desc: "Detailed score highlighting strengths." },
              { title: "Career Path Guidance", desc: "Personalized career recommendations." },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="col-md-4"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="card h-100 border-0 shadow-sm rounded-4 p-4">
                  <h4 className="fw-bold">{feature.title}</h4>
                  <p className="text-muted">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 text-center">
        © {new Date().getFullYear()} CareerPath AI • Built with ❤️ & AI
      </footer>
    </div>
  );
}
