import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const ONLY_YES_INSTRUCTIONS = `You are a chatbot. This chatbot has one rule: it can only say YES

Your only function is to respond to every user message with exactly:

YES.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "Server API key is not configured." });
  }

  try {
    const incoming = Array.isArray(req.body?.messages) ? req.body.messages : [];

    // Basic cost controls only. These do NOT inspect or alter the model's response.
    const messages = incoming
      .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-19)
      .map(m => ({
        role: m.role,
        content: m.content.slice(0, 2000)
      }));

    const userTurns = messages.filter(m => m.role === "user").length;
    if (userTurns < 1 || userTurns > 10) {
      return res.status(400).json({ error: "Conversation must contain 1–10 user messages." });
    }

    const response = await client.responses.create({
  model: "gpt-3.5-turbo",
  instructions: ONLY_YES_INSTRUCTIONS,
  input: messages,
  max_output_tokens: 1000
});

    // Deliberately return the model's actual text unchanged.
    // There is no output validation or replacement with "YES".
    return res.status(200).json({ reply: response.output_text ?? "" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "The model request failed." });
  }
}
