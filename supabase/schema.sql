-- ============================================
-- Graduation Projects Library - Database Schema
-- ============================================

-- Enable pgvector extension for AI similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- Projects Table
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title_ar TEXT,                          -- العنوان بالعربي
    title_en TEXT,                          -- العنوان بالإنجليزي
    abstract_ar TEXT,                       -- الملخص بالعربي
    abstract_en TEXT,                       -- الملخص بالإنجليزي
    year INTEGER NOT NULL,                  -- سنة التخرج
    department TEXT NOT NULL                -- القسم
        CHECK (department IN ('MIS', 'BA', 'Fintech', 'Marketing Intelligence')),
    students TEXT[] DEFAULT '{}',           -- أسماء الطلاب
    supervisor TEXT,                        -- اسم المشرف
    keywords TEXT[] DEFAULT '{}',           -- كلمات مفتاحية
    pdf_url TEXT,                           -- رابط ملف PDF في Supabase Storage
    rating DECIMAL(2,1) DEFAULT 0           -- تقييم (0-5)
        CHECK (rating >= 0 AND rating <= 5),
    embedding VECTOR(1536),                 -- OpenAI text-embedding-3-small vector
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Indexes
-- ============================================

-- Full-Text Search Index (Arabic + English)
CREATE INDEX idx_projects_fts_ar ON projects 
    USING GIN (to_tsvector('simple', coalesce(title_ar, '') || ' ' || coalesce(abstract_ar, '')));

CREATE INDEX idx_projects_fts_en ON projects 
    USING GIN (to_tsvector('english', coalesce(title_en, '') || ' ' || coalesce(abstract_en, '')));

-- Vector Similarity Search Index
CREATE INDEX idx_projects_embedding ON projects 
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);

-- Department filter index
CREATE INDEX idx_projects_department ON projects (department);

-- Year filter index
CREATE INDEX idx_projects_year ON projects (year);

-- ============================================
-- Functions
-- ============================================

-- Function to search projects by vector similarity
CREATE OR REPLACE FUNCTION match_projects(
    query_embedding VECTOR(1536),
    match_threshold FLOAT DEFAULT 0.3,
    match_count INT DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    title_ar TEXT,
    title_en TEXT,
    abstract_ar TEXT,
    abstract_en TEXT,
    year INTEGER,
    department TEXT,
    students TEXT[],
    supervisor TEXT,
    keywords TEXT[],
    pdf_url TEXT,
    rating DECIMAL,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.title_ar,
        p.title_en,
        p.abstract_ar,
        p.abstract_en,
        p.year,
        p.department,
        p.students,
        p.supervisor,
        p.keywords,
        p.pdf_url,
        p.rating,
        1 - (p.embedding <=> query_embedding) AS similarity
    FROM projects p
    WHERE 1 - (p.embedding <=> query_embedding) > match_threshold
    ORDER BY p.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER trigger_update_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================
-- Row Level Security (RLS)
-- ============================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Everyone can read projects
CREATE POLICY "Public read access" ON projects
    FOR SELECT USING (true);

-- Only authenticated admins can insert/update/delete
CREATE POLICY "Admin insert access" ON projects
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin update access" ON projects
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete access" ON projects
    FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- Storage Bucket for PDFs
-- ============================================
-- Run this in Supabase Dashboard > Storage:
-- Create a bucket called 'project-pdfs' with public access

-- Storage policy for public read
-- CREATE POLICY "Public read PDFs" ON storage.objects
--     FOR SELECT USING (bucket_id = 'project-pdfs');

-- Storage policy for authenticated upload
-- CREATE POLICY "Admin upload PDFs" ON storage.objects
--     FOR INSERT WITH CHECK (bucket_id = 'project-pdfs' AND auth.role() = 'authenticated');
