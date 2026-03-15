import { generateText } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { calculateScore, type AuditAnswers } from "@/lib/scoring/calculate";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const answers = body.answers as AuditAnswers;

    if (!answers || !answers.business_name) {
      return Response.json({ error: "Missing answers" }, { status: 400 });
    }

    // Calculate score
    const score = calculateScore(answers);

    // Generate AI recommendations
    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      // Return score without AI recommendations if no key
      return Response.json({
        score,
        recommendations: [
          {
            priority: "high",
            title: "AI recommendations unavailable",
            description: "Set up a GROQ_API_KEY to enable AI-powered recommendations.",
          },
        ],
      });
    }

    const groq = createGroq({ apiKey: groqKey });

    const prompt = `You are a Google Business Profile optimization expert. Analyze this business profile audit and provide exactly 5 actionable recommendations.

Business: ${answers.business_name} (${answers.business_type})
Overall Score: ${score.overall}/100

Category Scores:
${score.categories.map((c) => `- ${c.name}: ${c.score}/100 (weight: ${c.weightLabel})`).join("\n")}

Raw Answers:
- Profile completeness: ${answers.profile_complete}
- Photos: ${answers.photos}
- Reviews: ${answers.reviews}
- Review responses: ${answers.review_responses}
- Posting frequency: ${answers.posts}
- Description quality: ${answers.description}
- Business hours: ${answers.hours}
- Q&A section: ${answers.qna}

Respond in this exact JSON format (no markdown, no code blocks, just pure JSON):
[
  {
    "priority": "high" | "medium" | "low",
    "title": "Short action title (max 8 words)",
    "description": "One or two sentences explaining what to do and why it matters."
  }
]

Rules:
- Sort by impact (high priority first)
- Focus on the weakest categories first
- Be specific and actionable, not generic
- Max 2 high, 2 medium, 1 low priority items
- Keep descriptions under 150 characters`;

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt,
      temperature: 0.3,
      maxOutputTokens: 800,
    });

    let recommendations;
    try {
      // Clean potential markdown wrapping
      const cleaned = text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
      recommendations = JSON.parse(cleaned);
    } catch {
      recommendations = [
        {
          priority: "high",
          title: "Could not parse AI response",
          description: "The AI returned an unexpected format. Your score is still accurate.",
        },
      ];
    }

    return Response.json({ score, recommendations });
  } catch (error) {
    console.error("Audit API error:", error);
    return Response.json(
      { error: "Failed to process audit" },
      { status: 500 }
    );
  }
}
