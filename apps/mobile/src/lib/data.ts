import type { GarmentAnalysis, WashRecommendation } from '@naqa/shared';
import { supabase } from './supabase';

export interface MachineRow { id: string; brand: string | null; model: string | null; created_at: string }
export interface AnalysisRow {
  id: string; fabric: string; confidence: number; care_symbols: string[];
  recommendation: WashRecommendation; created_at: string;
}

export const rowToAnalysis = (r: AnalysisRow): GarmentAnalysis => ({
  fabric: r.fabric as GarmentAnalysis['fabric'],
  confidence: r.confidence,
  careSymbolsDetected: r.care_symbols,
  recommendation: r.recommendation,
});

/** Saves an analysis (and its machine, once per model). Best effort: never blocks the user. */
export async function saveAnalysis(a: GarmentAnalysis, machine?: { brand: string | null; model: string | null }) {
  if (!supabase) return;
  try {
    let machineId: string | null = null;
    if (machine?.model) {
      const found = await supabase.from('machines').select('id').eq('model', machine.model).maybeSingle();
      if (found.data) machineId = found.data.id;
      else {
        const created = await supabase.from('machines').insert({ brand: machine.brand, model: machine.model }).select('id').single();
        machineId = created.data?.id ?? null;
      }
    }
    await supabase.from('analyses').insert({
      machine_id: machineId,
      fabric: a.fabric,
      confidence: a.confidence,
      care_symbols: a.careSymbolsDetected,
      recommendation: a.recommendation,
    });
  } catch {
    // Saving is a convenience; the result is already on screen.
  }
}

export async function listMachines(): Promise<MachineRow[]> {
  if (!supabase) return [];
  const { data } = await supabase.from('machines').select('id, brand, model, created_at').order('created_at', { ascending: false });
  return data ?? [];
}

export async function deleteMachine(id: string) {
  await supabase?.from('machines').delete().eq('id', id);
}

export async function listAnalyses(limit = 20): Promise<AnalysisRow[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from('analyses')
    .select('id, fabric, confidence, care_symbols, recommendation, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);
  return (data as AnalysisRow[] | null) ?? [];
}
