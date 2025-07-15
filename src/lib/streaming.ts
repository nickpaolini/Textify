export interface StreamingResponse {
  content?: string;
  done?: boolean;
  error?: string;
}

export interface StreamingOptions {
  onChunk: (content: string) => void;
  onComplete: (fullContent: string) => void;
  onError: (error: string) => void;
  signal?: AbortSignal;
}

export interface SmartControlsConfig {
  tone: number;
  length: 'brief' | 'standard' | 'detailed';
  customPrompt: string;
  useCustomPrompt: boolean;
}

export class StreamingTransformer {
  private controller: AbortController | null = null;
  private fullContent = '';

  async transform(
    text: string, 
    type: 'markdown' | 'brief' | 'gdocs',
    smartControls: SmartControlsConfig,
    options: StreamingOptions
  ): Promise<void> {
    // Create new abort controller for this request
    this.controller = new AbortController();
    this.fullContent = '';

    try {
      const response = await fetch('/api/transform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text, 
          type, 
          stream: true,
          smartControls
        }),
        signal: options.signal || this.controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Request failed');
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data: StreamingResponse = JSON.parse(line.slice(6));
                
                if (data.error) {
                  options.onError(data.error);
                  return;
                }
                
                if (data.content) {
                  this.fullContent += data.content;
                  options.onChunk(data.content);
                }
                
                if (data.done) {
                  options.onComplete(this.fullContent);
                  return;
                }
              } catch (parseError) {
                console.warn('Failed to parse streaming data:', line);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          // Request was cancelled - don't treat as error
          return;
        }
        options.onError(error.message);
      } else {
        options.onError('Unknown error occurred');
      }
    }
  }

  abort(): void {
    if (this.controller) {
      this.controller.abort();
      this.controller = null;
    }
  }

  getFullContent(): string {
    return this.fullContent;
  }
}

// Hook for React components
import { useCallback, useRef, useState } from 'react';

export interface UseStreamingTransformResult {
  transform: (text: string, type: 'markdown' | 'brief' | 'gdocs', smartControls: SmartControlsConfig) => Promise<void>;
  abort: () => void;
  isStreaming: boolean;
  content: string;
  error: string | null;
  fullContent: string;
}

export function useStreamingTransform(): UseStreamingTransformResult {
  const [isStreaming, setIsStreaming] = useState(false);
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fullContent, setFullContent] = useState('');
  const transformerRef = useRef<StreamingTransformer | null>(null);

  const transform = useCallback(async (text: string, type: 'markdown' | 'brief' | 'gdocs', smartControls: SmartControlsConfig) => {
    // Reset state
    setIsStreaming(true);
    setContent('');
    setError(null);
    setFullContent('');

    // Create new transformer
    transformerRef.current = new StreamingTransformer();

    try {
      await transformerRef.current.transform(text, type, smartControls, {
        onChunk: (chunk) => {
          setContent(prev => prev + chunk);
        },
        onComplete: (full) => {
          setFullContent(full);
          setIsStreaming(false);
        },
        onError: (err) => {
          setError(err);
          setIsStreaming(false);
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsStreaming(false);
    }
  }, []);

  const abort = useCallback(() => {
    if (transformerRef.current) {
      transformerRef.current.abort();
      transformerRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  return {
    transform,
    abort,
    isStreaming,
    content,
    error,
    fullContent
  };
}

// Utility function for non-hook usage
export async function streamTransform(
  text: string,
  type: 'markdown' | 'brief' | 'gdocs',
  smartControls: SmartControlsConfig,
  options: Partial<StreamingOptions> = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    const transformer = new StreamingTransformer();
    
    transformer.transform(text, type, smartControls, {
      onChunk: options.onChunk || (() => {}),
      onComplete: (fullContent) => {
        if (options.onComplete) options.onComplete(fullContent);
        resolve(fullContent);
      },
      onError: (error) => {
        if (options.onError) options.onError(error);
        reject(new Error(error));
      },
      signal: options.signal
    });
  });
}