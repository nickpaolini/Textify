'use client';

import clsx from 'clsx';
import {
  Copy,
  Trash2,
  Heart,
  HeartOff,
  Search,
  Clock,
  FileText,
  X,
  Download,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { exportByType, sanitizeFilename } from '@/lib/export';
import {
  type TransformationHistory,
  getTransformationHistory,
  deleteTransformation,
  toggleFavorite,
  getTransformationTypeLabel,
  formatDate,
} from '@/lib/history';

export default function HistoryPage() {
  const [history, setHistory] = useState<TransformationHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    setHistory(getTransformationHistory());
  };

  const handleDelete = (id: string) => {
    deleteTransformation(id);
    loadHistory();
  };

  const handleToggleFavorite = (id: string) => {
    toggleFavorite(id);
    loadHistory();
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleExport = (item: TransformationHistory) => {
    const filename = item.title
      ? sanitizeFilename(item.title)
      : `textify-${item.transformationType}-${formatDate(item.timestamp).replace(/[/:,\s]/g, '-')}`;

    exportByType(item.outputText, item.transformationType, { filename });
  };

  const handleBulkExport = () => {
    const selectedHistoryItems = history.filter((item) =>
      selectedItems.has(item.id)
    );

    selectedHistoryItems.forEach((item, index) => {
      // Add slight delay between downloads to avoid browser blocking
      setTimeout(() => {
        handleExport(item);
      }, index * 100);
    });

    setSelectedItems(new Set());
    setShowBulkActions(false);
  };

  const handleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === filteredHistory.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredHistory.map((item) => item.id)));
    }
  };

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.inputText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.outputText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.title &&
        item.title.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType =
      filterType === 'all' || item.transformationType === filterType;
    const matchesFavorites = !showFavoritesOnly || item.isFavorite;

    return matchesSearch && matchesType && matchesFavorites;
  });

  return (
    <section className="w-full max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Transformation History
        </h1>
        <p className="text-lg text-muted-foreground">
          Browse and manage your saved text transformations
        </p>
      </div>

      {/* Search and Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Textarea
                placeholder="Search transformations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                rows={2}
                className="resize-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <select
                className="border rounded px-3 py-2 bg-background text-foreground"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="markdown">Markdown</option>
                <option value="brief">Corporate Brief</option>
                <option value="gdocs">Google Docs</option>
              </select>
              <Button
                variant={showFavoritesOnly ? 'default' : 'outline'}
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className="flex items-center gap-2"
              >
                <Heart
                  className={clsx(
                    'h-4 w-4',
                    showFavoritesOnly && 'fill-current'
                  )}
                />
                Favorites Only
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredHistory.length === 0
            ? 'No transformations found'
            : `${filteredHistory.length} transformation${filteredHistory.length !== 1 ? 's' : ''} found`}
        </p>
        {(searchTerm || filterType !== 'all' || showFavoritesOnly) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
              setShowFavoritesOnly(false);
            }}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Bulk Actions */}
      {filteredHistory.length > 0 && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {showBulkActions ? 'Hide' : 'Show'} Bulk Actions
                </Button>
                {showBulkActions && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAll}
                      className="flex items-center gap-2"
                    >
                      {selectedItems.size === filteredHistory.length
                        ? 'Deselect All'
                        : 'Select All'}
                    </Button>
                    {selectedItems.size > 0 && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleBulkExport}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Export Selected ({selectedItems.size})
                      </Button>
                    )}
                  </>
                )}
              </div>
              {selectedItems.size > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedItems(new Set())}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear Selection
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* History Items */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No transformations found
              </h3>
              <p className="text-muted-foreground mb-4">
                {history.length === 0
                  ? 'Start creating transformations to see them here!'
                  : 'Try adjusting your search or filter criteria.'}
              </p>
              {history.length === 0 && (
                <Button asChild>
                  <Link href="/">Create Your First Transformation</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredHistory.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  {showBulkActions && (
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="mt-1 mr-3 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  )}
                  <div className="flex items-start justify-between flex-1">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {getTransformationTypeLabel(item.transformationType)}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDate(item.timestamp)}
                        </div>
                      </div>
                      {item.title && (
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleFavorite(item.id)}
                        className="shrink-0"
                      >
                        {item.isFavorite ? (
                          <Heart className="h-4 w-4 fill-current text-red-500" />
                        ) : (
                          <HeartOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopy(item.outputText, item.id)}
                        className="shrink-0"
                      >
                        <Copy
                          className={clsx(
                            'h-4 w-4',
                            copied === item.id
                              ? 'text-green-500'
                              : 'text-muted-foreground'
                          )}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleExport(item)}
                        className="shrink-0"
                        title="Export file"
                      >
                        <Download className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                        className="shrink-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2 text-sm">Input</h4>
                    <ScrollArea className="h-32 w-full bg-muted rounded">
                      <div className="p-3">
                        <p className="text-sm whitespace-pre-wrap">
                          {item.inputText.length > 200
                            ? `${item.inputText.slice(0, 200)}...`
                            : item.inputText}
                        </p>
                      </div>
                    </ScrollArea>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-sm">Output</h4>
                    <ScrollArea className="h-32 w-full bg-muted rounded">
                      <div className="p-3">
                        {item.transformationType === 'gdocs' ? (
                          <div
                            className="prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{
                              __html:
                                item.outputText.length > 200
                                  ? `${item.outputText.slice(0, 200)}...`
                                  : item.outputText,
                            }}
                          />
                        ) : (
                          <pre className="text-sm whitespace-pre-wrap">
                            {item.outputText.length > 200
                              ? `${item.outputText.slice(0, 200)}...`
                              : item.outputText}
                          </pre>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </section>
  );
}
