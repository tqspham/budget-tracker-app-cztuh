import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

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

    const { data: entries, error } = await supabase
      .from('budget_tracker_app_cztuh_savings_entries')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      throw error;
    }

    const total = entries?.reduce((sum, entry) => sum + Number(entry.amount), 0) || 0;

    return NextResponse.json({
      entries: entries || [],
      total,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch savings entries' },
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

    const { amount, description, userId } = await request.json();

    if (!amount || amount <= 0) {
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
      .from('budget_tracker_app_cztuh_savings_entries')
      .insert([
        {
          user_id: userId,
          amount: Number(amount),
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
      description: entry.description,
      createdAt: entry.created_at,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create savings entry' },
      { status: 500 }
    );
  }
}
