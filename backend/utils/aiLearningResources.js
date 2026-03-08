


const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


function cleanJSON(text) {
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) return "{}";

  let jsonText = text.slice(firstBrace, lastBrace + 1);

  // Remove trailing commas
  jsonText = jsonText.replace(/,\s*}/g, "}");
  jsonText = jsonText.replace(/,\s*]/g, "]");

  return jsonText;
}

async function generateLearningResources(skills) {
  if (!skills?.length) return {};

  try {
    const prompt = `
You are an AI career assistant.
Given missing skills: ${skills.join(", ")}
Return ONLY valid JSON.
No markdown, no explanations.
Format:
{
  "Skill": ["url1", "url2", "url3"]
}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0, // deterministic less nonsense
      max_tokens: 400 //limits response size
    });

    const rawText = completion.choices[0].message.content.trim();
    console.log("💡 AI raw response:", rawText); // debug log

    let parsed = {};
    try {
      const cleanedJSON = cleanJSON(rawText);
      parsed = JSON.parse(cleanedJSON);
    } catch (err) {
      console.warn("⚠️ Failed to parse AI response, creating fallback resources");
      // fallback: at least return the skill names with empty URLs
      skills.forEach(skill => {
        parsed[skill] = [];
      });
    }

    // Ensure every skill has at least 1 URL
    for (const skill of skills) {
      if (!parsed[skill] || !Array.isArray(parsed[skill]) || !parsed[skill].length) {
        parsed[skill] = [`https://www.google.com/search?q=${encodeURIComponent(skill)}+learning+resources`];
      }
    }

    return parsed;

  } catch (err) {
    console.error("AI resource generation failed:", err.message);
    // fallback for safety
    const fallback = {};
    skills.forEach(skill => {
      fallback[skill] = [`https://www.google.com/search?q=${encodeURIComponent(skill)}+learning+resources`];
    });
    return fallback;
  }
}

module.exports = { generateLearningResources };