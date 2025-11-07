import { supabase } from '@/integrations/supabase/client';
import Papa from 'papaparse';

export async function importCSVToLocations() {
  // Parse CSVs in the browser and send structured rows to the Edge Function
  const baseUrl = window.location.origin;

  const sources = [
    { path: '/processed/final_locations.csv', source: 'final_locations' },
  ] as const;

  const rowsBySource: Record<string, any[]> = {};
  let fetchErrors = 0;

  await Promise.all(
    sources.map(async ({ path, source }) => {
      try {
        const res = await fetch(`${baseUrl}${path}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
        if (parsed.errors && parsed.errors.length > 0) {
          console.error(`CSV parse errors for ${source}:`, parsed.errors.slice(0, 3));
          fetchErrors++;
          return;
        }
        rowsBySource[source] = (parsed.data as any[]).filter((r) => Object.keys(r).length > 0);
      } catch (e) {
        console.error(`Failed to load ${path}:`, e);
        fetchErrors++;
      }
    })
  );

  try {
    const { data, error } = await supabase.functions.invoke('import-csv-data', {
      body: { baseUrl, rowsBySource, includeNYCOpenData: false },
    });

    if (error) {
      console.error('Edge import error:', error);
      return { success: false, totalImported: 0, totalErrors: fetchErrors + 1 };
    }

    const result = (data as any) || {};
    return {
      success: Boolean(result.success),
      totalImported: Number(result.totalImported ?? 0),
      totalErrors: Number(result.totalErrors ?? 0) + fetchErrors,
    };
  } catch (e) {
    console.error('Import failed:', e);
    return { success: false, totalImported: 0, totalErrors: fetchErrors + 1 };
  }
}
