export interface ExportOptions {
  filename?: string;
  timestamp?: boolean;
}

export type ExportFormat = 'markdown' | 'text' | 'html';

/**
 * Downloads a file with the given content and filename
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates a filename with optional timestamp
 */
function generateFilename(
  baseName: string, 
  extension: string, 
  options: ExportOptions = {}
): string {
  const { filename, timestamp = true } = options;
  
  if (filename) {
    // Ensure the filename has the correct extension
    return filename.endsWith(`.${extension}`) 
      ? filename 
      : `${filename}.${extension}`;
  }
  
  const timestampSuffix = timestamp 
    ? `_${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}`
    : '';
    
  return `${baseName}${timestampSuffix}.${extension}`;
}

/**
 * Export content as Markdown file
 */
export function exportAsMarkdown(
  content: string, 
  options: ExportOptions = {}
): void {
  const filename = generateFilename('textify-markdown', 'md', options);
  downloadFile(content, filename, 'text/markdown');
}

/**
 * Export content as plain text file
 */
export function exportAsText(
  content: string, 
  options: ExportOptions = {}
): void {
  const filename = generateFilename('textify-text', 'txt', options);
  downloadFile(content, filename, 'text/plain');
}

/**
 * Export content as HTML file
 */
export function exportAsHTML(
  content: string, 
  options: ExportOptions = {}
): void {
  // Wrap content in basic HTML structure if it's not already HTML
  const htmlContent = content.includes('<html>') 
    ? content 
    : `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Textify Export</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            color: #333;
        }
        h1, h2, h3, h4, h5, h6 {
            color: #2c3e50;
            margin-top: 2rem;
            margin-bottom: 1rem;
        }
        blockquote {
            border-left: 4px solid #3498db;
            padding-left: 1rem;
            margin: 1rem 0;
            background: #f8f9fa;
        }
        code {
            background: #f1f2f6;
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            font-family: 'Monaco', 'Courier New', monospace;
        }
        ul, ol {
            padding-left: 2rem;
        }
    </style>
</head>
<body>
${content}
</body>
</html>`;
  
  const filename = generateFilename('textify-html', 'html', options);
  downloadFile(htmlContent, filename, 'text/html');
}

/**
 * Export content based on transformation type
 */
export function exportByType(
  content: string,
  transformationType: 'markdown' | 'brief' | 'gdocs',
  options: ExportOptions = {}
): void {
  switch (transformationType) {
    case 'markdown':
      exportAsMarkdown(content, options);
      break;
    case 'brief':
      exportAsText(content, { 
        ...options, 
        filename: options.filename || generateFilename('textify-brief', 'txt', options)
      });
      break;
    case 'gdocs':
      exportAsHTML(content, options);
      break;
    default:
      exportAsText(content, options);
  }
}

/**
 * Sanitize filename for safe file system usage
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^\w\s.-]/g, '') // Remove special characters except words, spaces, dots, dashes
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .trim();
}