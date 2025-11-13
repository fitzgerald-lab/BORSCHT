import React, { useState, useRef, useEffect } from "react";


export default function Tool() {
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [hospitalList, setHospitalList] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [date] = useState(() => new Date().toISOString().split("T")[0]);

  const outputRef = useRef(null);

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + "/Hospital_list.txt")
      .then((res) => res.text())
      .then((text) => {
        const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
        setHospitalList(lines);
      })
      .catch((err) => console.error("Error loading hospital list:", err));
  }, []);

  const handleChange = (id, value) => {
    const numericFields = [1, 3, 4]; // IDs for Age, Prague C, Prague M

    if (numericFields.includes(id)) {
      // Allow only digits or empty string
      if (!/^\d*$/.test(value)) return;
    }

    const numericVal = value === "" ? "" : Number(value);

    const limits = {
      1: { min: 0, max: 101 }, // Age
      3: { min: 0, max: 20 },  // Prague C
      4: { min: 0, max: 20 },  // Prague M
    };

    if (numericFields.includes(id)) {
      const { min, max } = limits[id] || {};

      if (value !== "" && (
        (min !== undefined && numericVal < min) ||
        (max !== undefined && numericVal > max)
      )) {
        return; // Reject out-of-bounds input
      }
    }

    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const requiredFields = sections
    .flatMap(section => section.questions)
    .filter(q => q.required)
    .map(q => q.id);
    
  const allRequiredFilled = requiredFields.every(
    (id) => answers[id] !== undefined && answers[id] !== ""
  );

  const calculateScore = () => {
    if (!allRequiredFilled) {
      alert("Please fill all required fields (*) before calculating.");
      return;
    }

    const C = Number(answers[3]);
    const M = Number(answers[4]);

    if (M < C) {
      alert(
        "Prague maximal length (M) cannot be less than the prague circumferential length (C)."
      );
      return;
    }

    const result = stratifyRiskGroup(answers);
    setScore(result);

    console.log({
      hospitalName: answers[0],
      date,
      answers,
      score: result,
    });

    sendToGoogleSheet(answers[0], date);

    setTimeout(() => {
      if (outputRef.current) {
        outputRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };
 
  const recommendations = {
    "Very high risk": "Recommendation: endoscopy in 6 months by an expert with advanced imaging.", 
    "High risk": "Recommendation: endoscopy in 12 months by an expert with advanced imaging.", 
    "Moderate risk": "Recommendation: alternate capsule-sponge and endoscopy at 18-month intervals.", 
    "Low risk": "Recommendation: capsule sponge procedure in 36 months."
  };

  const handleHospitalInput = (e) => {
    const input = e.target.value;
    handleChange(0, input);

    if (input.length > 0) {
      const suggestions = hospitalList.filter((hosp) =>
        hosp.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredHospitals(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="mt-10 pt-2 p-4 py-4 max-w-3xl mx-auto bg-gray-50 min-h-screen">
      {sections.map((section) => (
        <section
          key={section.title}
          className="mt-2 mb-4 border border-gray-300 bg-white shadow-sm p-6 rounded-2xl"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-0">
            {section.title}
          </h2>
          <h5 className="text-l mt-1 mb-5 text-gray-500">
            {section.subtitle}
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.questions.map((q) => (
              <div key={q.id}>
                <label
                  htmlFor={`q-${q.id}`}
                  className="block font-medium mb-0 text-gray-700"
                >
                  {q.text} {q.required && <span className="text-red-500">*</span>}
                </label>
                <label className="block font-medium text-xs mb-1 text-gray-500">
                  {q.subtext}
                </label>

                {q.type === "autocomplete" && (
                  <div className="relative">
                    <input
                      id={`q-${q.id}`}
                      type="text"
                      value={answers[q.id] ?? ""}
                      onChange={handleHospitalInput}
                      placeholder="Start typing NHS Trust name..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // delay so click can register
                    />
                    {showSuggestions && filteredHospitals.length > 0 && (
                      <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-lg shadow-md max-h-48 overflow-y-auto">
                        {filteredHospitals.map((name) => (
                          <li
                            key={name}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              handleChange(0, name);
                              setShowSuggestions(false);
                            }}
                          >
                            {name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {q.type === "numeric" && (
                  <input
                    id={`q-${q.id}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={answers[q.id] ?? ""}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  min={
                    q.id === 1 ? 0 :
                    q.id === 3 ? 0 :
                    q.id === 4 ? 1 :
                    undefined
                  }
                  max={
                    q.id === 1 ? 120 :
                    q.id === 3 ? 10 :
                    q.id === 4 ? 20 :
                    undefined
                  }
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
        className={`w-full md:w-auto mt-2 px-6 py-3 rounded-lg font-semibold transition 
          ${
            allRequiredFilled
              ? "bg-indigo-700 text-white hover:bg-indigo-800 cursor-pointer"
              : "bg-indigo-400 text-white opacity-50 cursor-not-allowed"
          }`}
      >
        Calculate Risk
      </button>

      {score && (
        <div
          ref={outputRef}
          className={`mt-8 p-6 rounded-lg text-center border 
            ${
              score === "High risk"
                ? "bg-rose-100 border-rose-300 text-black"
                : score == "Very high risk" 
                ? "bg-rose-100 border-rose-300 text-black"
                : score === "Moderate risk"
                ? "bg-amber-100 border-amber-300 text-black"
                : "bg-emerald-100 border-emerald-300 text-black"
            }`}
        >
          <p className="text-3xl font-bold">{score}</p>
          <p></p>
          <p className="text-lg">{recommendations[score]}</p>
        </div>
      )}
    </div>
  );
}

const sendToGoogleSheet = async (hospitalName, date) => {
  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbxKIrsTKOHaGUdCXq9E_9WY0SGM2eOO3iBe8P5KfK351TOqEIt2PG_ik-ap-Iw8GUBg/exec", {
      method: "POST",
      body: JSON.stringify({
        hospitalName: hospitalName || "N/A",
        date: date,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("Submitted to Google Sheet:", result);
  } catch (error) {
    console.error("Error sending to Google Sheet:", error);
  }
};

function stratifyRiskGroup(answers) {
  const C = Number(answers[3]);
  const M = Number(answers[4]);
  const age = Number(answers[1]);
  const sex = answers[2];
  const prev_lgd = answers[5];
  const prev_ind = answers[6];
  const atypia = answers[7];
  const p53 = answers[8];

  const missingFields = [];
  if (C === undefined) missingFields.push("Prague Circumferential Length");
  if (M === undefined) missingFields.push("Prague Maximal Length");
  if (age === undefined) missingFields.push("Age");
  if (!sex) missingFields.push("Sex");
  if (!prev_lgd ) missingFields.push("LGD on any previous endoscopy");
  if (!prev_ind ) missingFields.push("IND on any previous endoscopy"); 

  if (missingFields.length > 0) {
    alert(
      "Please complete the following required fields:\n" + missingFields.join("\n")
    );
    return;
  }

  const atypiaRisk = [
    "Positive",
    "Atypia of uncertain significance (AUS)",
  ].includes(atypia);
  const p53Risk = ["Equivocal", "Positive"].includes(p53);

  const very_hi_risk = p53 == "Positive" || atypia == "Positive";
  const hi_risk = (atypiaRisk || p53Risk) && !very_hi_risk;
  const clin_mod_crit1 = C > 6 || M > 10;
  const clin_mod_crit2 = (M > 5 || C >= 3) && (sex === "Male" || age >= 60);
  const clin_mod_crit3 = prev_lgd == "Yes" || prev_ind == "Yes";

  if (very_hi_risk) return "Very high risk";
  else if (hi_risk) return "High risk";
  else if (clin_mod_crit1 || clin_mod_crit2 || clin_mod_crit3) return "Moderate risk";
  else return "Low risk";
}

const sections = [
  {
    title: "Location", 
    subtitle: "Optional",
    questions:[
      {id: 0, type: "autocomplete", text: "", required: false}
    ]
  },
  {
    title: "Clinical Biomarkers",
    subtitle: "",
    questions: [
      { id: 1, type: "numeric", text: "Age", required: true },
      {
        id: 2,
        type: "multi",
        text: "Assigned Sex at Birth",
        subtext: "",
        options: ["Female", "Male"],
        required: true,
      },
      {
        id: 3,
        type: "numeric",
        text: "Prague Circumferential Length (C)",
        subtext: "0cm - 20cm",
        required: true,
      },
      {
        id: 4,
        type: "numeric",
        text: "Prague Maximal Length (M)",
        subtext: "0cm - 20cm",
        required: true,
      },
      {
        id: 5, 
        type: "multi", 
        text: (
          <>
            Low grade dysplasia on <span className="font-extrabold">any prior endoscopy</span>
          </>
        ),
        subtext: "",
        options: [
            "Yes", 
            "No", 
            "Don't know"
        ],
        required: true
      },
      {
        id : 6, 
        type: "multi", 
        text: (
          <>
            Indefinite for dysplasia on <span className="font-extrabold">previous endoscopy</span>
          </>
        
        ), 
        subtext: "",
        options: [
            "Yes", 
            "No", 
            "Don't know"
        ],
        required: true
      }
    ],
  },
  {
    title: "Capsule Sponge Biomarkers",
    subtitle: "Please enter results if a capsule sponge test has been completed",
    questions: [
      {
        id: 7,
        type: "multi",
        text: "Atypia",
        subtext: "",
        options: [
          "Negative",
          "Atypia of uncertain significance (AUS)",
          "Positive",
        ],
      },
      {
        id: 8,
        type: "multi",
        text: "p53",
        subtext: "",
        options: ["Negative", "Equivocal", "Positive"],
      },
    ],
  },
];

