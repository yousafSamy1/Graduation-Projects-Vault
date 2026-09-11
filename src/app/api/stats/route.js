import { NextResponse } from 'next/server';
import { createPublicSupabaseClient } from '@/lib/supabase';

const DISPLAY_COLUMNS =
  'id,project_code,title_en,title_ar,abstract_en,abstract_ar,year,department,students,students_details,supervisor,ta,keywords,pdf_url,drive_url,image_url,rating,created_at';

export async function GET() {
  try {
    const supabase = createPublicSupabaseClient();

    // Run all queries in parallel for speed
    // Use targeted column selects to avoid pulling the large embedding vector
    const [countResult, featuredResult, distinctResult] = await Promise.all([
      // Total count only — head:true means zero data transfer, just the count
      supabase.from('projects').select('id', { count: 'exact', head: true }),

      // 6 most recent projects for the featured section
      supabase
        .from('projects')
        .select(DISPLAY_COLUMNS)
        .order('created_at', { ascending: false })
        .limit(6),

      // Get distinct years + supervisor counts via minimal column selects
      supabase.from('projects').select('year,supervisor'),
    ]);

    const totalCount = countResult.count || 0;

    const allRows = distinctResult.data || [];
    const uniqueYears = new Set(allRows.map((d) => d.year).filter(Boolean)).size;
    const uniqueSupervisors = new Set(allRows.map((d) => d.supervisor).filter(Boolean)).size;

    const response = NextResponse.json({
      stats: {
        total: totalCount,
        departments: 4,
        years: uniqueYears,
        supervisors: uniqueSupervisors,
      },
      featured: featuredResult.data || [],
    });

    // Cache stats for 3 minutes, stale-while-revalidate for 10 minutes
    response.headers.set('Cache-Control', 'public, s-maxage=180, stale-while-revalidate=600');
    return response;
  } catch (err) {
    console.error('Stats API error:', err);
    return NextResponse.json({
      stats: { total: 0, departments: 4, years: 0, supervisors: 0 },
      featured: [],
    });
  }
}
