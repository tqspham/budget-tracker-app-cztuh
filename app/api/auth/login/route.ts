import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const PREDEFINED_CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Health', 'Other'];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const { data: user, error: fetchError } = await supabase
      .from('budget_tracker_app_cztuh_users')
      .select('id, email, password_hash')
      .eq('email', email)
      .single();

    if (fetchError || !user) {
      return NextResponse.json(
        { success: false, error: 'Email not registered' },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: 'Incorrect password' },
        { status: 401 }
      );
    }

    const token = uuidv4();
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    return NextResponse.json({
      success: true,
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}
