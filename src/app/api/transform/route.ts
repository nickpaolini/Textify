import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
      prompt = `Format the following text as rich markdown. Use appropriate markdown features such as headers, subheadings, bulleted or numbered lists, links, bold, italics, and blockquotes where relevant. Do not output a code block. Only output the markdown-formatted text, nothing else.\n\nText:\n${text}`;
    } else if (type === "brief") {
      prompt = `Re-word the following text as a formal, concise corporate brief, as if excerpted from a quarterly financial report of a publicly traded company. Use business buzzwords and formal phrasing. Only output the reworded text.\n\nText:\n${text}`;
    } else {
      return NextResponse.json({ error: "Invalid type." }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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