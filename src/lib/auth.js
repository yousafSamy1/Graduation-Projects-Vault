import { createPublicSupabaseClient } from './supabase';

/**
 * Verifies that an incoming request has a valid Supabase admin token.
 * 
 * @param {Request} request 
 * @returns {Promise<{ authorized: boolean, user?: any, error?: string, status?: number }>}
 */
export async function verifyAdminRequest(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authorized: false, error: 'Unauthorized: Missing or invalid token', status: 401 };
  }

  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) {
    return { authorized: false, error: 'Unauthorized: Token is empty', status: 401 };
  }

  try {
    const supabase = createPublicSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return { 
        authorized: false, 
        error: error?.message || 'Unauthorized: Session invalid or expired', 
        status: 401 
      };
    }

    // Check against authorized ADMIN_EMAIL if set in environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && user.email?.toLowerCase() !== adminEmail.toLowerCase().trim()) {
      return { 
        authorized: false, 
        error: 'Forbidden: You do not have administrator privileges', 
        status: 403 
      };
    }

    return { authorized: true, user };
  } catch (err) {
    console.error('Server auth verification error:', err);
    return { 
      authorized: false, 
      error: 'Authentication verification failed', 
      status: 500 
    };
  }
}
