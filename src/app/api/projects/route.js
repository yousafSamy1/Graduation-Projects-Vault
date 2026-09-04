import { NextResponse } from 'next/server';
import { createServerSupabaseClient, createPublicSupabaseClient } from '@/lib/supabase';
import { generateEmbedding, combineTextForEmbedding } from '@/lib/openai';

// GET - Fetch projects (with optional single project by id)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '12');

    const supabase = createPublicSupabaseClient();

    if (id) {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }

      return NextResponse.json({ project: data });
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from('projects')
      .select('*', { count: 'exact' })
      .order('year', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Fetch projects error:', error);
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }

    return NextResponse.json({
      projects: data || [],
      total: count || 0,
      page,
      pageSize,
    });
  } catch (err) {
    console.error('Projects GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new project (Admin only)
export async function POST(request) {
  try {
    const body = await request.json();

    // Safely attempt embedding generation
    let embedding = null;
    try {
      const combinedText = combineTextForEmbedding(body);
      if (combinedText && combinedText.trim().length > 0) {
        embedding = await generateEmbedding(combinedText);
      }
    } catch (embError) {
      console.warn('Embedding skipped or failed:', embError.message);
    }

    // Auto-extract simple student names list from students_details if needed
    const studentNames = body.students_details && body.students_details.length > 0
      ? body.students_details.map((s) => typeof s === 'string' ? s : s.name).filter(Boolean)
      : (body.students || []);

    const projectData = {
      project_code: body.project_code || null,
      title_en: body.title_en || null,
      title_ar: body.title_ar || null,
      abstract_en: body.abstract_en || null,
      abstract_ar: body.abstract_ar || null,
      year: body.year,
      department: body.department,
      students: studentNames,
      students_details: body.students_details || [],
      supervisor: body.supervisor || null,
      ta: body.ta || null,
      keywords: body.keywords || [],
      pdf_url: body.pdf_url || null,
      rating: body.rating || 0,
      embedding: embedding,
    };

    let supabase = createServerSupabaseClient();
    let { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();

    // Fallback to public client if service key throws an API key error
    if (error && (error.message?.includes('Invalid API key') || error.code === 'PGRST301')) {
      console.warn('Retrying project insert with public client...');
      supabase = createPublicSupabaseClient();
      const res = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();
      data = res.data;
      error = res.error;
    }

    if (error) {
      console.error('Insert project error:', error);
      let errorMessage = error.message || 'Failed to create project';
      if (error.message?.includes('row-level security') || error.code === '42501') {
        errorMessage = 'Supabase Row Level Security (RLS) is enabled. Please run "ALTER TABLE projects DISABLE ROW LEVEL SECURITY;" in Supabase SQL Editor.';
      }
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    return NextResponse.json({ project: data }, { status: 201 });
  } catch (err) {
    console.error('Projects POST error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete a project (Admin only)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    let supabase = createServerSupabaseClient();
    let { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error && (error.message?.includes('Invalid API key') || error.code === 'PGRST301')) {
      supabase = createPublicSupabaseClient();
      const res = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      error = res.error;
    }

    if (error) {
      console.error('Delete project error:', error);
      return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Projects DELETE error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
