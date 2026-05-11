import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

function getUserIdFromToken() {
  return 'current_user_id';
}

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

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let query = supabase
      .from('budget_tracker_app_cztuh_spending_entries')
      .select('*')
      .order('date', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (startDate) {
      query = query.gte('date', startDate);
    }

    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data: entries, error } = await query;

    if (error) {
      throw error;
    }

    const total = entries?.reduce((sum, entry) => sum + Number(entry.amount), 0) || 0;
    const byCategory: { [key: string]: number } = {};

    entries?.forEach((entry) => {
      byCategory[entry.category] = (byCategory[entry.category] || 0) + Number(entry.amount);
    });

    return NextResponse.json({
      entries: entries || [],
      total,
      byCategory,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch spending entries' },
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

    const { amount, category, description, userId } = await request.json();

    if (!amount || !category || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }

    if (description && description.length > 200) {
      return NextResponse.json(
        { error: 'Description must be under 200 characters' },
        { status: 400 }
      );
    }

    const { data: entry, error } = await supabase
      .from('budget_tracker_app_cztuh_spending_entries')
      .insert([
        {
          user_id: userId,
          amount: Number(amount),
          category,
          description: description || null,
          date: new Date().toISOString().split('T')[0],
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      id: entry.id,
      amount: entry.amount,
      category: entry.category,
      description: entry.description,
      createdAt: entry.created_at,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create spending entry' },
      { status: 500 }
    );
  }
}
