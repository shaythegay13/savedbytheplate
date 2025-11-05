import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { importCSVToLocations } from '@/services/csvImportService';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function CSVImportButton() {
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    totalImported: number;
    totalErrors: number;
  } | null>(null);

  const handleImport = async () => {
    if (!confirm('This will import all CSV data into the Supabase locations table. This may take a few minutes. Continue?')) {
      return;
    }

    setIsImporting(true);
    setImportResult(null);
    
    try {
      const result = await importCSVToLocations();
      setImportResult(result);
      
      if (result.success) {
        toast.success(`Successfully imported ${result.totalImported} locations!`);
      } else {
        toast.error(`Import completed with ${result.totalErrors} errors`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to import CSV data');
      console.error('Import error:', error);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleImport}
        disabled={isImporting}
        className="bg-sbtp-green-600 hover:bg-sbtp-green-700"
      >
        <Upload className="h-4 w-4 mr-2" />
        {isImporting ? 'Importing CSV Data...' : 'Import All CSV Data to Supabase'}
      </Button>

      {importResult && (
        <Alert variant={importResult.success ? 'default' : 'destructive'}>
          {importResult.success ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>
            Import completed: {importResult.totalImported} locations imported
            {importResult.totalErrors > 0 && `, ${importResult.totalErrors} errors`}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
