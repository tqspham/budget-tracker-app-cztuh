'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/authStore';
import { SpendingList } from './SpendingList';
import { FilterPanel } from './FilterPanel';
import { AddSpendingModal } from './AddSpendingModal';
import { EditSpendingModal } from './EditSpendingModal';

interface SpendingEntry {
  id: string;
  amount: number;
  category: string;
  description?: string;
  date: string;
}

export function SpendingPageClient() {
  const router = useRouter();
  const { user, setUser, isLoading, setLoading } = useAuthStore();
  const [spending, setSpending] = useState<SpendingEntry[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<SpendingEntry | undefined>();
  const [filter, setFilter] = useState({ category: '', startDate: '', endDate: '' });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Verify session
        const meRes = await fetch('/api/auth/me');
        if (!meRes.ok) {
          router.push('/');
          return;
        }
        const meData = await meRes.json();
        setUser(meData);

        // Load spending data
        const spendingRes = await fetch(
          `/api/spending?category=${filter.category}&startDate=${filter.startDate}&endDate=${filter.endDate}`
        );
        if (!spendingRes.ok) throw new Error('Failed to fetch spending');
        const spendingData = await spendingRes.json();
        setSpending(spendingData.entries);

        // Load categories
        const categoriesRes = await fetch('/api/categories');
        if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.categories);
      } catch (error) {
        router.push('/');
      } finally {
        setLoading(false);
        setDataLoading(false);
      }
    };

    if (!user && isLoading) {
      loadData();
    } else if (user) {
      setDataLoading(false);
    }
  }, [filter, user, isLoading, setUser, setLoading, router]);

  const handleAddSpending = async (data: any) => {
    try {
      const res = await fetch('/api/spending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, userId: user?.id }),
      });
      if (!res.ok) throw new Error('Failed to add spending');
      const newEntry = await res.json();
      setSpending([newEntry, ...spending]);
    } catch (error) {
      throw error;
    }
  };

  const handleEditSpending = (id: string) => {
    const entry = spending.find((e) => e.id === id);
    if (entry) {
      setEditingEntry(entry);
      setIsEditOpen(true);
    }
  };

  const handleUpdateSpending = async (data: any) => {
    if (!editingEntry) return;
    try {
      const res = await fetch(`/api/spending/${editingEntry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update spending');
      const updated = await res.json();
      setSpending(
        spending.map((e) =>
          e.id === editingEntry.id
            ? { ...e, amount: updated.amount, category: updated.category, description: updated.description }
            : e
        )
      );
      setIsEditOpen(false);
      setEditingEntry(undefined);
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteSpending = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      const res = await fetch(`/api/spending/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setSpending(spending.filter((e) => e.id !== id));
    } catch (error) {
      alert('Failed to delete spending entry');
    }
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <ArrowLeft size={20} />
              Back
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Spending Entries</h1>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            <Plus size={18} />
            Add Entry
          </button>
        </div>

        <FilterPanel categories={categories} onFilterChange={setFilter} />

        <SpendingList
          entries={spending}
          onEdit={handleEditSpending}
          onDelete={handleDeleteSpending}
        />

        <AddSpendingModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSubmit={handleAddSpending}
          categories={categories}
        />

        <EditSpendingModal
          isOpen={isEditOpen}
          entry={editingEntry}
          onClose={() => {
            setIsEditOpen(false);
            setEditingEntry(undefined);
          }}
          onSubmit={handleUpdateSpending}
          categories={categories}
        />
      </div>
    </div>
  );
}
