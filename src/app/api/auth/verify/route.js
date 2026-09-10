import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    const authResult = await verifyAdminRequest(request);

    if (!authResult.authorized) {
      return NextResponse.json(
        { valid: false, error: authResult.error },
        { status: authResult.status || 401 }
      );
    }

    return NextResponse.json({
      valid: true,
      user: {
        id: authResult.user.id,
        email: authResult.user.email,
      },
    });
  } catch (err) {
    console.error('Verify token API error:', err);
    return NextResponse.json(
      { valid: false, error: 'Verification error' },
      { status: 500 }
    );
  }
}
