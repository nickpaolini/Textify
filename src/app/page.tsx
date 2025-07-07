"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Loader2 } from "lucide-react";
import clsx from "clsx";

const PLACEHOLDER = "Enter your text here...";

export default function HomePage() {
  const [input, setInput] = useState("");
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [brief, setBrief] = useState<string | null>(null);
  const [loading, setLoading] = useState<"markdown" | "brief" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<{ markdown: boolean; brief: boolean }>({
    markdown: false,
    brief: false,
  });

  const handleTransform = async (type: "markdown" | "brief") => {
    setError(null);
    setLoading(type);
    try {
      const res = await fetch("/api/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      if (type === "markdown") setMarkdown(data.result);
      else setBrief(data.result);
    } catch (e: unknown) {
      let message = "Something went wrong";
      if (e instanceof Error) message = e.message;
      setError(message);
    } finally {
      setLoading(null);
    }
  };

  const handleCopy = (type: "markdown" | "brief") => {
    const text = type === "markdown" ? markdown : brief;
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied((prev) => ({ ...prev, [type]: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [type]: false })), 1500);
  };

  return (
    <section className="w-full max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-2 text-center tracking-tight">
        Textify
      </h1>
      <p className="text-lg text-muted-foreground mb-8 text-center">
        Instantly transform your text with AI-powered tools.
      </p>
      <label htmlFor="input" className="block font-medium mb-2">
        Your Text
      </label>
      <Textarea
        id="input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={PLACEHOLDER}
        rows={7}
        aria-label="Input text area"
        className="mb-4 resize-none"
        disabled={loading !== null}
      />
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <Button
          onClick={() => handleTransform("markdown")}
          disabled={!input.trim() || loading !== null}
          aria-label="Convert to Markdown Code"
        >
          {loading === "markdown" ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Converting...
            </>
          ) : (
            "Convert to Markdown Code"
          )}
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleTransform("brief")}
          disabled={!input.trim() || loading !== null}
          aria-label="Re-word as Corporate Brief"
        >
          {loading === "brief" ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Re-wording...
            </>
          ) : (
            "Re-word (Corporate Brief)"
          )}
        </Button>
      </div>
      {error && (
        <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-lg">Markdown Code</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCopy("markdown")}
              disabled={!markdown}
              aria-label="Copy Markdown Output"
            >
              <Copy
                className={clsx(
                  "h-5 w-5",
                  copied.markdown ? "text-green-500" : "text-muted-foreground"
                )}
              />
            </Button>
          </div>
          <div className="bg-muted rounded p-3 min-h-[120px] overflow-x-auto">
            {markdown ? (
              <pre className="whitespace-pre-wrap text-sm">{markdown}</pre>
            ) : (
              <span className="text-muted-foreground">
                Output will appear here.
              </span>
            )}
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-lg">Corporate Brief</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCopy("brief")}
              disabled={!brief}
              aria-label="Copy Corporate Brief Output"
            >
              <Copy
                className={clsx(
                  "h-5 w-5",
                  copied.brief ? "text-green-500" : "text-muted-foreground"
                )}
              />
            </Button>
          </div>
          <div className="bg-muted rounded p-3 min-h-[120px]">
            {brief ? (
              <span className="whitespace-pre-wrap text-sm">{brief}</span>
            ) : (
              <span className="text-muted-foreground">
                Output will appear here.
              </span>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}
