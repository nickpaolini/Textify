"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Upload, File, X, AlertCircle, CheckCircle } from "lucide-react";
import clsx from "clsx";
import { 
  extractTextFromFile, 
  FileProcessingResult, 
  formatFileSize, 
  getFileTypeLabel,
  validateFile
} from "@/lib/fileUtils";

interface FileUploadProps {
  onFileProcessed: (result: FileProcessingResult) => void;
  disabled?: boolean;
  className?: string;
}

interface ProcessingFile {
  file: File;
  status: 'processing' | 'success' | 'error';
  result?: FileProcessingResult;
}

export default function FileUpload({ onFileProcessed, disabled = false, className }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [processingFiles, setProcessingFiles] = useState<ProcessingFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    const processingFile: ProcessingFile = {
      file,
      status: 'processing'
    };

    setProcessingFiles(prev => [...prev, processingFile]);

    try {
      const result = await extractTextFromFile(file);
      
      setProcessingFiles(prev => 
        prev.map(pf => 
          pf.file === file 
            ? { ...pf, status: result.success ? 'success' : 'error', result }
            : pf
        )
      );

      if (result.success) {
        onFileProcessed(result);
        // Auto-remove successful files after 3 seconds
        setTimeout(() => {
          setProcessingFiles(prev => prev.filter(pf => pf.file !== file));
        }, 3000);
      }
    } catch (error) {
      setProcessingFiles(prev => 
        prev.map(pf => 
          pf.file === file 
            ? { 
                ...pf, 
                status: 'error', 
                result: {
                  text: '',
                  filename: file.name,
                  fileType: file.type,
                  success: false,
                  error: 'Failed to process file'
                }
              }
            : pf
        )
      );
    }
  }, [onFileProcessed]);

  const handleFiles = useCallback((files: FileList | File[]) => {
    if (disabled) return;

    const fileArray = Array.from(files);
    fileArray.forEach(processFile);
  }, [processFile, disabled]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles, disabled]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFiles]);

  const handleBrowseClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  const removeProcessingFile = useCallback((file: File) => {
    setProcessingFiles(prev => prev.filter(pf => pf.file !== file));
  }, []);

  return (
    <div className={clsx("space-y-4", className)}>
      {/* Drag & Drop Zone */}
      <Card
        className={clsx(
          "border-2 border-dashed transition-all duration-200 cursor-pointer",
          {
            "border-primary bg-primary/5": isDragOver && !disabled,
            "border-muted-foreground/25": !isDragOver && !disabled,
            "border-muted-foreground/10 opacity-50 cursor-not-allowed": disabled,
            "hover:border-primary hover:bg-primary/5": !disabled && !isDragOver
          }
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <div className="p-8 text-center space-y-4">
          <div className={clsx(
            "mx-auto w-12 h-12 rounded-full flex items-center justify-center",
            isDragOver && !disabled ? "bg-primary/20" : "bg-muted"
          )}>
            <Upload className={clsx(
              "h-6 w-6",
              isDragOver && !disabled ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">
              {isDragOver ? "Drop your files here" : "Upload a file"}
            </h3>
            <p className="text-sm text-muted-foreground">
              Drag & drop or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supports: .txt, .md files (PDF & Word coming soon)
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="pointer-events-none"
            disabled={disabled}
          >
            Choose File
          </Button>
        </div>
      </Card>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileInputChange}
        accept=".txt,.md,.pdf,.doc,.docx"
        disabled={disabled}
      />

      {/* Processing Files List */}
      {processingFiles.length > 0 && (
        <div className="space-y-2">
          {processingFiles.map((pf, index) => (
            <Card key={`${pf.file.name}-${index}`} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={clsx(
                    "p-1.5 rounded",
                    {
                      "bg-blue-100 text-blue-600": pf.status === 'processing',
                      "bg-green-100 text-green-600": pf.status === 'success',
                      "bg-red-100 text-red-600": pf.status === 'error'
                    }
                  )}>
                    {pf.status === 'processing' && <File className="h-4 w-4 animate-pulse" />}
                    {pf.status === 'success' && <CheckCircle className="h-4 w-4" />}
                    {pf.status === 'error' && <AlertCircle className="h-4 w-4" />}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">
                        {pf.file.name}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(pf.file.size)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {getFileTypeLabel(pf.file)}
                      </span>
                    </div>
                    
                    {pf.status === 'processing' && (
                      <p className="text-xs text-muted-foreground">Processing...</p>
                    )}
                    
                    {pf.status === 'success' && (
                      <p className="text-xs text-green-600">
                        ✓ Text extracted successfully
                      </p>
                    )}
                    
                    {pf.status === 'error' && pf.result?.error && (
                      <p className="text-xs text-red-600">
                        {pf.result.error}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeProcessingFile(pf.file);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}