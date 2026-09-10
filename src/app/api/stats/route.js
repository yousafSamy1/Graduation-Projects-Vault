import { NextResponse } from 'next/server';
import { createPublicSupabaseClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createPublicSupabaseClient();

    // Run all queries in parallel for speed
    const [countResult, yearResult, supResult, featuredResult] = await Promise.all([
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('year').order('year', { ascending: false }),
      supabase.from('projects').select('supervisor').not('supervisor', 'is', null),
      supabase.from('projects')
        .select('id,project_code,title_en,title_ar,abstract_en,abstract_ar,year,department,students,students_details,supervisor,ta,keywords,pdf_url,drive_url,image_url,rating,created_at')
        .order('created_at', { ascending: false })
        .limit(6),
    ]);

    const uniqueYears = yearResult.data ? [...new Set(yearResult.data.map((d) => d.year))].length : 0;
    const uniqueSupervisors = supResult.data ? [...new Set(supResult.data.map((d) => d.supervisor).filter(Boolean))].length : 0;

    const response = NextResponse.json({
      stats: {
        total: countResult.count || 0,
        departments: 4,
        years: uniqueYears,
        supervisors: uniqueSupervisors,
      },
      featured: featuredResult.data || [],
    });

    // Cache stats for 2 minutes
    response.headers.set('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=300');
    return response;
  } catch (err) {
    console.error('Stats API error:', err);
    return NextResponse.json({
      stats: { total: 0, departments: 4, years: 0, supervisors: 0 },
      featured: [],
    });
  }
}
