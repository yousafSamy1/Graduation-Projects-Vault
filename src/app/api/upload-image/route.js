import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only image files (JPEG, PNG, WebP, GIF) are allowed' }, { status: 400 });
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image size exceeds 5MB limit' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Supabase Storage bucket 'project-images'
    const supabase = createServerSupabaseClient();
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '86400',
        upsert: false,
      });

    if (uploadError) {
      console.error('Image upload error:', uploadError);
      // Fallback: return a placeholder
      return NextResponse.json({
        image_url: null,
        error: uploadError.message,
      }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from('project-images')
      .getPublicUrl(fileName);

    return NextResponse.json({
      image_url: urlData?.publicUrl || null,
      fileName,
    });
  } catch (err) {
    console.error('Upload image error:', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
