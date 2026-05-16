import { useState, useRef, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const severityOrder = { high: 0, medium: 1, low: 2 };

function RiskBadge({ severity }) {
  return (
    <span className={`risk-badge risk-${severity}`}>
      {severity === "high" ? "⚠ High Risk" : severity === "medium" ? "◆ Medium" : "✓ Low Risk"}
    </span>
  );
}

function ClauseCard({ clause, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`clause-card clause-${clause.severity}`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <button className="clause-header" onClick={() => setOpen(!open)}>
        <div className="clause-left">
          <RiskBadge severity={clause.severity} />
          <span className="clause-title">{clause.title}</span>
        </div>
        <span className={`chevron ${open ? "open" : ""}`}>›</span>
      </button>
      {open && (
        <div className="clause-body">
          <blockquote className="clause-quote">"{clause.quote}"</blockquote>
          <p className="clause-explanation">{clause.explanation}</p>
          <div className="clause-suggestion">
            <span className="suggestion-label">What to do</span>
            <p>{clause.suggestion}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function DropZone({ onFile, loading }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file?.type === "application/pdf") onFile(file);
    },
    [onFile]
  );

  return (
    <div
      className={`dropzone ${dragging ? "dragging" : ""} ${loading ? "loading" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !loading && inputRef.current.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        style={{ display: "none" }}
        onChange={(e) => e.target.files[0] && onFile(e.target.files[0])}
      />
      {loading ? (
        <div className="loading-state">
          <div className="scanner-wrap">
            <div className="scanner-doc">
              <div className="scanner-line" />
              <div className="doc-line" /><div className="doc-line" />
              <div className="doc-line short" /><div className="doc-line" />
              <div className="doc-line short2" /><div className="doc-line" />
            </div>
          </div>
          <p className="loading-text">Scanning contract<span className="dots">...</span></p>
          <p className="loading-sub">AI is reading every clause for risk signals</p>
        </div>
      ) : (
        <div className="drop-idle">
          <div className="drop-icon">⟁</div>
          <p className="drop-main">Drop your contract PDF here</p>
          <p className="drop-sub">or click to browse &middot; max 10MB</p>
          <div className="drop-types">
            <span>NDA</span><span>Employment</span><span>Freelance</span>
            <span>Rental</span><span>SaaS</span><span>Any contract</span>
          </div>
        </div>
      )}
    </div>
  );
}

function VerdictCard({ data, pages }) {
  const riskColor =
    data.overallRisk === "high" ? "#ff4d4d"
    : data.overallRisk === "medium" ? "#ffaa00"
    : "#00cc88";
  const highCount = data.clauses.filter((c) => c.severity === "high").length;
  const medCount = data.clauses.filter((c) => c.severity === "medium").length;

  return (
    <div className="verdict-card">
      <div className="verdict-top">
        <div className="verdict-risk-block">
          <div className="verdict-label">Overall Risk</div>
          <div className="verdict-risk-value" style={{ color: riskColor }}>
            {data.overallRisk.toUpperCase()}
          </div>
        </div>
        <div className="verdict-stats">
          <div className="stat"><span className="stat-num">{pages}</span><span className="stat-lbl">pages</span></div>
          <div className="stat-div" />
          <div className="stat"><span className="stat-num">{data.clauses.length}</span><span className="stat-lbl">flagged</span></div>
          <div className="stat-div" />
          <div className="stat"><span className="stat-num" style={{ color: "#ff4d4d" }}>{highCount}</span><span className="stat-lbl">critical</span></div>
          <div className="stat-div" />
          <div className="stat"><span className="stat-num" style={{ color: "#ffaa00" }}>{medCount}</span><span className="stat-lbl">medium</span></div>
        </div>
      </div>
      <p className="verdict-summary">{data.summary}</p>
      <div className="verdict-final">
        <span className="verdict-final-label">Bottom line</span>
        <p className="verdict-final-text">{data.verdict}</p>
      </div>
    </div>
  );
}

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState(null);

  const analyze = async (file) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setFileName(file.name);

    const form = new FormData();
    form.append("pdf", file);

    try {
      const res = await fetch(`${API_URL}/analyze`, { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Analysis failed");
      setResult(json);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setFileName(null);
  };

  const sorted = result
    ? [...result.data.clauses].sort(
        (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
      )
    : [];

  return (
    <div className="app">
      <div className="bg-grid" />
      <div className="bg-glow" />

      <header className="header">
        <div className="logo" onClick={reset} style={{ cursor: "pointer" }}>
          <span className="logo-mark">⟁</span>
          <span className="logo-text">ContractScan</span>
        </div>
        <div className="header-right">
          <span className="header-tag">AI Legal Risk Analyzer</span>
          {result && (
            <button className="new-btn" onClick={reset}>
              ← New Contract
            </button>
          )}
        </div>
      </header>

      <main className="main">
        {!result && !loading && (
          <section className="hero">
            <div className="hero-eyebrow">Don't sign blind</div>
            <h1 className="hero-title">
              Know every risk<br />
              <em>before you sign</em>
            </h1>
            <p className="hero-sub">
              Upload any PDF contract. AI scans every clause for hidden risks,
              one-sided terms, and red flags — explained in plain English.
            </p>
          </section>
        )}

        {!result && <DropZone onFile={analyze} loading={loading} />}

        {error && (
          <div className="error-box">
            <span className="error-icon">⚠</span>
            <span>{error}</span>
            <button onClick={reset} className="error-retry">Try again</button>
          </div>
        )}

        {result && (
          <div className="results">
            <div className="file-chip">
              <span>⟁</span> {fileName}
            </div>

            <VerdictCard data={result.data} pages={result.pages} />

            {result.data.positives?.length > 0 && (
              <div className="positives-card">
                <div className="positives-label">✓ What looks fine</div>
                <ul className="positives-list">
                  {result.data.positives.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="clauses-section">
              <div className="clauses-header">
                <h2>Flagged Clauses</h2>
                <div className="legend">
                  <span className="leg-dot high" />High
                  <span className="leg-dot medium" />Medium
                  <span className="leg-dot low" />Low
                </div>
              </div>
              <div className="clauses-list">
                {sorted.map((clause, i) => (
                  <ClauseCard key={i} clause={clause} index={i} />
                ))}
              </div>
            </div>

            <p className="disclaimer">
              ContractScan uses AI to flag potential risks. This is not legal advice.
              For important contracts, always consult a qualified lawyer.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
