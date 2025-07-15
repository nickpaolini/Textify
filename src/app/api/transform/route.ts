import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MARKDOWN_PROMPT = process.env.MARKDOWN_PROMPT ||
  `Convert the following text to markdown format WITHOUT changing the content or wording. Keep the exact same text and meaning, but add appropriate markdown syntax:

- Use **bold** for emphasis where it would improve readability
- Use *italics* for subtle emphasis 
- Convert any natural headings or titles to markdown headers (# ## ###)
- Convert any lists to markdown bullet points or numbered lists
- Preserve all original wording, sentences, and paragraphs exactly
- Do not rewrite, summarize, or change the content in any way
- Only add markdown formatting syntax
- At the end, add a new line with 3-7 relevant hashtags (all lowercase, no spaces, separated by spaces) based on the content, suitable for use in Obsidian

Output only the markdown-formatted version of the original text with hashtags at the end.\n\nText:\n`;
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

function getToneInstruction(tone: number): string {
  if (tone <= 20) return "Use very formal, academic language. Avoid contractions and use sophisticated vocabulary.";
  if (tone <= 40) return "Use formal, professional language appropriate for business contexts.";
  if (tone <= 60) return "Use balanced, clear language that is neither too formal nor too casual.";
  if (tone <= 80) return "Use casual, conversational language while maintaining professionalism.";
  return "Use very casual, friendly language with contractions and informal expressions.";
}

function getLengthInstruction(length: string): string {
  switch (length) {
    case 'brief': return "Keep the output concise and to the point. Aim for brevity while preserving key information.";
    case 'detailed': return "Provide a comprehensive, detailed output with thorough explanations and examples where appropriate.";
    default: return "Provide a balanced output with appropriate detail and clarity.";
  }
}

function buildDynamicPrompt(basePrompt: string, text: string, smartControls?: SmartControls, transformationType?: string): string {
  let prompt = basePrompt;
  
  // Skip smart controls for markdown since it should be pure formatting
  if (smartControls && transformationType !== 'markdown') {
    const instructions = [];
    
    // Add tone instruction
    if (smartControls.tone !== undefined && smartControls.tone !== 50) {
      instructions.push(getToneInstruction(smartControls.tone));
    }
    
    // Add length instruction
    if (smartControls.length && smartControls.length !== 'standard') {
      instructions.push(getLengthInstruction(smartControls.length));
    }
    
    // Add custom instructions
    if (smartControls.useCustomPrompt && smartControls.customPrompt?.trim()) {
      instructions.push(`Additional instructions: ${smartControls.customPrompt.trim()}`);
    }
    
    // Insert instructions before the text
    if (instructions.length > 0) {
      prompt = prompt + "\nAdditional guidelines:\n" + instructions.map(inst => `- ${inst}`).join('\n') + "\n\n";
    }
  }
  
  return prompt + text;
}

interface SmartControls {
  tone?: number; // 0-100
  length?: 'brief' | 'standard' | 'detailed';
  customPrompt?: string;
  useCustomPrompt?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const { text, type, stream = false, smartControls }: {
      text: string;
      type: string;
      stream?: boolean;
      smartControls?: SmartControls;
    } = await req.json();

    if (!text || !type) {
      return NextResponse.json(
        { error: "Missing text or type." },
        { status: 400 }
      );
    }

    let basePrompt = "";
    if (type === "markdown") {
      basePrompt = MARKDOWN_PROMPT;
    } else if (type === "brief") {
      basePrompt = BRIEF_PROMPT;
    } else if (type === "gdocs") {
      basePrompt = GDOCS_PROMPT;
    } else {
      return NextResponse.json({ error: "Invalid type." }, { status: 400 });
    }

    const prompt = buildDynamicPrompt(basePrompt, text, smartControls, type);

    // Handle streaming responses
    if (stream) {
      const encoder = new TextEncoder();
      
      const stream = new ReadableStream({
        async start(controller) {
          try {
            const completion = await openai.chat.completions.create({
              model: "gpt-4o",
              messages: [{ role: "user", content: prompt }],
              max_tokens: 512,
              temperature: 0.6,
              stream: true,
            });

            for await (const chunk of completion) {
              const content = chunk.choices[0]?.delta?.content;
              if (content) {
                const data = JSON.stringify({ content });
                controller.enqueue(encoder.encode(`data: ${data}\n\n`));
              }
            }
            
            // Send completion signal
            controller.enqueue(encoder.encode(`data: {"done": true}\n\n`));
            controller.close();
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Stream error";
            const errorData = JSON.stringify({ error: errorMessage });
            controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Handle non-streaming responses (backwards compatibility)
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