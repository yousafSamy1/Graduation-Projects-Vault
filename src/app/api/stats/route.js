import { NextResponse } from 'next/server';
import { createPublicSupabaseClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createPublicSupabaseClient();

    // Get total count
    const { count: total } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });

    // Get unique years
    const { data: yearData } = await supabase
      .from('projects')
      .select('year')
      .order('year', { ascending: false });

    const uniqueYears = yearData ? [...new Set(yearData.map((d) => d.year))].length : 0;

    // Get unique supervisors
    const { data: supData } = await supabase
      .from('projects')
      .select('supervisor')
      .not('supervisor', 'is', null);

    const uniqueSupervisors = supData ? [...new Set(supData.map((d) => d.supervisor).filter(Boolean))].length : 0;

    // Get featured (latest) projects
    const { data: featured } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6);

    return NextResponse.json({
      stats: {
        total: total || 0,
        departments: 4,
        years: uniqueYears,
        supervisors: uniqueSupervisors,
      },
      featured: featured || [],
    });
  } catch (err) {
    console.error('Stats API error:', err);
    return NextResponse.json({
      stats: { total: 0, departments: 4, years: 0, supervisors: 0 },
      featured: [],
    });
  }
}
