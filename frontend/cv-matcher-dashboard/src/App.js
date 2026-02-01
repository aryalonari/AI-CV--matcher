import React, { useState } from "react";
import "./App.css";

function App() {
  const [jobDescription, setJobDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!jobDescription || files.length === 0) {
      alert("Please enter Job Description and upload CVs");
      return;
    }

    const formData = new FormData();
    formData.append("jobDescription", jobDescription);

    Array.from(files).forEach((file) => {
      formData.append("cvs", file);
    });

    try {
      setLoading(true);

      const response = await fetch("https://ai-cv-matcher-1.onrender.com", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Backend error");
      }

      const data = await response.json();
      setResults(data); // 🔥 REAL AI RESULTS
    } catch (error) {
      console.error(error);
      alert("AI analysis failed. Check backend & API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>AI CV Matcher</h1>
        <p>Intelligent Resume Screening System</p>
      </header>

      {/* JD + Upload */}
      <div className="card">
        <label>Job Description</label>
        <textarea
          placeholder="Paste job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <label>Upload CVs (PDF / DOCX / TXT)</label>
        <input
          type="file"
          multiple
          accept=".pdf,.docx,.txt"
          onChange={(e) => setFiles(e.target.files)}
        />

        <button className="analyze-btn" onClick={handleAnalyze}>
          {loading ? "Analyzing..." : "Analyze CVs"}
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="results-card">
          <h2>Results</h2>

          <table>
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Match Score</th>
                <th>Status</th>
                <th>Insights</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res, index) => (
                <tr key={index}>
                  <td>{res.name}</td>

                  <td>
                    <div className="score-bar">
                      <div
                        className="score-fill"
                        style={{ width: `${res.score}%` }}
                      ></div>
                      <span>{res.score}%</span>
                    </div>
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        res.status?.toLowerCase() || "review"
                      }`}
                    >
                      {res.status}
                    </span>
                  </td>

                  <td>
                    <strong>Strengths:</strong> {res.strengths}
                    <br />
                    <strong>Missing:</strong> {res.missing_skills}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="export-btn">Export CSV</button>
        </div>
      )}
    </div>
  );
}

export default App;
