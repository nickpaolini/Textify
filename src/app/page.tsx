'use client';

import clsx from 'clsx';
import { Copy, Trash2, ArrowLeftRight, Download } from 'lucide-react';
import { useState, useRef, useCallback, useEffect } from 'react';

import ComparisonView from '@/components/ComparisonView';
import FileUpload from '@/components/FileUpload';
import SmartControls from '@/components/SmartControls';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  LoadingPulse,
  StreamingSkeleton,
  TransformingAnimation,
} from '@/components/ui/loading';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToastActions } from '@/components/ui/toast';
import { exportByType, sanitizeFilename } from '@/lib/export';
import { type FileProcessingResult } from '@/lib/fileUtils';
import { saveTransformation } from '@/lib/history';
import {
  StreamingTransformer,
  type SmartControlsConfig,
} from '@/lib/streaming';

const PLACEHOLDER = 'Enter your text here...';

const TRANSFORM_OPTIONS = [
  { key: 'markdown', label: 'Convert to Markdown Code' },
  { key: 'brief', label: 'Re-word (Corporate Brief)' },
  { key: 'gdocs', label: 'Format for Google Docs' },
];

type OutputType = 'markdown' | 'brief' | 'gdocs';

const SHOW_MORE_LIMIT = 600;

export default function HomePage() {
  const [input, setInput] = useState('');
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [brief, setBrief] = useState<string | null>(null);
  const [gdocs, setGdocs] = useState<string | null>(null);
  const [loading, setLoading] = useState<OutputType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<{
    markdown: boolean;
    brief: boolean;
    gdocs: boolean;
  }>({
    markdown: false,
    brief: false,
    gdocs: false,
  });
  const { showCopySuccess, showExportSuccess, showError } = useToastActions();
  const [selectedTransform, setSelectedTransform] =
    useState<OutputType>('markdown');
  const [showMore, setShowMore] = useState<{ [k in OutputType]: boolean }>({
    markdown: false,
    brief: false,
    gdocs: false,
  });
  const [currentFileName, setCurrentFileName] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState<{
    [k in OutputType]: string;
  }>({
    markdown: '',
    brief: '',
    gdocs: '',
  });
  const [isStreaming, setIsStreaming] = useState<OutputType | null>(null);
  const streamingTransformersRef = useRef<{
    [k in OutputType]?: StreamingTransformer;
  }>({});
  const scrollAreaRefs = useRef<{ [k in OutputType]?: HTMLDivElement }>({});
  const [smartControls, setSmartControls] = useState<SmartControlsConfig>({
    tone: 50,
    length: 'standard',
    customPrompt: '',
    useCustomPrompt: false,
  });
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonData, setComparisonData] = useState<{
    original: string;
    transformed: string;
    type: OutputType;
  } | null>(null);

  // Auto-scroll to bottom during streaming
  useEffect(() => {
    if (isStreaming) {
      const scrollArea = scrollAreaRefs.current[isStreaming];
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }
    }
  }, [streamingContent, isStreaming]);

  const handleTransform = useCallback(
    async (type: OutputType) => {
      setError(null);
      setLoading(type);
      setIsStreaming(type);

      // Clear previous streaming content
      setStreamingContent((prev) => ({ ...prev, [type]: '' }));

      // Clear existing result for this type
      if (type === 'markdown') setMarkdown(null);
      else if (type === 'brief') setBrief(null);
      else if (type === 'gdocs') setGdocs(null);

      // Abort any existing streaming for this type
      if (streamingTransformersRef.current[type]) {
        streamingTransformersRef.current[type]!.abort();
      }

      // Create new streaming transformer
      const transformer = new StreamingTransformer();
      streamingTransformersRef.current[type] = transformer;

      try {
        await transformer.transform(input, type, smartControls, {
          onChunk: (chunk) => {
            setStreamingContent((prev) => ({
              ...prev,
              [type]: prev[type] + chunk,
            }));
          },
          onComplete: (fullContent) => {
            // Set final result in the appropriate state
            if (type === 'markdown') setMarkdown(fullContent);
            else if (type === 'brief') setBrief(fullContent);
            else if (type === 'gdocs') setGdocs(fullContent);

            // Clear streaming content
            setStreamingContent((prev) => ({ ...prev, [type]: '' }));
            setShowMore((prev) => ({ ...prev, [type]: false }));

            // Set comparison data
            setComparisonData({
              original: input,
              transformed: fullContent,
              type,
            });

            // Save to history
            saveTransformation({
              inputText: input,
              outputText: fullContent,
              transformationType: type,
              title: currentFileName || undefined,
            });

            setIsStreaming(null);
            setLoading(null);

            // Clean up transformer reference
            delete streamingTransformersRef.current[type];
          },
          onError: (errorMessage) => {
            setError(errorMessage);
            setIsStreaming(null);
            setLoading(null);

            // Clean up transformer reference
            delete streamingTransformersRef.current[type];
          },
        });
      } catch (e: unknown) {
        let message = 'Something went wrong';
        if (e instanceof Error) message = e.message;
        setError(message);
        setIsStreaming(null);
        setLoading(null);

        // Clean up transformer reference
        delete streamingTransformersRef.current[type];
      }
    },
    [input, currentFileName, smartControls]
  );

  const handleCopy = async (type: OutputType) => {
    const text =
      type === 'markdown' ? markdown : type === 'brief' ? brief : gdocs;
    if (!text) return;

    try {
      if (type === 'gdocs') {
        if (navigator.clipboard && window.ClipboardItem) {
          const blob = new Blob([text], { type: 'text/html' });
          const data = [new window.ClipboardItem({ 'text/html': blob })];
          await navigator.clipboard.write(data);
        } else {
          await navigator.clipboard.writeText(text);
        }
      } else {
        await navigator.clipboard.writeText(text);
      }

      setCopied((prev) => ({ ...prev, [type]: true }));
      setTimeout(() => setCopied((prev) => ({ ...prev, [type]: false })), 1500);

      // Show success toast
      const typeLabel =
        type === 'markdown'
          ? 'Markdown'
          : type === 'brief'
            ? 'Corporate Brief'
            : 'Google Docs';
      showCopySuccess(typeLabel);
    } catch {
      showError('Failed to copy to clipboard');
    }
  };

  const handleExport = (type: OutputType) => {
    const text =
      type === 'markdown' ? markdown : type === 'brief' ? brief : gdocs;
    if (!text) return;

    try {
      const filename = currentFileName
        ? sanitizeFilename(currentFileName.replace(/\.[^/.]+$/, '')) // Remove existing extension
        : undefined;

      exportByType(text, type, { filename });

      // Show success toast
      const typeLabel =
        type === 'markdown'
          ? 'Markdown'
          : type === 'brief'
            ? 'Corporate Brief'
            : 'Google Docs';
      showExportSuccess(typeLabel);
    } catch {
      showError('Failed to export file');
    }
  };

  const handleClearAll = () => {
    // Abort any ongoing streaming
    Object.values(streamingTransformersRef.current).forEach((transformer) => {
      transformer?.abort();
    });
    streamingTransformersRef.current = {};

    setInput('');
    setMarkdown(null);
    setBrief(null);
    setGdocs(null);
    setError(null);
    setCurrentFileName(null);
    setIsStreaming(null);
    setLoading(null);
    setStreamingContent({ markdown: '', brief: '', gdocs: '' });
    setShowMore({ markdown: false, brief: false, gdocs: false });
  };

  const handleFileProcessed = (result: FileProcessingResult) => {
    if (result.success && result.text.trim()) {
      setInput(result.text);
      setCurrentFileName(result.filename);
      setError(null);
      // Clear any existing outputs
      setMarkdown(null);
      setBrief(null);
      setGdocs(null);
      setShowMore({ markdown: false, brief: false, gdocs: false });
    } else if (result.error) {
      setError(result.error);
    }
  };

  // Helper for show more/collapse
  const getOutputContent = (type: OutputType, content: string | null) => {
    if (!content) return null;
    if (content.length <= SHOW_MORE_LIMIT || showMore[type]) return content;
    return `${content.slice(0, SHOW_MORE_LIMIT)}...`;
  };

  // Helper to get current content (streaming or final)
  const getCurrentContent = (type: OutputType) => {
    if (isStreaming === type && streamingContent[type]) {
      return streamingContent[type];
    }

    switch (type) {
      case 'markdown':
        return markdown;
      case 'brief':
        return brief;
      case 'gdocs':
        return gdocs;
      default:
        return null;
    }
  };

  // Helper to check if content should show cursor
  const shouldShowCursor = (type: OutputType) => {
    return isStreaming === type && streamingContent[type];
  };

  // Transformation controls: dropdown if >3, else buttons
  const renderTransformControls = () => {
    if (TRANSFORM_OPTIONS.length > 3) {
      return (
        <div className="flex flex-col sm:flex-row gap-3 mb-8 items-center">
          <select
            className="border rounded px-3 py-2 bg-background text-foreground"
            value={selectedTransform}
            onChange={(e) => setSelectedTransform(e.target.value as OutputType)}
            aria-label="Select transformation"
          >
            {TRANSFORM_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
          <Button
            onClick={() => handleTransform(selectedTransform)}
            disabled={!input.trim() || loading !== null}
            aria-label={
              TRANSFORM_OPTIONS.find((opt) => opt.key === selectedTransform)
                ?.label
            }
          >
            {loading === selectedTransform ? (
              <LoadingPulse>
                <span>
                  {TRANSFORM_OPTIONS.find(
                    (opt) => opt.key === selectedTransform
                  )?.label || 'Transforming...'}
                </span>
              </LoadingPulse>
            ) : (
              TRANSFORM_OPTIONS.find((opt) => opt.key === selectedTransform)
                ?.label || 'Transform'
            )}
          </Button>
        </div>
      );
    }
    return (
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {TRANSFORM_OPTIONS.map((opt) => (
          <Button
            key={opt.key}
            variant={
              opt.key === 'markdown'
                ? 'default'
                : opt.key === 'brief'
                  ? 'secondary'
                  : 'outline'
            }
            onClick={() => handleTransform(opt.key as OutputType)}
            disabled={!input.trim() || loading !== null}
            aria-label={opt.label}
          >
            {loading === opt.key ? (
              <LoadingPulse>
                <span>{opt.label}</span>
              </LoadingPulse>
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

      <FileUpload
        onFileProcessed={handleFileProcessed}
        disabled={loading !== null}
        className="mb-6"
      />

      <SmartControls
        config={smartControls}
        onChange={setSmartControls}
        disabled={loading !== null}
        className="mb-6"
      />

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
        onChange={(e) => {
          setInput(e.target.value);
          // Clear filename when manually editing text
          if (currentFileName) setCurrentFileName(null);
        }}
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
                  onClick={() => handleCopy('markdown')}
                  disabled={!markdown}
                  aria-label="Copy Markdown Output"
                  title="Copy Markdown Output"
                >
                  <Copy
                    className={clsx(
                      'h-5 w-5',
                      copied.markdown
                        ? 'text-green-500'
                        : 'text-muted-foreground'
                    )}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleExport('markdown')}
                  disabled={!markdown}
                  aria-label="Export Markdown File"
                  title="Export Markdown File"
                >
                  <Download className="h-5 w-5 text-muted-foreground" />
                </Button>
                {markdown && markdown.length > SHOW_MORE_LIMIT && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setShowMore((prev) => ({
                        ...prev,
                        markdown: !prev.markdown,
                      }))
                    }
                    aria-label={showMore.markdown ? 'Collapse' : 'Show More'}
                    title={showMore.markdown ? 'Collapse' : 'Show More'}
                  >
                    {showMore.markdown ? 'Collapse' : 'Show More'}
                  </Button>
                )}
              </div>
            </div>
            <div className="mx-4 mb-4">
              <ScrollArea className="h-[300px] w-full bg-muted rounded">
                <div className="p-3">
                  {(() => {
                    const content = getCurrentContent('markdown');
                    const showCursor = shouldShowCursor('markdown');

                    // Show loading animation when transforming
                    if (loading === 'markdown' && !content) {
                      return <TransformingAnimation type="markdown" />;
                    }

                    // Show streaming skeleton when starting to stream
                    if (isStreaming === 'markdown' && !content) {
                      return <StreamingSkeleton />;
                    }

                    if (content) {
                      return (
                        <pre className="whitespace-pre-wrap text-sm pr-4">
                          {getOutputContent('markdown', content)}
                          {showCursor && (
                            <span className="animate-pulse text-primary">
                              |
                            </span>
                          )}
                        </pre>
                      );
                    }

                    return (
                      <span className="text-muted-foreground">
                        Output will appear here.
                      </span>
                    );
                  })()}
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
                  onClick={() => handleCopy('brief')}
                  disabled={!brief}
                  aria-label="Copy Corporate Brief Output"
                  title="Copy Corporate Brief Output"
                >
                  <Copy
                    className={clsx(
                      'h-5 w-5',
                      copied.brief ? 'text-green-500' : 'text-muted-foreground'
                    )}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleExport('brief')}
                  disabled={!brief}
                  aria-label="Export Brief as Text File"
                  title="Export Brief as Text File"
                >
                  <Download className="h-5 w-5 text-muted-foreground" />
                </Button>
                {brief && brief.length > SHOW_MORE_LIMIT && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setShowMore((prev) => ({ ...prev, brief: !prev.brief }))
                    }
                    aria-label={showMore.brief ? 'Collapse' : 'Show More'}
                    title={showMore.brief ? 'Collapse' : 'Show More'}
                  >
                    {showMore.brief ? 'Collapse' : 'Show More'}
                  </Button>
                )}
              </div>
            </div>
            <div className="mx-4 mb-4">
              <ScrollArea className="h-[300px] w-full bg-muted rounded">
                <div className="p-3">
                  {(() => {
                    const content = getCurrentContent('brief');
                    const showCursor = shouldShowCursor('brief');

                    // Show loading animation when transforming
                    if (loading === 'brief' && !content) {
                      return <TransformingAnimation type="brief" />;
                    }

                    // Show streaming skeleton when starting to stream
                    if (isStreaming === 'brief' && !content) {
                      return <StreamingSkeleton />;
                    }

                    if (content) {
                      return (
                        <span className="whitespace-pre-wrap text-sm pr-4">
                          {getOutputContent('brief', content)}
                          {showCursor && (
                            <span className="animate-pulse text-primary">
                              |
                            </span>
                          )}
                        </span>
                      );
                    }

                    return (
                      <span className="text-muted-foreground">
                        Output will appear here.
                      </span>
                    );
                  })()}
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
                  onClick={() => handleCopy('gdocs')}
                  disabled={!gdocs}
                  aria-label="Copy Google Docs Output"
                  title="Copy Google Docs Output"
                >
                  <Copy
                    className={clsx(
                      'h-5 w-5',
                      copied.gdocs ? 'text-green-500' : 'text-muted-foreground'
                    )}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleExport('gdocs')}
                  disabled={!gdocs}
                  aria-label="Export as HTML File"
                  title="Export as HTML File"
                >
                  <Download className="h-5 w-5 text-muted-foreground" />
                </Button>
                {gdocs && gdocs.length > SHOW_MORE_LIMIT && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setShowMore((prev) => ({ ...prev, gdocs: !prev.gdocs }))
                    }
                    aria-label={showMore.gdocs ? 'Collapse' : 'Show More'}
                    title={showMore.gdocs ? 'Collapse' : 'Show More'}
                  >
                    {showMore.gdocs ? 'Collapse' : 'Show More'}
                  </Button>
                )}
              </div>
            </div>
            <div className="mx-4 mb-4">
              <ScrollArea className="h-[300px] w-full bg-muted rounded">
                <div className="p-3">
                  {(() => {
                    const content = getCurrentContent('gdocs');
                    const showCursor = shouldShowCursor('gdocs');

                    // Show loading animation when transforming
                    if (loading === 'gdocs' && !content) {
                      return <TransformingAnimation type="gdocs" />;
                    }

                    // Show streaming skeleton when starting to stream
                    if (isStreaming === 'gdocs' && !content) {
                      return <StreamingSkeleton />;
                    }

                    if (content) {
                      return (
                        <div className="prose prose-sm max-w-none bg-white/80 dark:bg-black/40 rounded p-2 border border-border pr-4">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: getOutputContent('gdocs', content) || '',
                            }}
                          />
                          {showCursor && (
                            <span className="animate-pulse text-primary">
                              |
                            </span>
                          )}
                        </div>
                      );
                    }

                    return (
                      <span className="text-muted-foreground">
                        Output will appear here.
                      </span>
                    );
                  })()}
                </div>
              </ScrollArea>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Comparison Toggle Button */}
      {comparisonData && (
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => setShowComparison(!showComparison)}
            className="flex items-center gap-2"
          >
            <ArrowLeftRight className="h-4 w-4" />
            {showComparison ? 'Hide' : 'Show'} Before & After Comparison
          </Button>
        </div>
      )}

      {/* Comparison View */}
      {comparisonData && (
        <ComparisonView
          originalText={comparisonData.original}
          transformedText={comparisonData.transformed}
          transformType={comparisonData.type}
          isVisible={showComparison}
          onClose={() => setShowComparison(false)}
          className="mt-6"
        />
      )}
    </section>
  );
}
