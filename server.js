const express = require("express");
const OpenAI = require("openai");

const app = express();
const port = process.env.PORT || 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());
app.use(express.static("public"));

app.post("/api/jarvis", async (req, res) => {
  try {
    const mensaje = String(req.body.mensaje || "").trim();

    if (!mensaje) {
      return res.status(400).json({ error: "Mensaje vacío" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Falta configurar OPENAI_API_KEY en el servidor." });
    }

    const response = await client.responses.create({
      model: "gpt-5",
      instructions: "Eres JARVIS, un asistente virtual. Responde en español, de forma útil, directa y con un poco de humor.",
      input: mensaje
    });

    res.json({ respuesta: response.output_text });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: error?.message || "Error conectando con la IA." });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`🤖 JARVIS activo en el puerto ${port}`);
});