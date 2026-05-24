export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { system, messages, max_tokens } = req.body;

    // Convert Anthropic format → Groq/OpenAI format
    const groqMessages = [];
    if (system) groqMessages.push({ role: "system", content: system });
    groqMessages.push(...messages);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: groqMessages,
        max_tokens: max_tokens || 1000,
        temperature: 0.1,
      }),
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    const text = data.choices[0].message.content;

    // Return in Anthropic format so frontend needs zero changes
    return res.status(200).json({
      content: [{ type: "text", text }],
    });
  } catch (err) {
    return res.status(500).json({ error: { message: err.message } });
  }
}