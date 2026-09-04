import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { extractTextFromPDF } from '@/lib/openai';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Extract text from PDF
    let text = '';
    try {
      text = await extractTextFromPDF(buffer);
    } catch (err) {
      console.error('PDF parse error:', err);
      return NextResponse.json({ error: 'Failed to parse PDF' }, { status: 400 });
    }

    // Upload to Supabase Storage
    let pdfUrl = null;
    try {
      const supabase = createServerSupabaseClient();
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-pdfs')
        .upload(fileName, buffer, {
          contentType: 'application/pdf',
          cacheControl: '3600',
        });

      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage
          .from('project-pdfs')
          .getPublicUrl(fileName);
        pdfUrl = urlData?.publicUrl || null;
      }
    } catch (storageErr) {
      console.warn('PDF storage upload skipped:', storageErr.message);
    }

    return NextResponse.json({
      text: text.substring(0, 10000), // Limit returned text
      pdf_url: pdfUrl,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (err) {
    console.error('Upload PDF error:', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
