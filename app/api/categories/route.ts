import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const PREDEFINED_CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Health', 'Other'];

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: customCategories, error } = await supabase
      .from('budget_tracker_app_cztuh_categories')
      .select('name')
      .eq('is_custom', true);

    if (error) {
      throw error;
    }

    const customNames = customCategories?.map((c) => c.name) || [];
    const categories = [...PREDEFINED_CATEGORIES, ...customNames];

    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, userId } = await request.json();

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid category name' },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();

    if (PREDEFINED_CATEGORIES.includes(trimmedName)) {
      return NextResponse.json(
        { error: 'Category already exists' },
        { status: 400 }
      );
    }

    const { error: insertError } = await supabase
      .from('budget_tracker_app_cztuh_categories')
      .insert([
        {
          user_id: userId,
          name: trimmedName,
          is_custom: true,
        },
      ]);

    if (insertError) {
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'Category already exists' },
          { status: 400 }
        );
      }
      throw insertError;
    }

    const { data: customCategories, error: fetchError } = await supabase
      .from('budget_tracker_app_cztuh_categories')
      .select('name')
      .eq('is_custom', true);

    if (fetchError) {
      throw fetchError;
    }

    const customNames = customCategories?.map((c) => c.name) || [];
    const categories = [...PREDEFINED_CATEGORIES, ...customNames];

    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add category' },
      { status: 500 }
    );
  }
}
