 "use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// ---------------- TYPES ----------------

type Prediction = {
  career: string;
  confidence: number;
};

type Analysis = {
  file_name: string | null;
  score: number;
  insights: string[];
  skills: string[];
  career_primary: string;
  career_alternatives: string[];
  predictions?: Prediction[]; // <- Use predictions from API
};

// ---------------- PAGE ----------------

export default function ResultsPage() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("analysisData");

    if (!stored) {
      return; // could redirect if needed
    }

    setTimeout(() => {
      const parsed: Analysis = JSON.parse(stored);
      setAnalysis(parsed);
      setLoading(false);
    }, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        🔍 Analyzing your resume...
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        No analysis found
      </div>
    );
  }

  // ---------------- CHART DATA ----------------

  const atsChartData = {
    labels: ["ATS Score", "Remaining"],
    datasets: [
      {
        data: [analysis.score, 100 - analysis.score],
        backgroundColor: ["#6366f1", "#e5e7eb"],
        hoverOffset: 8,
        borderWidth: 0,
      },
    ],
  };

  const topCareerChartData = {
    labels: analysis.predictions?.map((p) => p.career) ?? [],
    datasets: [
      {
        label: "Confidence %",
        data: analysis.predictions?.map((p) => Math.round(p.confidence * 100)) ?? [],
        backgroundColor: "#6366f1",
        borderRadius: 6,
      },
    ],
  };

  // ---------------- UI ----------------

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 to-slate-200 py-10 px-6">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold">Resume Analysis Report</h1>
          <p className="text-gray-600 mt-2">
            AI-powered ATS & Career Recommendation System
          </p>
        </motion.div>

        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ATS SCORE */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center"
          >
            <h2 className="text-xl font-semibold mb-4">ATS Score</h2>
            <div className="w-48 h-48">
              <Doughnut
                data={atsChartData}
                options={{
                  cutout: "70%",
                  plugins: { legend: { display: false }, tooltip: { enabled: true } },
                }}
              />
            </div>
            <p className="mt-4 text-3xl font-bold text-indigo-600">{analysis.score}/100</p>
          </motion.div>

          {/* CAREER */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-2">Best Career Match</h2>
            <p className="text-2xl font-bold text-green-600">{analysis.career_primary}</p>
            <p className="text-sm text-gray-500 mt-3">Alternative Options:</p>
            <ul className="list-disc ml-5 text-sm text-gray-600">
              {analysis.career_alternatives.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </motion.div>

          {/* FILE INFO */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-2">Resume File</h2>
            <p className="text-gray-800 font-medium">{analysis.file_name}</p>
            <p className="text-sm text-green-600 mt-2">✔ Successfully processed</p>
          </motion.div>
        </div>

        {/* SKILLS */}
        <motion.div whileHover={{ scale: 1.01 }} className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Detected Skills</h2>
          <div className="flex flex-wrap gap-3">
            {analysis.skills.map((s, i) => (
              <span
                key={i}
                className="px-4 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm font-semibold"
              >
                {s}
              </span>
            ))}
          </div>
        </motion.div>

        {/* TOP CAREER RECOMMENDATIONS */}
        <motion.div whileHover={{ scale: 1.01 }} className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Top Career Recommendations</h2>
          {analysis.predictions && analysis.predictions.length > 0 ? (
            <Bar
              data={topCareerChartData}
              options={{
                responsive: true,
                animation: { duration: 1500, easing: "easeOutQuart" },
                scales: {
                  y: { beginAtZero: true, max: 100, grid: { color: "#e5e7eb" } },
                  x: { grid: { display: false } },
                },
                plugins: {
                  legend: { display: false },
                  tooltip: { backgroundColor: "#111827", titleColor: "#fff", bodyColor: "#fff" },
                },
              }}
            />
          ) : (
            <p className="text-center text-gray-500">No career predictions available.</p>
          )}
        </motion.div>

        {/* INSIGHTS */}
        <motion.div whileHover={{ scale: 1.01 }} className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Resume Insights</h2>
          <ul className="list-disc ml-6 space-y-2 text-gray-700">
            {analysis.insights.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </motion.div>

        {/* FOOTER */}
        <footer className="text-center text-sm text-gray-500 pt-6">
          © 2025 AI-Based Resume Analysis & Career Recommendation System
        </footer>
      </div>
    </div>
  );
}
