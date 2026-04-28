import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:5050/api/analyze";
const HISTORY_URL = "http://127.0.0.1:5050/api/history";

function App() {
  const [targetRole, setTargetRole] = useState("");
  const [userSkills, setUserSkills] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [historyMessage, setHistoryMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);

  const fetchHistory = async () => {
    try {
      const response = await fetch(HISTORY_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch history.");
      }

      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleAnalyze = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setHistoryMessage("");
    setResult(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetRole,
          userSkills,
          jobDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed.");
      }

      setResult(data);
      setHistoryMessage("Analysis saved to MongoDB history.");
      fetchHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    setClearing(true);
    setHistoryMessage("");
    setError("");

    try {
      const response = await fetch(HISTORY_URL, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to clear history.");
      }

      setHistory([]);
      setHistoryMessage(data.message || "Analysis history cleared.");
    } catch (err) {
      setError(err.message);
    } finally {
      setClearing(false);
    }
  };

  const loadSampleData = () => {
    setTargetRole("MERN Stack Developer");
    setUserSkills(
      "JavaScript, React, Node.js, Express, MongoDB, HTML, CSS, Git, GitHub"
    );
    setJobDescription(
      "This position requires JavaScript, React, Node.js, Express, MongoDB, REST API, HTML, CSS, Git, GitHub, Docker, AWS, agile, and problem solving."
    );
    setError("");
    setHistoryMessage("");
    setResult(null);
  };

  return (
    <main className="app">
      <section className="hero">
        <p className="eyebrow">CIS 602 Web Software Development Project</p>
        <h1>SkillSync AI</h1>
        <p>
          A MERN-based skill gap analysis platform that compares a user's
          current skills with a target job description and generates a
          personalized learning roadmap.
        </p>
      </section>

      <section className="summary-strip">
        <div>
          <span>Frontend</span>
          <strong>React</strong>
        </div>
        <div>
          <span>Backend</span>
          <strong>Express.js</strong>
        </div>
        <div>
          <span>Database</span>
          <strong>MongoDB Atlas</strong>
        </div>
        <div>
          <span>Architecture</span>
          <strong>REST API</strong>
        </div>
      </section>

      <section className="content-grid">
        <form className="card form-card" onSubmit={handleAnalyze}>
          <div className="form-title-row">
            <h2>Analyze Your Skill Gap</h2>
            <button
              type="button"
              className="sample-btn"
              onClick={loadSampleData}
            >
              Load Demo
            </button>
          </div>

          <label>
            Target Role
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="Example: Data Analyst"
            />
          </label>

          <label>
            Current Skills
            <input
              type="text"
              value={userSkills}
              onChange={(e) => setUserSkills(e.target.value)}
              placeholder="Example: Python, SQL, Git"
              required
            />
          </label>

          <label>
            Job Description
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job description here..."
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Analyzing..." : "Generate Roadmap"}
          </button>

          {error && <p className="error">{error}</p>}
          {historyMessage && <p className="success-message">{historyMessage}</p>}
        </form>

        <section className="card results-card">
          {!result && (
            <div className="empty-state">
              <h2>Results Dashboard</h2>
              <p>
                Your readiness score, matched skills, missing skills, and
                roadmap will appear here.
              </p>
            </div>
          )}

          {result && (
            <>
              <div className="score-box">
                <p>Readiness Score</p>
                <h2>{result.matchPercentage}%</h2>
              </div>

              <div className="result-section">
                <h3>Required Skills Found</h3>

                {result.requiredSkills.length > 0 ? (
                  <div className="pill-group">
                    {result.requiredSkills.map((skill) => (
                      <span className="pill" key={skill}>
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="muted-text">
                    No known skills were detected from the job description.
                  </p>
                )}
              </div>

              <div className="result-section">
                <h3>Matched Skills</h3>

                <div className="pill-group">
                  {result.matchedSkills.length > 0 ? (
                    result.matchedSkills.map((skill) => (
                      <span className="pill success" key={skill}>
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="muted-text">No matched skills found.</p>
                  )}
                </div>
              </div>

              <div className="result-section">
                <h3>Missing Skills</h3>

                <div className="pill-group">
                  {result.missingSkills.length > 0 ? (
                    result.missingSkills.map((skill) => (
                      <span className="pill warning" key={skill}>
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="muted-text">
                      You matched all detected skills.
                    </p>
                  )}
                </div>
              </div>

              <div className="result-section">
                <h3>Personalized Learning Roadmap</h3>

                {result.roadmap.length > 0 ? (
                  result.roadmap.map((item) => (
                    <div className="roadmap-item" key={item.skill}>
                      <h4>{item.skill}</h4>
                      <ol>
                        {item.steps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  ))
                ) : (
                  <p className="muted-text">
                    No roadmap needed. You are aligned with this role.
                  </p>
                )}
              </div>
            </>
          )}
        </section>
      </section>

      <section className="card history-card">
        <div className="history-header">
          <div>
            <p className="section-kicker">MongoDB Saved Records</p>
            <h2>Recent Analysis History</h2>
          </div>

          {history.length > 0 && (
            <button
              type="button"
              className="clear-history-btn"
              onClick={clearHistory}
              disabled={clearing}
            >
              {clearing ? "Clearing..." : "Clear History"}
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <p className="muted-text">No saved analyses yet.</p>
        ) : (
          <div className="history-list">
            {history.map((item) => (
              <div className="history-item" key={item._id}>
                <div>
                  <h3>{item.targetRole || "Untitled Role"}</h3>
                  <p>
                    <strong>Readiness Score:</strong> {item.matchPercentage}%
                  </p>
                  <p>
                    <strong>Missing Skills:</strong>{" "}
                    {item.missingSkills.length > 0
                      ? item.missingSkills.join(", ")
                      : "None"}
                  </p>
                </div>

                <span className="history-date">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : "Saved"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;