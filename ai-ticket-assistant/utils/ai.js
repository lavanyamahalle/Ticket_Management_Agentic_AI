import { createAgent, gemini } from "@inngest/agent-kit";

const analyzeTicket = async (ticket) => {
  const supportAgent = createAgent({
    model: gemini({
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash-8b",
      apiKey: process.env.GEMINI_API_KEY,
    }),
    name: "AI Ticket Triage Assistant",
    system: `You are an expert AI assistant that processes technical support tickets. 

Your job is to:
1. Summarize the issue.
2. Estimate its priority.
3. Provide helpful notes and resource links for human moderators.
4. List relevant technical skills required.

IMPORTANT:
- Respond with *only* valid raw JSON.
- Do NOT include markdown, code fences, comments, or any extra formatting.
- The format must be a raw JSON object.

Repeat: Do not wrap your output in markdown or code fences.`,
  });

  let response;
  try {
    response = await supportAgent.run(`You are a ticket triage agent. Only return a strict JSON object with no extra text, headers, or markdown.
        
Analyze the following support ticket and provide a JSON object with:

- summary: A short 1-2 sentence summary of the issue.
- priority: One of "low", "medium", or "high".
- helpfulNotes: A detailed technical explanation that a moderator can use to solve this issue. Include useful external links or resources if possible.
- relatedSkills: An array of relevant skills required to solve the issue (e.g., ["React", "MongoDB"]).

Respond ONLY in this JSON format and do not include any other text or markdown in the answer:

{
"summary": "Short summary of the ticket",
"priority": "high",
"helpfulNotes": "Here are useful tips...",
"relatedSkills": ["React", "Node.js"]
}

---

Ticket information:

- Title: ${ticket.title}
- Description: ${ticket.description}`);

  } catch (err) {
    // Log full error details to help diagnose 404/HTTP errors from the AI provider
    try {
      console.error("Error making AI request:", err && err.message ? err.message : err);
      if (err.stack) console.error(err.stack);
      // Some HTTP clients attach response details
      if (err.response) {
        try {
          console.error("AI error response status:", err.response.status);
          console.error("AI error response body:", JSON.stringify(err.response.data || err.response.body || err.response, null, 2));
        } catch (inner) {
          console.error("Error printing err.response", inner);
        }
      }
    } catch (logErr) {
      console.error("Failed to log AI error fully:", logErr);
    }
    return null;
  }

  if (!response) {
    console.error("AI agent returned no response");
    // Provide a safe local fallback so ticket processing can continue even when
    // the remote AI model is unavailable or returns 404. This produces a
    // deterministic object based on the ticket content.
    const fallback = (() => {
      const text = `${ticket.title}. ${ticket.description || ""}`.trim();
      const firstSentence = text.split(/[\.!?]\s/)[0] || text;
      const relatedSkills = [];
      const desc = (ticket.title + ' ' + (ticket.description || '')).toLowerCase();
      if (/react|frontend|reactjs/.test(desc)) relatedSkills.push('React');
      if (/node|express|backend/.test(desc)) relatedSkills.push('Node.js');
      if (/mongo|mongodb|mongoose/.test(desc)) relatedSkills.push('MongoDB');
      if (/sql|postgres|mysql/.test(desc)) relatedSkills.push('SQL');
      if (/docker|k8s|kubernetes/.test(desc)) relatedSkills.push('Docker');
      return {
        summary: firstSentence,
        priority: 'medium',
        helpfulNotes: 'Fallback analysis: ' + (ticket.description || ticket.title),
        relatedSkills,
      };
    })();

    console.warn('Using local AI fallback for ticket analysis');
    return fallback;
  }

  const raw = response.output?.[0]?.context || "";

  try {
    const match = raw.match(/```json\s*([\s\S]*?)\s*```/i);
    const jsonString = match ? match[1] : raw.trim();
    return JSON.parse(jsonString);
  } catch (e) {
    console.log("Failed to parse JSON from AI response: " + e.message);
    return null; // watch out for this
  }
};

export default analyzeTicket;
