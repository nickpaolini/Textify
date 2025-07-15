"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Loader2, Trash2 } from "lucide-react";
import clsx from "clsx";

const PLACEHOLDER = "Enter your text here...";

const TRANSFORM_OPTIONS = [
  { key: "markdown", label: "Convert to Markdown Code" },
  { key: "brief", label: "Re-word (Corporate Brief)" },
  { key: "gdocs", label: "Format for Google Docs" },
];

type OutputType = "markdown" | "brief" | "gdocs";

const SHOW_MORE_LIMIT = 600;

export default function HomePage() {
  const [input, setInput] = useState("");
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [brief, setBrief] = useState<string | null>(null);
  const [gdocs, setGdocs] = useState<string | null>(null);
  const [loading, setLoading] = useState<OutputType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<{ markdown: boolean; brief: boolean; gdocs: boolean }>({
    markdown: false,
    brief: false,
    gdocs: false,
  });
  const [selectedTransform, setSelectedTransform] = useState<OutputType>("markdown");
  const [showMore, setShowMore] = useState<{ [k in OutputType]: boolean }>({
    markdown: false,
    brief: false,
    gdocs: false,
  });

  const handleTransform = async (type: OutputType) => {
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
      else if (type === "brief") setBrief(data.result);
      else if (type === "gdocs") setGdocs(data.result);
      setShowMore((prev) => ({ ...prev, [type]: false }));
    } catch (e: unknown) {
      let message = "Something went wrong";
      if (e instanceof Error) message = e.message;
      setError(message);
    } finally {
      setLoading(null);
    }
  };

  const handleCopy = (type: OutputType) => {
    const text = type === "markdown" ? markdown : type === "brief" ? brief : gdocs;
    if (!text) return;
    if (type === "gdocs") {
      if (navigator.clipboard && window.ClipboardItem) {
        const blob = new Blob([text], { type: "text/html" });
        const data = [new window.ClipboardItem({ "text/html": blob })];
        navigator.clipboard.write(data);
      } else {
        navigator.clipboard.writeText(text);
      }
    } else {
      navigator.clipboard.writeText(text);
    }
    setCopied((prev) => ({ ...prev, [type]: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [type]: false })), 1500);
  };

  const handleClearAll = () => {
    setInput("");
    setMarkdown(null);
    setBrief(null);
    setGdocs(null);
    setError(null);
    setShowMore({ markdown: false, brief: false, gdocs: false });
  };

  // Helper for show more/collapse
  const getOutputContent = (type: OutputType, content: string | null) => {
    if (!content) return null;
    if (content.length <= SHOW_MORE_LIMIT || showMore[type]) return content;
    return content.slice(0, SHOW_MORE_LIMIT) + "...";
  };

  // Transformation controls: dropdown if >3, else buttons
  const renderTransformControls = () => {
    if (TRANSFORM_OPTIONS.length > 3) {
      return (
        <div className="flex flex-col sm:flex-row gap-3 mb-8 items-center">
          <select
            className="border rounded px-3 py-2 bg-background text-foreground"
            value={selectedTransform}
            onChange={e => setSelectedTransform(e.target.value as OutputType)}
            aria-label="Select transformation"
          >
            {TRANSFORM_OPTIONS.map(opt => (
              <option key={opt.key} value={opt.key}>{opt.label}</option>
            ))}
          </select>
          <Button
            onClick={() => handleTransform(selectedTransform)}
            disabled={!input.trim() || loading !== null}
            aria-label={TRANSFORM_OPTIONS.find(opt => opt.key === selectedTransform)?.label}
          >
            {loading === selectedTransform ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                {TRANSFORM_OPTIONS.find(opt => opt.key === selectedTransform)?.label || "Transforming..."}
              </>
            ) : (
              TRANSFORM_OPTIONS.find(opt => opt.key === selectedTransform)?.label || "Transform"
            )}
          </Button>
        </div>
      );
    }
    return (
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {TRANSFORM_OPTIONS.map(opt => (
          <Button
            key={opt.key}
            variant={opt.key === "markdown" ? "default" : opt.key === "brief" ? "secondary" : "outline"}
            onClick={() => handleTransform(opt.key as OutputType)}
            disabled={!input.trim() || loading !== null}
            aria-label={opt.label}
          >
            {loading === opt.key ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                {opt.label}
              </>
            ) : (
              opt.label
            )}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <section className="w-full max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-2 text-center tracking-tight">
        Textify
      </h1>
      <p className="text-lg text-muted-foreground mb-8 text-center">
        Instantly transform your text with AI-powered tools.
      </p>
      <div className="flex items-center justify-between mb-2">
        <label htmlFor="input" className="block font-medium">
          Your Text
        </label>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClearAll}
          aria-label="Clear all"
          title="Clear all"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
      <Textarea
        id="input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={PLACEHOLDER}
        rows={7}
        aria-label="Input text area"
        className="mb-4 resize-y"
        disabled={loading !== null}
      />
      {renderTransformControls()}
      {error && (
        <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
      )}
      <Tabs defaultValue="markdown" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger 
            value="markdown" 
            className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800 dark:data-[state=active]:bg-green-900/30 dark:data-[state=active]:text-green-300 data-[state=active]:border-green-300 dark:data-[state=active]:border-green-700"
          >
            Markdown Code
          </TabsTrigger>
          <TabsTrigger 
            value="brief"
            className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800 dark:data-[state=active]:bg-green-900/30 dark:data-[state=active]:text-green-300 data-[state=active]:border-green-300 dark:data-[state=active]:border-green-700"
          >
            Corporate Brief
          </TabsTrigger>
          <TabsTrigger 
            value="gdocs"
            className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800 dark:data-[state=active]:bg-green-900/30 dark:data-[state=active]:text-green-300 data-[state=active]:border-green-300 dark:data-[state=active]:border-green-700"
          >
            Google Docs
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="markdown" className="mt-6">
          <Card>
            <div className="flex items-center justify-between p-4 pb-2">
              <h2 className="font-semibold text-lg">Markdown Code</h2>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy("markdown")}
                  disabled={!markdown}
                  aria-label="Copy Markdown Output"
                  title="Copy Markdown Output"
                >
                  <Copy
                    className={clsx(
                      "h-5 w-5",
                      copied.markdown ? "text-green-500" : "text-muted-foreground"
                    )}
                  />
                </Button>
                {markdown && markdown.length > SHOW_MORE_LIMIT && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMore((prev) => ({ ...prev, markdown: !prev.markdown }))}
                    aria-label={showMore.markdown ? "Collapse" : "Show More"}
                    title={showMore.markdown ? "Collapse" : "Show More"}
                  >
                    {showMore.markdown ? "Collapse" : "Show More"}
                  </Button>
                )}
              </div>
            </div>
            <div className="mx-4 mb-4">
              <ScrollArea className="h-[300px] w-full bg-muted rounded">
                <div className="p-3">
                {markdown ? (
                  <pre className="whitespace-pre-wrap text-sm pr-4">{getOutputContent("markdown", markdown)}</pre>
                ) : (
                  <span className="text-muted-foreground">
                    Output will appear here.
                  </span>
                )}
                </div>
              </ScrollArea>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="brief" className="mt-6">
          <Card>
            <div className="flex items-center justify-between p-4 pb-2">
              <h2 className="font-semibold text-lg">Corporate Brief</h2>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy("brief")}
                  disabled={!brief}
                  aria-label="Copy Corporate Brief Output"
                  title="Copy Corporate Brief Output"
                >
                  <Copy
                    className={clsx(
                      "h-5 w-5",
                      copied.brief ? "text-green-500" : "text-muted-foreground"
                    )}
                  />
                </Button>
                {brief && brief.length > SHOW_MORE_LIMIT && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMore((prev) => ({ ...prev, brief: !prev.brief }))}
                    aria-label={showMore.brief ? "Collapse" : "Show More"}
                    title={showMore.brief ? "Collapse" : "Show More"}
                  >
                    {showMore.brief ? "Collapse" : "Show More"}
                  </Button>
                )}
              </div>
            </div>
            <div className="mx-4 mb-4">
              <ScrollArea className="h-[300px] w-full bg-muted rounded">
                <div className="p-3">
                {brief ? (
                  <span className="whitespace-pre-wrap text-sm pr-4">{getOutputContent("brief", brief)}</span>
                ) : (
                  <span className="text-muted-foreground">
                    Output will appear here.
                  </span>
                )}
                </div>
              </ScrollArea>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="gdocs" className="mt-6">
          <Card>
            <div className="flex items-center justify-between p-4 pb-2">
              <h2 className="font-semibold text-lg">Google Docs</h2>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy("gdocs")}
                  disabled={!gdocs}
                  aria-label="Copy Google Docs Output"
                  title="Copy Google Docs Output"
                >
                  <Copy
                    className={clsx(
                      "h-5 w-5",
                      copied.gdocs ? "text-green-500" : "text-muted-foreground"
                    )}
                  />
                </Button>
                {gdocs && gdocs.length > SHOW_MORE_LIMIT && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMore((prev) => ({ ...prev, gdocs: !prev.gdocs }))}
                    aria-label={showMore.gdocs ? "Collapse" : "Show More"}
                    title={showMore.gdocs ? "Collapse" : "Show More"}
                  >
                    {showMore.gdocs ? "Collapse" : "Show More"}
                  </Button>
                )}
              </div>
            </div>
            <div className="mx-4 mb-4">
              <ScrollArea className="h-[300px] w-full bg-muted rounded">
                <div className="p-3">
                {gdocs ? (
                  <div
                    className="prose prose-sm max-w-none bg-white/80 dark:bg-black/40 rounded p-2 border border-border pr-4"
                    dangerouslySetInnerHTML={{ __html: getOutputContent("gdocs", gdocs) || "" }}
                  />
                ) : (
                  <span className="text-muted-foreground">
                    Output will appear here.
                  </span>
                )}
                </div>
              </ScrollArea>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
