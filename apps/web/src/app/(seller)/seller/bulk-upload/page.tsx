'use client';

import { useState, useRef } from 'react';
import {
  Upload,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Info,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type ImportStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'failed';

interface ImportResult {
  totalRows: number;
  processedRows: number;
  errorRows: number;
  errors: { row: number; message: string }[];
}

const sampleHistory = [
  { id: '1', fileName: 'trucks_jan2024.csv', status: 'COMPLETED', totalRows: 50, processedRows: 48, errorRows: 2, createdAt: '2024-01-15' },
  { id: '2', fileName: 'new_arrivals.csv', status: 'COMPLETED', totalRows: 25, processedRows: 25, errorRows: 0, createdAt: '2024-01-10' },
  { id: '3', fileName: 'inventory_update.csv', status: 'FAILED', totalRows: 100, processedRows: 0, errorRows: 100, createdAt: '2024-01-05' },
];

const requiredColumns = [
  { name: 'title', description: 'Listing title', example: 'Mercedes-Benz Actros 2545 LS' },
  { name: 'category', description: 'Category slug', example: 'trucks' },
  { name: 'brand', description: 'Brand name', example: 'Mercedes-Benz' },
  { name: 'model', description: 'Model name', example: 'Actros' },
  { name: 'price', description: 'Price in EUR', example: '89500' },
  { name: 'condition', description: 'NEW, USED, or REFURBISHED', example: 'USED' },
  { name: 'year', description: 'Manufacturing year', example: '2022' },
  { name: 'mileage_km', description: 'Mileage in kilometers', example: '185000' },
  { name: 'fuel_type', description: 'DIESEL, PETROL, ELECTRIC, etc.', example: 'DIESEL' },
  { name: 'country', description: '2-letter country code', example: 'NL' },
  { name: 'city', description: 'City name', example: 'Rotterdam' },
  { name: 'description', description: 'Full listing description', example: 'Well-maintained truck...' },
];

export default function BulkUploadPage() {
  const [status, setStatus] = useState<ImportStatus>('idle');
  const [result, setResult] = useState<ImportResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      return;
    }
    setSelectedFile(file);
    setStatus('idle');
    setResult(null);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setStatus('uploading');
    setTimeout(() => {
      setStatus('processing');
      setTimeout(() => {
        setStatus('completed');
        setResult({
          totalRows: 50,
          processedRows: 48,
          errorRows: 2,
          errors: [
            { row: 12, message: 'Missing required field: price' },
            { row: 37, message: 'Invalid country code: XX' },
          ],
        });
      }, 2000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Bulk Upload</h1>
        <p className="text-muted-foreground mt-1">Import multiple listings from a CSV or Excel file</p>
      </div>

      {/* Upload Area */}
      <Card>
        <CardContent className="pt-5">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const file = e.dataTransfer.files[0];
              if (file) handleFileSelect(file);
            }}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragOver ? 'border-primary bg-primary/5' : 'border-border'
            }`}
          >
            <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">
              {selectedFile ? selectedFile.name : 'Drag and drop your file here'}
            </p>
            <p className="text-xs text-muted-foreground mb-3">CSV or XLSX files, max 10MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
            />
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <FileSpreadsheet className="w-4 h-4 mr-1" /> Choose File
              </Button>
              {selectedFile && (
                <Button variant="accent" size="sm" onClick={handleUpload} disabled={status === 'uploading' || status === 'processing'}>
                  {status === 'uploading' && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
                  {status === 'processing' && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
                  {status === 'idle' ? 'Upload & Process' : status === 'uploading' ? 'Uploading...' : status === 'processing' ? 'Processing...' : 'Upload Again'}
                </Button>
              )}
            </div>
          </div>

          {/* Results */}
          {result && (
            <div className="mt-4 p-4 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2 mb-3">
                {result.errorRows === 0 ? (
                  <CheckCircle className="w-5 h-5 text-success" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-accent" />
                )}
                <span className="text-sm font-medium text-foreground">Import Complete</span>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-center p-2 rounded bg-white">
                  <p className="text-lg font-bold text-foreground">{result.totalRows}</p>
                  <p className="text-[10px] text-muted-foreground">Total Rows</p>
                </div>
                <div className="text-center p-2 rounded bg-white">
                  <p className="text-lg font-bold text-success">{result.processedRows}</p>
                  <p className="text-[10px] text-muted-foreground">Imported</p>
                </div>
                <div className="text-center p-2 rounded bg-white">
                  <p className="text-lg font-bold text-destructive">{result.errorRows}</p>
                  <p className="text-[10px] text-muted-foreground">Errors</p>
                </div>
              </div>
              {result.errors.length > 0 && (
                <div className="space-y-1">
                  {result.errors.map((err, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-destructive">
                      <XCircle className="w-3 h-3 shrink-0" />
                      <span>Row {err.row}: {err.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Template Download */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">CSV Template</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              Download our template to get started. Make sure your file matches the required columns below.
            </p>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" /> Download Template
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Column</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Description</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Example</th>
                </tr>
              </thead>
              <tbody>
                {requiredColumns.map((col) => (
                  <tr key={col.name} className="border-b border-border last:border-0">
                    <td className="py-2 px-3 font-mono text-xs text-primary font-medium">{col.name}</td>
                    <td className="py-2 px-3 text-muted-foreground">{col.description}</td>
                    <td className="py-2 px-3 font-mono text-xs text-foreground">{col.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Import History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Import History</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pt-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">File</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Rows</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Success</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Errors</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {sampleHistory.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0">
                  <td className="py-3 px-4 font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-muted-foreground" />
                      {item.fileName}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge className={item.status === 'COMPLETED' ? 'bg-success/10 text-success border-0' : 'bg-destructive/10 text-destructive border-0'}>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">{item.totalRows}</td>
                  <td className="py-3 px-4 text-right text-success">{item.processedRows}</td>
                  <td className="py-3 px-4 text-right text-destructive">{item.errorRows}</td>
                  <td className="py-3 px-4 text-muted-foreground">{item.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
