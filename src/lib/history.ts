export interface TransformationHistory {
  id: string;
  inputText: string;
  outputText: string;
  transformationType: 'markdown' | 'brief' | 'gdocs';
  timestamp: number;
  isFavorite?: boolean;
  title?: string;
}

const HISTORY_KEY = 'textify_history';
const MAX_HISTORY_ITEMS = 100;

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function getTransformationHistory(): TransformationHistory[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading transformation history:', error);
    return [];
  }
}

export function saveTransformation(transformation: Omit<TransformationHistory, 'id' | 'timestamp'>): TransformationHistory {
  const newTransformation: TransformationHistory = {
    ...transformation,
    id: generateId(),
    timestamp: Date.now(),
  };

  const history = getTransformationHistory();
  
  // Add to beginning of array (most recent first)
  history.unshift(newTransformation);
  
  // Limit history size
  if (history.length > MAX_HISTORY_ITEMS) {
    history.splice(MAX_HISTORY_ITEMS);
  }
  
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving transformation history:', error);
  }
  
  return newTransformation;
}

export function deleteTransformation(id: string): void {
  const history = getTransformationHistory().filter(item => item.id !== id);
  
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error deleting transformation:', error);
  }
}

export function toggleFavorite(id: string): void {
  const history = getTransformationHistory().map(item => 
    item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
  );
  
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error toggling favorite:', error);
  }
}

export function updateTransformationTitle(id: string, title: string): void {
  const history = getTransformationHistory().map(item => 
    item.id === id ? { ...item, title } : item
  );
  
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error updating transformation title:', error);
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing history:', error);
  }
}

export function getTransformationTypeLabel(type: TransformationHistory['transformationType']): string {
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
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInHours * 60);
    return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    const hours = Math.floor(diffInHours);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24 * 7) {
    const days = Math.floor(diffInHours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
}