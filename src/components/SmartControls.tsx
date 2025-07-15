"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { 
  Settings, 
  Zap, 
  Volume2, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  RotateCcw,
  Wand2
} from "lucide-react";
import clsx from "clsx";

import type { SmartControlsConfig } from "@/lib/streaming";

interface SmartControlsProps {
  config: SmartControlsConfig;
  onChange: (config: SmartControlsConfig) => void;
  disabled?: boolean;
  className?: string;
}

const TONE_LABELS = {
  0: 'Very Formal',
  25: 'Formal',
  50: 'Balanced', 
  75: 'Casual',
  100: 'Very Casual'
};

const LENGTH_OPTIONS = [
  { 
    value: 'brief' as const, 
    label: 'Brief', 
    description: 'Concise and to the point',
    icon: <Zap className="h-4 w-4" />
  },
  { 
    value: 'standard' as const, 
    label: 'Standard', 
    description: 'Balanced length and detail',
    icon: <Volume2 className="h-4 w-4" />
  },
  { 
    value: 'detailed' as const, 
    label: 'Detailed', 
    description: 'Comprehensive and thorough',
    icon: <FileText className="h-4 w-4" />
  },
];

export default function SmartControls({ config, onChange, disabled = false, className }: SmartControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCustomPrompt, setShowCustomPrompt] = useState(config.useCustomPrompt);

  const handleToneChange = (value: number[]) => {
    onChange({ ...config, tone: value[0] });
  };

  const handleLengthChange = (length: SmartControlsConfig['length']) => {
    onChange({ ...config, length });
  };

  const handleCustomPromptChange = (customPrompt: string) => {
    onChange({ ...config, customPrompt });
  };

  const toggleCustomPrompt = () => {
    const useCustomPrompt = !config.useCustomPrompt;
    setShowCustomPrompt(useCustomPrompt);
    onChange({ ...config, useCustomPrompt });
  };

  const resetToDefaults = () => {
    onChange({
      tone: 50,
      length: 'standard',
      customPrompt: '',
      useCustomPrompt: false
    });
    setShowCustomPrompt(false);
  };

  const getToneLabel = (value: number) => {
    // Find closest predefined label
    const closest = Object.keys(TONE_LABELS).reduce((prev, curr) => 
      Math.abs(Number(curr) - value) < Math.abs(Number(prev) - value) ? curr : prev
    );
    return TONE_LABELS[Number(closest) as keyof typeof TONE_LABELS];
  };

  const isNonDefault = config.tone !== 50 || config.length !== 'standard' || config.useCustomPrompt;

  return (
    <Card className={clsx("border-2 transition-all duration-200", {
      "border-primary/20 bg-primary/5": isNonDefault,
      "border-border": !isNonDefault
    }, className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <CardTitle className="text-lg">Smart Controls</CardTitle>
            {isNonDefault && (
              <Badge variant="secondary" className="text-xs">
                Customized
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isNonDefault && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetToDefaults}
                disabled={disabled}
                className="text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              disabled={disabled}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <CardDescription>
          Fine-tune your transformation with advanced controls
        </CardDescription>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Tone Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Tone</label>
              <Badge variant="outline" className="text-xs">
                {getToneLabel(config.tone)}
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="relative">
                <Slider
                  value={[config.tone]}
                  onValueChange={handleToneChange}
                  max={100}
                  min={0}
                  step={5}
                  disabled={disabled}
                  className="w-full"
                />
                {/* Step marks */}
                <div className="absolute top-6 left-0 right-0 flex justify-between pointer-events-none">
                  {[0, 25, 50, 75, 100].map((step) => (
                    <div key={step} className="flex flex-col items-center">
                      <div 
                        className={`w-1 h-2 rounded-full transition-colors ${
                          config.tone >= step ? 'bg-primary' : 'bg-muted-foreground/30'
                        }`} 
                      />
                      <span className="text-xs text-muted-foreground mt-1 font-medium">
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-12">
                <div className="flex flex-col items-start">
                  <span className="font-medium">Very Formal</span>
                  <span className="text-xs opacity-75">Academic</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-medium">Balanced</span>
                  <span className="text-xs opacity-75">Professional</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-medium">Very Casual</span>
                  <span className="text-xs opacity-75">Friendly</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Length Control */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Length</label>
            <div className="grid grid-cols-3 gap-2">
              {LENGTH_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant={config.length === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleLengthChange(option.value)}
                  disabled={disabled}
                  className="flex flex-col gap-1 h-auto py-3"
                >
                  {option.icon}
                  <span className="text-xs font-medium">{option.label}</span>
                </Button>
              ))}
            </div>
            <div className="text-xs text-muted-foreground text-center">
              {LENGTH_OPTIONS.find(opt => opt.value === config.length)?.description}
            </div>
          </div>

          <Separator />

          {/* Custom Prompt */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Custom Instructions</label>
              <Button
                variant={config.useCustomPrompt ? "default" : "outline"}
                size="sm"
                onClick={toggleCustomPrompt}
                disabled={disabled}
                className="text-xs"
              >
                <Wand2 className="h-3 w-3 mr-1" />
                {config.useCustomPrompt ? 'Enabled' : 'Enable'}
              </Button>
            </div>
            
            {showCustomPrompt && (
              <div className="space-y-2">
                <Textarea
                  placeholder="Add custom instructions for the AI transformation..."
                  value={config.customPrompt}
                  onChange={(e) => handleCustomPromptChange(e.target.value)}
                  disabled={disabled}
                  rows={3}
                  className="text-sm"
                />
                <div className="text-xs text-muted-foreground">
                  Example: &quot;Use technical language&quot;, &quot;Include examples&quot;, &quot;Make it sound more confident&quot;
                </div>
              </div>
            )}
          </div>

          {/* Active Settings Summary */}
          {isNonDefault && (
            <>
              <Separator />
              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Active Customizations
                </div>
                <div className="flex flex-wrap gap-2">
                  {config.tone !== 50 && (
                    <Badge variant="secondary" className="text-xs">
                      Tone: {getToneLabel(config.tone)}
                    </Badge>
                  )}
                  {config.length !== 'standard' && (
                    <Badge variant="secondary" className="text-xs">
                      Length: {config.length}
                    </Badge>
                  )}
                  {config.useCustomPrompt && config.customPrompt && (
                    <Badge variant="secondary" className="text-xs">
                      Custom Instructions
                    </Badge>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
}