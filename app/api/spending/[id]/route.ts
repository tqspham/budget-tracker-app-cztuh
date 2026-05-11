import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const { amount, category, description } = await request.json();

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
      .update({
        amount: Number(amount),
        category,
        description: description || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
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
      updatedAt: entry.updated_at,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update spending entry' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    const { error } = await supabase
      .from('budget_tracker_app_cztuh_spending_entries')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete spending entry' },
      { status: 500 }
    );
  }
}
