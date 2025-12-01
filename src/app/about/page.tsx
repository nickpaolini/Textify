'use client';

import { Zap, Sparkles, FileText, Download, Clock } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function AboutPage() {
  const features = [
    {
      icon: <Zap className="h-5 w-5" />,
      title: 'AI-Powered Transformation',
      description:
        "Leverage OpenAI's GPT-4o model to intelligently transform your text into multiple formats.",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: 'Multiple Output Formats',
      description:
        'Convert text to Markdown, Corporate Brief, or Google Docs HTML with specialized prompts.',
    },
    {
      icon: <Download className="h-5 w-5" />,
      title: 'Easy Export',
      description:
        'Copy transformed text directly to your clipboard with one click, including HTML formatting.',
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: 'Real-time Processing',
      description:
        'Get instant results with loading states and error handling for a smooth experience.',
    },
  ];

  return (
    <section className="w-full max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">About Textify</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A modern AI-powered text transformation tool that helps you convert
          and format your content for different use cases with intelligent
          preprocessing and multiple output formats.
        </p>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm leading-relaxed">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            How It Works
          </CardTitle>
          <CardDescription>
            Textify uses advanced AI to understand context and apply specialized
            formatting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-semibold">
                1
              </div>
              <h3 className="font-medium">Input Your Text</h3>
              <p className="text-muted-foreground">
                Paste or type your content into the text area
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-semibold">
                2
              </div>
              <h3 className="font-medium">Choose Format</h3>
              <p className="text-muted-foreground">
                Select from Markdown, Corporate Brief, or Google Docs
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-semibold">
                3
              </div>
              <h3 className="font-medium">Get Results</h3>
              <p className="text-muted-foreground">
                AI transforms your text and you can copy the result
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>Built with ❤️ for content creators, writers, and professionals</p>
      </div>
    </section>
  );
}
