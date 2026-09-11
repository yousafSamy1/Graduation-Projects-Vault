import { NextResponse } from 'next/server';
import { createPublicSupabaseClient } from '@/lib/supabase';
import { DEPARTMENTS } from '@/lib/search';

// Columns safe for display — never return the heavy embedding vector
const DISPLAY_COLUMNS =
  'id,project_code,title_en,title_ar,abstract_en,abstract_ar,year,department,students,students_details,supervisor,ta,keywords,pdf_url,drive_url,image_url,rating,created_at';

function normalizeDepartment(val) {
  if (!val) return '';
  const trimmed = val.trim();
  const match = DEPARTMENTS.find(
    (d) => d.value.toLowerCase() === trimmed.toLowerCase() || d.label.toLowerCase() === trimmed.toLowerCase()
  );
  return match ? match.value : trimmed;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const rawDept = searchParams.get('department') || searchParams.get('dept') || '';
    const department = normalizeDepartment(rawDept);
    const year = searchParams.get('year') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '12');

    const supabase = createPublicSupabaseClient();

    let dbQuery = supabase
      .from('projects')
      .select(DISPLAY_COLUMNS, { count: 'exact' });

    // Apply text search across title, abstract, supervisor, project_code, and TA
    if (query.trim()) {
      dbQuery = dbQuery.or(
        `title_en.ilike.%${query}%,title_ar.ilike.%${query}%,abstract_en.ilike.%${query}%,abstract_ar.ilike.%${query}%,supervisor.ilike.%${query}%,project_code.ilike.%${query}%,ta.ilike.%${query}%`
      );
    }

    // Apply filters
    if (department) {
      dbQuery = dbQuery.eq('department', department);
    }
    if (year) {
      dbQuery = dbQuery.eq('year', parseInt(year));
    }

    // Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    dbQuery = dbQuery.range(from, to);

    // Order
    dbQuery = dbQuery.order('year', { ascending: false });
    dbQuery = dbQuery.order('created_at', { ascending: false });

    const { data, error, count } = await dbQuery;

    if (error) {
      console.error('Search error:', error);
      return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }

    const response = NextResponse.json({
      projects: data || [],
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    });

    // Cache search results — short TTL so updates appear quickly, stale-while-revalidate keeps it snappy
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    return response;
  } catch (err) {
    console.error('Search API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
