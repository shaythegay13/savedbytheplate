import { supabase } from '@/integrations/supabase/client';

export async function importCSVToLocations() {
  // Invoke Edge Function using service role (bypasses RLS) and fetches public CSVs
  const baseUrl = window.location.origin;
  try {
    const { data, error } = await supabase.functions.invoke('import-csv-data', {
      body: { baseUrl },
    });

    if (error) {
      console.error('Edge import error:', error);
      return { success: false, totalImported: 0, totalErrors: 1 };
    }

    const result = (data as any) || {};
    return {
      success: Boolean(result.success),
      totalImported: Number(result.totalImported ?? 0),
      totalErrors: Number(result.totalErrors ?? 0),
    };
  } catch (e) {
    console.error('Import failed:', e);
    return { success: false, totalImported: 0, totalErrors: 1 };
  }
}
