import OpenAI from 'openai';

let _openai = null;

function getOpenAI() {
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
    });
  }
  return _openai;
}

/**
 * Generate an embedding vector for the given text using OpenAI's text-embedding-3-small model.
 * Supports both Arabic and English text.
 * @param {string} text - The text to generate an embedding for
 * @returns {Promise<number[]>} - The embedding vector (1536 dimensions)
 */
export async function generateEmbedding(text) {
  if (!text || text.trim().length === 0) {
    throw new Error('Text is required for generating embeddings');
  }

  const response = await getOpenAI().embeddings.create({
    model: 'text-embedding-3-small',
    input: text.trim(),
  });

  return response.data[0].embedding;
}

/**
 * Extract text from a PDF buffer using pdf-parse.
 * @param {Buffer} buffer - The PDF file buffer
 * @returns {Promise<string>} - The extracted text
 */
export async function extractTextFromPDF(buffer) {
  const pdf = require('pdf-parse');
  const parseFunc = typeof pdf === 'function' ? pdf : pdf.default || pdf;
  const data = await parseFunc(buffer);
  return data.text || '';
}

/**
 * Combine title and abstract for embedding generation.
 * Handles both Arabic and English content.
 * @param {object} project - Project data with title and abstract fields
 * @returns {string} - Combined text for embedding
 */
export function combineTextForEmbedding(project) {
  const parts = [];

  if (project.title_en) parts.push(project.title_en);
  if (project.title_ar) parts.push(project.title_ar);
  if (project.abstract_en) parts.push(project.abstract_en);
  if (project.abstract_ar) parts.push(project.abstract_ar);
  if (project.keywords && project.keywords.length > 0) {
    parts.push(project.keywords.join(', '));
  }

  return parts.join('\n\n');
}
