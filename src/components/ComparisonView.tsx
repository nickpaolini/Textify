'use client';

import clsx from 'clsx';
import { ArrowLeftRight, Copy, FileText, Wand2, X } from 'lucide-react';
import { useState } from 'react';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

interface ComparisonViewProps {
  originalText: string;
  transformedText: string;
  transformType: string;
  isVisible: boolean;
  onClose: () => void;
  onCopy?: (text: string) => void;
  className?: string;
}

export default function ComparisonView({
  originalText,
  transformedText,
  transformType,
  isVisible,
  onClose,
  onCopy,
  className,
}: ComparisonViewProps) {
  const [layout, setLayout] = useState<'side-by-side' | 'stacked'>(
    'side-by-side'
  );

  if (!isVisible) return null;

  const handleCopy = (text: string) => {
    if (onCopy) {
      onCopy(text);
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  const getTransformLabel = (type: string) => {
    switch (type) {
      case 'markdown':
        return 'Markdown';
      case 'brief':
        return 'Corporate Brief';
      case 'gdocs':
        return 'Google Docs';
      default:
        return type;
    }
  };

  return (
    <Card className={clsx('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5" />
            <CardTitle className="text-lg">Before & After Comparison</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {getTransformLabel(transformType)}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setLayout(
                  layout === 'side-by-side' ? 'stacked' : 'side-by-side'
                )
              }
              className="text-xs"
            >
              {layout === 'side-by-side' ? 'Stack' : 'Side by Side'}
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>
          Compare your original text with the AI transformation
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div
          className={clsx(
            'grid gap-4',
            layout === 'side-by-side'
              ? 'grid-cols-1 lg:grid-cols-2'
              : 'grid-cols-1'
          )}
        >
          {/* Original Text */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium text-sm">Original</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(originalText)}
                className="text-xs"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
            </div>
            <ScrollArea className="h-[300px] w-full bg-muted rounded">
              <div className="p-4">
                <pre className="whitespace-pre-wrap text-sm font-sans">
                  {originalText}
                </pre>
              </div>
            </ScrollArea>
            <div className="text-xs text-muted-foreground">
              {originalText.length} characters •{' '}
              {originalText.split(/\s+/).length} words
            </div>
          </div>

          {/* Separator for stacked layout */}
          {layout === 'stacked' && (
            <div className="flex items-center gap-2">
              <Separator className="flex-1" />
              <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
              <Separator className="flex-1" />
            </div>
          )}

          {/* Transformed Text */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-primary" />
                <h3 className="font-medium text-sm">Transformed</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(transformedText)}
                className="text-xs"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
            </div>
            <ScrollArea className="h-[300px] w-full bg-muted rounded">
              <div className="p-4">
                {transformType === 'gdocs' ? (
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: transformedText }}
                  />
                ) : (
                  <pre className="whitespace-pre-wrap text-sm font-sans">
                    {transformedText}
                  </pre>
                )}
              </div>
            </ScrollArea>
            <div className="text-xs text-muted-foreground">
              {transformedText.length} characters •{' '}
              {transformedText.split(/\s+/).length} words
              {transformedText.length !== originalText.length && (
                <span
                  className={clsx(
                    'ml-2',
                    transformedText.length > originalText.length
                      ? 'text-orange-600'
                      : 'text-green-600'
                  )}
                >
                  ({transformedText.length > originalText.length ? '+' : ''}
                  {transformedText.length - originalText.length} chars)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium text-sm mb-3">Quick Insights</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Length Change</div>
              <div
                className={clsx(
                  'font-medium',
                  transformedText.length > originalText.length
                    ? 'text-orange-600'
                    : transformedText.length < originalText.length
                      ? 'text-green-600'
                      : 'text-muted-foreground'
                )}
              >
                {transformedText.length > originalText.length
                  ? 'Expanded'
                  : transformedText.length < originalText.length
                    ? 'Condensed'
                    : 'Same Length'}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Word Count</div>
              <div className="font-medium">
                {originalText.split(/\s+/).length} →{' '}
                {transformedText.split(/\s+/).length}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Transformation</div>
              <div className="font-medium">
                {getTransformLabel(transformType)}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Format</div>
              <div className="font-medium capitalize">{transformType}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
