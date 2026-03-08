



const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function detectIntent(message) {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // ✅ BEST for intent classification
      messages: [
        {
          role: "system",
          content: `
You are an intent classifier for an ATS system.

Return ONLY raw JSON.
NO markdown. NO backticks. NO explanation.

Valid intents:
- get_vacancies
- get_ats_score
- match_jobs
- get_application_status
- get_missing_skills

JSON format:
{
  "intent": "string",
  "confidence": number between 0 and 1
}
          `
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0,
      max_tokens: 100
    });

    const text = completion.choices[0].message.content.trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.error("Invalid JSON from Groq:", text);
      return { intent: "unknown", confidence: 0 };
    }

    if (!parsed.intent || typeof parsed.confidence !== "number") {
      return { intent: "unknown", confidence: 0 };
    }

    return parsed;

  } catch (err) {
    console.error("Groq intent detection error:", err.message);
    return { intent: "unknown", confidence: 0 };
  }
}

module.exports = detectIntent;