import Papa from 'papaparse';
import { supabase } from '@/integrations/supabase/client';

export async function importCSVToLocations() {
  // Parse CSVs in the browser and send structured rows to the Edge Function
  const baseUrl = window.location.origin;

  const sources = [
    { path: '/processed/complete_comprehensive_food_access.csv', source: 'comprehensive_food_access' },
    { path: '/processed/food_banks.csv', source: 'food_banks' },
    { path: '/processed/farmers_markets.csv', source: 'farmers_markets' },
    { path: '/processed/community_fridges.csv', source: 'community_fridges' },
    { path: '/processed/nyc_food_access_data_CLEANED.csv', source: 'nyc_food_access_cleaned' },
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
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      return { success: false, totalImported: 0, totalErrors: fetchErrors + 1 };
    }

    const { data, error } = await supabase.functions.invoke('import-csv-data', {
      body: { baseUrl, rowsBySource, includeNYCOpenData: true },
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
