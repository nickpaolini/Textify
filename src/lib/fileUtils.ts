export interface FileProcessingResult {
  text: string;
  filename: string;
  fileType: string;
  success: boolean;
  error?: string;
}

export const SUPPORTED_FILE_TYPES = {
  'text/plain': ['.txt'],
  'text/markdown': ['.md'],
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    '.docx',
  ],
  'application/msword': ['.doc'],
} as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function isFileTypeSupported(file: File): boolean {
  const supportedTypes = Object.keys(SUPPORTED_FILE_TYPES);
  return (
    supportedTypes.includes(file.type) ||
    file.name.toLowerCase().endsWith('.txt') ||
    file.name.toLowerCase().endsWith('.md')
  );
}

export function getFileExtension(filename: string): string {
  return filename.toLowerCase().substring(filename.lastIndexOf('.'));
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size too large. Maximum size is ${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB.`,
    };
  }

  // Check file type
  if (!isFileTypeSupported(file)) {
    return {
      valid: false,
      error:
        'Unsupported file type. Supported formats: .txt, .md, .pdf, .docx, .doc',
    };
  }

  return { valid: true };
}

export async function extractTextFromFile(
  file: File
): Promise<FileProcessingResult> {
  const validation = validateFile(file);
  if (!validation.valid) {
    return {
      text: '',
      filename: file.name,
      fileType: file.type,
      success: false,
      error: validation.error,
    };
  }

  try {
    const extension = getFileExtension(file.name);

    switch (extension) {
      case '.txt':
      case '.md':
        return await extractTextFromTextFile(file);
      case '.pdf':
        return await extractTextFromPDF(file);
      case '.docx':
      case '.doc':
        return await extractTextFromWordDocument(file);
      default:
        // Fallback: try to read as text
        return await extractTextFromTextFile(file);
    }
  } catch (error) {
    return {
      text: '',
      filename: file.name,
      fileType: file.type,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

async function extractTextFromTextFile(
  file: File
): Promise<FileProcessingResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve({
        text: text || '',
        filename: file.name,
        fileType: file.type,
        success: true,
      });
    };

    reader.onerror = () => {
      resolve({
        text: '',
        filename: file.name,
        fileType: file.type,
        success: false,
        error: 'Failed to read file',
      });
    };

    reader.readAsText(file);
  });
}

async function extractTextFromPDF(file: File): Promise<FileProcessingResult> {
  // For now, return an error suggesting copy/paste
  // We can implement PDF parsing later with a library like pdf-parse
  return {
    text: '',
    filename: file.name,
    fileType: file.type,
    success: false,
    error: 'PDF support coming soon! Please copy and paste the text for now.',
  };
}

async function extractTextFromWordDocument(
  file: File
): Promise<FileProcessingResult> {
  // For now, return an error suggesting copy/paste
  // We can implement Word document parsing later with a library like mammoth
  return {
    text: '',
    filename: file.name,
    fileType: file.type,
    success: false,
    error:
      'Word document support coming soon! Please copy and paste the text for now.',
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function getFileTypeLabel(file: File): string {
  const extension = getFileExtension(file.name);

  switch (extension) {
    case '.txt':
      return 'Text File';
    case '.md':
      return 'Markdown File';
    case '.pdf':
      return 'PDF Document';
    case '.docx':
      return 'Word Document';
    case '.doc':
      return 'Word Document (Legacy)';
    default:
      return 'Document';
  }
}
