/**
 * Detect if text is primarily Arabic
 * @param {string} text
 * @returns {boolean}
 */
export function isArabic(text) {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  const arabicChars = (text.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g) || []).length;
  const latinChars = (text.match(/[a-zA-Z]/g) || []).length;
  return arabicChars > latinChars;
}

/**
 * Build a full-text search query for Supabase
 * @param {string} query - Search query text
 * @param {object} filters - Optional filters { department, year, supervisor }
 * @param {number} page - Page number (1-indexed)
 * @param {number} pageSize - Number of results per page
 * @returns {object} - Supabase query configuration
 */
export function buildSearchQuery(supabase, query, filters = {}, page = 1, pageSize = 12) {
  let dbQuery = supabase
    .from('projects')
    .select('*', { count: 'exact' });

  // Apply text search if query provided
  if (query && query.trim()) {
    const searchTerms = query.trim().split(/\s+/).join(' & ');

    if (isArabic(query)) {
      dbQuery = dbQuery.textSearch(
        'title_ar, abstract_ar',
        searchTerms,
        { config: 'simple' }
      );
    } else {
      dbQuery = dbQuery.textSearch(
        'title_en, abstract_en',
        searchTerms,
        { config: 'english' }
      );
    }
  }

  // Apply filters
  if (filters.department) {
    dbQuery = dbQuery.eq('department', filters.department);
  }
  if (filters.year) {
    dbQuery = dbQuery.eq('year', parseInt(filters.year));
  }
  if (filters.supervisor) {
    dbQuery = dbQuery.ilike('supervisor', `%${filters.supervisor}%`);
  }

  // Apply pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  dbQuery = dbQuery.range(from, to);

  // Order by newest first
  dbQuery = dbQuery.order('year', { ascending: false });

  return dbQuery;
}

/**
 * Calculate similarity percentage from cosine similarity score
 * @param {number} similarity - Cosine similarity score (0-1)
 * @returns {number} - Percentage (0-100)
 */
export function similarityToPercentage(similarity) {
  return Math.round(similarity * 100);
}

/**
 * Get similarity level category
 * @param {number} percentage - Similarity percentage
 * @returns {'low' | 'medium' | 'high'}
 */
export function getSimilarityLevel(percentage) {
  if (percentage >= 70) return 'high';
  if (percentage >= 30) return 'medium';
  return 'low';
}

/**
 * Department display names mapping
 */
export const DEPARTMENTS = [
  { value: 'MIS', label: 'Management Information Systems', labelAr: 'نظم المعلومات الإدارية' },
  { value: 'BA', label: 'Business Analysis', labelAr: 'تحليل الأعمال' },
  { value: 'Fintech', label: 'Financial Technology', labelAr: 'التكنولوجيا المالية' },
  { value: 'Marketing Intelligence', label: 'Marketing Intelligence', labelAr: 'ذكاء التسويق' },
];

/**
 * Get department label
 * @param {string} value - Department value
 * @param {string} lang - Language ('en' or 'ar')
 * @returns {string}
 */
export function getDepartmentLabel(value, lang = 'en') {
  const dept = DEPARTMENTS.find((d) => d.value === value);
  if (!dept) return value;
  return lang === 'ar' ? dept.labelAr : dept.label;
}
