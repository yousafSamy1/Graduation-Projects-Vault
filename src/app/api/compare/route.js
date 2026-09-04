import { NextResponse } from 'next/server';
import { createPublicSupabaseClient } from '@/lib/supabase';
import { generateEmbedding, extractTextFromPDF } from '@/lib/openai';

function tokenize(text) {
  if (!text) return new Set();
  const cleaned = text
    .toLowerCase()
    .replace(/[^\w\s\u0600-\u06FF]/g, ' ')
    .trim();
  const words = cleaned.split(/\s+/).filter(w => w.length > 1);
  return new Set(words);
}

function calculateTextSimilarity(inputText, project) {
  const inputWords = tokenize(inputText);
  if (inputWords.size === 0) return 0;

  const projectText = [
    project.title_en || '',
    project.title_ar || '',
    project.abstract_en || '',
    project.abstract_ar || '',
    (project.keywords || []).join(' '),
    project.department || '',
    project.supervisor || '',
  ].join(' ');

  const projectWords = tokenize(projectText);
  if (projectWords.size === 0) return 0;

  let matchCount = 0;
  for (const word of inputWords) {
    if (projectWords.has(word)) {
      matchCount += 1.0;
    } else {
      // Partial / Root substring matching for Arabic & English
      for (const pWord of projectWords) {
        if ((pWord.length > 2 && word.length > 2) && (pWord.includes(word) || word.includes(pWord))) {
          matchCount += 0.6;
          break;
        }
      }
    }
  }

  const ratio = matchCount / Math.max(inputWords.size, 1);
  return Math.min(Math.round(ratio * 100) / 100, 0.98);
}

export async function POST(request) {
  try {
    let text = '';
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file');
      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      text = await extractTextFromPDF(buffer);
    } else {
      const body = await request.json();
      text = body.text;
    }

    if (!text || text.trim().length < 3) {
      return NextResponse.json({ error: 'Text is too short for comparison' }, { status: 400 });
    }

    const truncatedText = text.substring(0, 8000);
    const supabase = createPublicSupabaseClient();
    let results = [];

    // Attempt 1: AI Vector Similarity Embedding Search
    try {
      const embedding = await generateEmbedding(truncatedText);
      const { data, error } = await supabase.rpc('match_projects', {
        query_embedding: embedding,
        match_threshold: 0.15,
        match_count: 10,
      });

      if (!error && data && data.length > 0) {
        results = data;
      }
    } catch (aiError) {
      console.warn('AI Vector Search skipped (out of credits or network issue). Using Keyword Text Search fallback:', aiError.message);
    }

    // Attempt 2: Keyword & Semantic Text Match Fallback
    if (results.length === 0) {
      const { data: allProjects, error: fetchErr } = await supabase
        .from('projects')
        .select('*');

      if (!fetchErr && allProjects && allProjects.length > 0) {
        results = allProjects
          .map((proj) => {
            const similarity = calculateTextSimilarity(truncatedText, proj);
            return { ...proj, similarity };
          })
          .filter((p) => p.similarity > 0.02)
          .sort((a, b) => b.similarity - a.similarity)
          .slice(0, 10);
      }
    }

    return NextResponse.json({
      results: results || [],
      inputLength: truncatedText.length,
    });
  } catch (err) {
    console.error('Compare API error:', err);
    return NextResponse.json({ error: 'Comparison error: ' + (err.message || 'Unknown error') }, { status: 500 });
  }
}
