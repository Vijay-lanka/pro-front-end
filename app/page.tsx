 "use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="bg-white overflow-hidden">
      {/* ================= NAVBAR ================= */}
      <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
        <div className="container px-4">
          <Link href="/" className="navbar-brand fw-bold fs-4 text-primary">
            CareerPath AI
          </Link>
          <Link
            href="/Home"
            className="btn btn-primary rounded-pill px-4 shadow-sm"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section
        className="position-relative text-white py-5"
        style={{
          background:
            "radial-gradient(circle at top left, #6366f1, #1e1b4b)",
        }}
      >
        <div className="container py-5">
          <div className="row align-items-center g-5">
            {/* Left Content */}
            <div className="col-lg-6 text-center text-lg-start">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="display-4 fw-bold mb-4"
              >
                Analyze Your Resume with <br />
                <span className="text-warning">AI-Powered Insights</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="lead opacity-75 mb-4"
              >
                Optimize your resume for ATS, discover skill gaps, and
                unlock personalized career recommendations in seconds.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  href="/Home"
                  className="btn btn-light btn-lg rounded-pill px-5 shadow-lg"
                >
                  🚀 Upload Resume
                </Link>
              </motion.div>
            </div>

            {/* Right Visual */}
            <div className="col-lg-6 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Image
                  src="/images/Resume-screen.jpeg"
                  alt="Resume Analysis"
                  width={520}
                  height={360}
                  className="rounded-4 shadow-lg"
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Glow */}
        <div
          className="position-absolute top-0 end-0"
          style={{
            width: "400px",
            height: "400px",
            background: "#818cf8",
            filter: "blur(140px)",
            opacity: 0.4,
          }}
        />
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-5 bg-light">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center fw-bold mb-5"
          >
            What CareerPath AI Offers
          </motion.h2>

          <div className="row g-4">
            {[
              {
                img: "/images/Resume-score.avif",
                title: "ATS Resume Scoring",
                desc: "Get an ATS-friendly score and actionable insights to beat resume filters.",
              },
              {
                img: "/images/Resume-screen.jpeg",
                title: "AI Resume Screening",
                desc: "Smart keyword extraction and skill analysis powered by ML.",
              },
              {
                img: "/images/career-path.webp",
                title: "Career Path Prediction",
                desc: "Personalized career recommendations based on your profile.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="col-md-4"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="card h-100 border-0 shadow rounded-4 p-4 text-center">
                  <Image
                    src={item.img}
                    alt={item.title}
                    width={300}
                    height={200}
                    className="rounded-3 mb-3"
                  />
                  <h5 className="fw-bold">{item.title}</h5>
                  <p className="text-muted">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-5 text-center">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="fw-bold mb-3"
          >
            Ready to Upgrade Your Career?
          </motion.h2>
          <p className="text-muted mb-4">
            Upload your resume and let AI guide your next move.
          </p>
          <Link
            href="/Home"
            className="btn btn-primary btn-lg rounded-pill px-5 shadow"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-dark py-4 text-center text-light">
        © {new Date().getFullYear()} CareerPath AI • Built with ❤️ & AI
      </footer>
    </div>
  );
}
