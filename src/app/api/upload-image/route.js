import { NextResponse } from 'next/server';
import { createServerSupabaseClient, createPublicSupabaseClient } from '@/lib/supabase';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only image files (JPEG, PNG, WebP, GIF, SVG) are allowed' }, { status: 400 });
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image size exceeds 10MB limit' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `img-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    let supabase = createServerSupabaseClient();
    let imageUrl = null;

    // 1. Try uploading to 'project-images' bucket
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(fileName, buffer, {
          contentType: file.type,
          cacheControl: '86400',
          upsert: true,
        });

      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage
          .from('project-images')
          .getPublicUrl(fileName);
        imageUrl = urlData?.publicUrl || null;
      } else if (uploadError) {
        // Try creating the bucket if it didn't exist
        try {
          await supabase.storage.createBucket('project-images', { public: true });
          const retry = await supabase.storage
            .from('project-images')
            .upload(fileName, buffer, { contentType: file.type, upsert: true });
          if (!retry.error) {
            const { data: urlData } = supabase.storage
              .from('project-images')
              .getPublicUrl(fileName);
            imageUrl = urlData?.publicUrl || null;
          }
        } catch (bErr) {
          console.warn('Bucket create attempt error:', bErr.message);
        }
      }
    } catch (sErr) {
      console.warn('Storage project-images failed:', sErr.message);
    }

    // 2. Fallback: Try uploading to 'project-pdfs' bucket
    if (!imageUrl) {
      try {
        const { data: pdfBucketData, error: pdfBucketErr } = await supabase.storage
          .from('project-pdfs')
          .upload(`images/${fileName}`, buffer, {
            contentType: file.type,
            cacheControl: '86400',
            upsert: true,
          });

        if (!pdfBucketErr && pdfBucketData) {
          const { data: urlData } = supabase.storage
            .from('project-pdfs')
            .getPublicUrl(`images/${fileName}`);
          imageUrl = urlData?.publicUrl || null;
        }
      } catch (fErr) {
        console.warn('Fallback to project-pdfs bucket failed:', fErr.message);
      }
    }

    // 3. Fallback: Base64 Data URL (for files under 3MB)
    if (!imageUrl && buffer.length <= 3.5 * 1024 * 1024) {
      const base64 = buffer.toString('base64');
      imageUrl = `data:${file.type};base64,${base64}`;
    }

    if (!imageUrl) {
      return NextResponse.json({
        error: 'Failed to store image in Supabase storage and file is too large for data URL fallback.',
      }, { status: 500 });
    }

    return NextResponse.json({
      image_url: imageUrl,
      fileName,
    });
  } catch (err) {
    console.error('Upload image error:', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
