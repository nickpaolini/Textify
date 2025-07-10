import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MARKDOWN_PROMPT = process.env.MARKDOWN_PROMPT ||
  `Format the following text as rich markdown. Use appropriate markdown features such as headers, subheadings, bulleted or numbered lists, links, bold, italics, and blockquotes where relevant. Do not output a code block. Only output the markdown-formatted text, nothing else.\n\nAt the end, add a new line with 3-7 relevant hashtags (all lowercase, no spaces, separated by spaces), based on the content, suitable for use in Obsidian.\n\nText:\n`;
  const BRIEF_PROMPT = process.env.BRIEF_PROMPT ||
  `Re-word the following text as a formal, concise corporate brief, as if excerpted from a quarterly financial report of a publicly traded company. Use business buzzwords and formal phrasing. Only output the reworded text.

  **Knowledge Base: Corporate Brief Essentials**

  Focus on these key elements and verbiage:

  * **Strategic Overview:** Emphasize operational excellence, market leadership, and business resilience in dynamic environments.
  * **Financial Performance:** Report **revenue, EBITDA, net income, EPS**, and **free cash flow** with **percentage changes** (e.g., "up X%, down Y%"). Highlight **profitability** and **cash generation**.
  * **Customer & Subscriber Growth:** Detail **total additions** and **segment-specific growth** (e.g., mobile, internet, health lives covered).
  * **Key Initiatives/Drivers:** Mention factors like **strategic investments, cost efficiencies, synergy realization (post-acquisition), product enhancements, and network expansion**.
  * **Capital Allocation:** Discuss **capital expenditures** and **dividend programs**, including **growth targets** and **deleveraging efforts**.
  * **Outlook/Guidance:** Reiterate **financial targets** or **future projections**.
  * **Tone & Language:** Maintain a **formal, objective, and professional tone**. Use **quantifiable metrics** and **business-centric vocabulary** (e.g., "robust," "resilient," "optimized," "synergies," "strategic imperative," "stakeholder value"). Avoid contractions.

  Text:
  `;
const GDOCS_PROMPT = process.env.GDOCS_PROMPT ||
  `Format the following text as HTML for Google Docs. Use appropriate HTML tags such as <h1>, <h2>, <ul>, <li>, <b>, <i>, <blockquote>, and <a> for links. Do not use markdown. Only output the HTML-formatted text, nothing else.\n\nText:\n`;

export async function POST(req: NextRequest) {
  try {
    const { text, type } = await req.json();

    if (!text || !type) {
      return NextResponse.json(
        { error: "Missing text or type." },
        { status: 400 }
      );
    }

    let prompt = "";
    if (type === "markdown") {
      prompt = MARKDOWN_PROMPT + text;
    } else if (type === "brief") {
      prompt = BRIEF_PROMPT + text;
    } else if (type === "gdocs") {
      prompt = GDOCS_PROMPT + text;
    } else {
      return NextResponse.json({ error: "Invalid type." }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 512,
      temperature: 0.6,
    });

    const result = completion.choices[0]?.message?.content?.trim();
    if (!result) {
      return NextResponse.json(
        { error: "No response from OpenAI." },
        { status: 500 }
      );
    }

    return NextResponse.json({ result });
  } catch (e: unknown) {
    let message = "Internal server error.";
    if (e instanceof Error) message = e.message;
    console.error(e);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
} 