import React, { useState } from "react";

export default function Tool() {
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  // Update answer state
  const handleChange = (id, value) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Validate required fields before calculating
  const requiredFields = [1, 2, 3, 4]; // ids of required questions
  const allRequiredFilled = requiredFields.every(
    (id) => answers[id] !== undefined && answers[id] !== ""
  );

  const calculateScore = () => {
    if (!allRequiredFilled) {
      alert("Please fill all required fields (*) before calculating.");
      return;
    }
    setScore(stratifyRiskGroup(answers));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
        Risk Stratification Tool
      </h1>

      {sections.map((section) => (
        <section
          key={section.title}
          className="mb-8 border border-gray-300 bg-white shadow-sm p-6 rounded-2xl"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {section.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.questions.map((q) => (
              <div key={q.id}>
                <label
                  htmlFor={`q-${q.id}`}
                  className="block font-medium mb-1 text-gray-700"
                >
                  {q.text} {q.required && <span className="text-red-500">*</span>}
                </label>

                {q.type === "numeric" && (
                  <input
                    id={`q-${q.id}`}
                    type="number"
                    value={answers[q.id] ?? ""}
                    onChange={(e) => handleChange(q.id, Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    min={0}
                  />
                )}

                {q.type === "multi" && (
                  <select
                    id={`q-${q.id}`}
                    value={answers[q.id] ?? ""}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select...</option>
                    {q.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      <button
        onClick={calculateScore}
        disabled={!allRequiredFilled}
        className={`w-full md:w-auto mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition
          ${
            allRequiredFilled
              ? "hover:bg-blue-700 cursor-pointer"
              : "opacity-50 cursor-not-allowed"
          }`}
      >
        Calculate Risk
      </button>

      {score && (
        <div className="mt-8 p-6 border border-blue-300 bg-blue-50 rounded-lg text-center">
          <h2 className="text-2xl font-semibold text-blue-800 mb-2">
            Risk Category:
          </h2>
          <p className="text-3xl font-bold text-blue-700">{score}</p>
        </div>
      )}
    </div>
  );
}

// Logic function unchanged:
function stratifyRiskGroup(answers) {
  const C = answers[3];
  const M = answers[4];
  const age = answers[1];
  const sex = answers[2];
  const atypia = answers[5];
  const p53 = answers[6];

  const missingFields = [];
  if (C == undefined) missingFields.push("Prague Circumferential Length");
  if (M == undefined) missingFields.push("Prague Maximal Length");
  if (age == undefined) missingFields.push("Age");
  if (!sex) missingFields.push("Sex");

  if (missingFields.length > 0) {
    alert(
      "Please complete the following required fields:\n" +
        missingFields.join("\n")
    );
    return;
  }

  const atypiaRisk = [
    "Positive",
    "Atypia of uncertain significance (AUS)",
  ].includes(atypia);
  const p53Risk = ["Equivocal", "Positive"].includes(p53);

  const clin_mod_crit1 = C > 6 || M > 10;
  const clin_mod_crit2 = (M > 5 || C >= 3) && (sex === "Male" || age > 60);

  if (p53Risk || atypiaRisk) return "High risk";
  else if (clin_mod_crit1 || clin_mod_crit2) return "Moderate risk";
  else return "Low risk";
}

const sections = [
  {
    title: "Clinical Biomarkers",
    questions: [
      { id: 1, type: "numeric", text: "Age", required: true },
      {
        id: 2,
        type: "multi",
        text: "Sex",
        options: ["Female", "Male"],
        required: true,
      },
      {
        id: 3,
        type: "numeric",
        text: "Prague Circumferential Length (C)",
        required: true,
      },
      {
        id: 4,
        type: "numeric",
        text: "Prague Maximal Length (M)",
        required: true,
      },
    ],
  },
  {
    title: "Capsule Sponge Biomarkers",
    questions: [
      {
        id: 5,
        type: "multi",
        text: "Atypia",
        options: ["Negative", "Atypia of uncertain significance (AUS)", "Positive"],
      },
      {
        id: 6,
        type: "multi",
        text: "p53",
        options: ["Negative", "Equivocal", "Positive"],
      },
    ],
  },
];
