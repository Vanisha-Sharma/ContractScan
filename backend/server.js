const express = require("express");
const multer = require("multer");
const cors = require("cors");
const pdfParse = require("pdf-parse");
require("dotenv").config();

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `You are a legal contract risk analyzer. Analyze the given contract text and identify risky clauses.

Return ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "summary": "2-3 sentence plain-English overview of what this contract is about",
  "overallRisk": "low",
  "clauses": [
    {
      "title": "Short clause name",
      "severity": "high",
      "quote": "exact short excerpt from the contract (max 100 chars)",
      "explanation": "plain-English explanation of why this is risky (1-2 sentences)",
      "suggestion": "what to ask for or watch out for (1 sentence)"
    }
  ],
  "positives": ["list of 2-3 things that are actually fine or favorable in this contract"],
  "verdict": "One punchy sentence: should they sign, negotiate, or avoid?"
}

overallRisk must be one of: low, medium, high
severity must be one of: low, medium, high

Identify 4-8 clauses. Focus on: one-sided termination, IP ownership grabs, liability caps, non-compete scope, penalty clauses, auto-renewal traps, payment terms, confidentiality overreach.`;

app.post("/analyze", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF uploaded" });

    const pdfData = await pdfParse(req.file.buffer);
    const text = pdfData.text.slice(0, 12000);

    if (text.trim().length < 100) {
      return res.status(400).json({
        error: "PDF appears to be empty or image-only (no extractable text)",
      });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://contractscan.vercel.app",
        "X-Title": "ContractScan"
      },
      body: JSON.stringify({
        model: "openrouter/auto",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `CONTRACT TEXT:\n${text}` }
        ],
        max_tokens: 2000,
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter error:", data);
      return res.status(500).json({ error: data.error?.message || "AI analysis failed" });
    }

    const raw = data.choices[0].message.content.trim();
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    res.json({ success: true, data: parsed, pages: pdfData.numpages });
  } catch (err) {
    console.error(err);
    if (err instanceof SyntaxError) {
      return res.status(500).json({ error: "AI returned malformed response. Try again." });
    }
    res.status(500).json({ error: err.message || "Analysis failed" });
  }
});

app.get("/health", (_, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`ContractScan backend running on port ${PORT}`));
