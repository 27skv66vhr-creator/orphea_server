const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.json());

// Logs internes
let logs = [];

// ------------------------------
// MOTEUR IA : MISTRAL (API DEMO)
// ------------------------------
async function runMistral(prompt) {
  const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer demo"
    },
    body: JSON.stringify({
      model: "mistral-tiny",
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

// ------------------------------
// MOTEUR IA : DEEPSEEK (API DEMO)
// ------------------------------
async function runDeepSeek(prompt) {
  const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer demo"
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

// ------------------------------
// MOTEUR IA : GPT‑4o (API DEMO)
// ------------------------------
async function runGPT4o(prompt) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer demo"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

// ------------------------------
// MOTEUR IA : OLLAMA (LOCAL)
// ------------------------------
async function runOllama(prompt) {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "mistral",
      prompt
    })
  });

  const data = await response.json();
  return data.response;
}

// ------------------------------
// MOTEUR IA : OPENWEBUI (LOCAL)
// ------------------------------
async function runOpenWebUI(prompt) {
  const response = await fetch("http://localhost:8080/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "mistral",
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

// ------------------------------
// ROUTES
// ------------------------------

app.get("/logs", (req, res) => {
  res.json(logs);
});

app.post("/log/:msg", (req, res) => {
  const msg = req.params.msg;
  logs.push(`[LOG] ${msg}`);
  res.json({ status: "ok" });
});

app.post("/ask/:engine", async (req, res) => {
  const engine = req.params.engine;
  const prompt = req.body.prompt;

  logs.push(`[USER → ${engine}] ${prompt}`);

  let reply = "Engine not found.";

  if (engine === "mistral") reply = await runMistral(prompt);
  if (engine === "deepseek") reply = await runDeepSeek(prompt);
  if (engine === "gpt4o") reply = await runGPT4o(prompt);
  if (engine === "ollama") reply = await runOllama(prompt);
  if (engine === "openwebui") reply = await runOpenWebUI(prompt);

  logs.push(`[${engine.toUpperCase()}] ${reply}`);

  res.json({ reply });
});

// ------------------------------
// DÉMARRAGE SERVEUR
// ------------------------------
app.listen(port, () => {
  console.log(`ORPHEA & ALEXION server running on http://localhost:${port}`);
});
