 "use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="bg-white overflow-hidden">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
        <div className="container-fluid px-4">
          <Link href="/" className="navbar-brand fw-bold fs-4 text-primary">
            CareerPath AI
          </Link>
          <Link
            href="/Home"
            className="btn btn-outline-primary rounded-pill px-4"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Services Section (FIRST) */}
      <section
        className="py-5"
        style={{
          background: "linear-gradient(135deg, #f8f9ff, #eef2ff)",
        }}
      >
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center fw-bold mb-5"
          >
            What We Offer
          </motion.h2>

          <div className="row g-4">
            {[
              {
                img: "/images/Resume-screen.jpeg",
                title: "AI Resume Screening",
                desc: "Smart resume parsing with skill & keyword intelligence.",
              },
              {
                img: "/images/Resume-score.avif",
                title: "Resume Scoring",
                desc: "ATS-based scoring to boost recruiter visibility.",
              },
              {
                img: "/images/career-path.webp",
                title: "Career Path AI",
                desc: "ML-driven career recommendations personalized for you.",
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                className="col-md-4"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="card h-100 border-0 shadow-lg rounded-4 text-center p-4 bg-white">
                  <Image
                    src={service.img}
                    alt={service.title}
                    width={320}
                    height={220}
                    className="rounded-3 mb-3"
                  />
                  <h4 className="fw-bold">{service.title}</h4>
                  <p className="text-muted">{service.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section
        className="py-5 text-white position-relative"
        style={{
          background:
            "radial-gradient(circle at top, #6366f1, #1e1b4b)",
        }}
      >
        <div className="container text-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="display-4 fw-bold mb-3"
          >
            Unlock Your Career Potential
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lead opacity-75 mb-4"
          >
            AI-powered resume analysis and intelligent career guidance
            built for the future.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              href="/Home"
              className="btn btn-light btn-lg rounded-pill px-5 shadow-lg"
            >
              🚀 Explore Your Career
            </Link>
          </motion.div>
        </div>

        {/* Decorative Blur */}
        <div
          className="position-absolute top-0 start-50 translate-middle-x"
          style={{
            width: "400px",
            height: "400px",
            background: "#818cf8",
            filter: "blur(120px)",
            opacity: 0.4,
            zIndex: 0,
          }}
        />
      </section>

      {/* Footer */}
      <footer className="bg-dark py-4 text-center text-light">
        © {new Date().getFullYear()} CareerPath AI • Built with ❤️ & AI
      </footer>
    </div>
  );
}
