'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Plus } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/authStore';
import { DashboardSummary } from './DashboardSummary';
import { SpendingList } from './SpendingList';
import { SavingsList } from './SavingsList';
import { AddSpendingModal } from './AddSpendingModal';
import { AddSavingsModal } from './AddSavingsModal';

interface SpendingEntry {
  id: string;
  amount: number;
  category: string;
  description?: string;
  date: string;
}

interface SavingsEntry {
  id: string;
  amount: number;
  description?: string;
  date: string;
}

export function DashboardClient() {
  const router = useRouter();
  const { user, setUser, isLoading, setLoading } = useAuthStore();
  const [spending, setSpending] = useState<SpendingEntry[]>([]);
  const [savings, setSavings] = useState<SavingsEntry[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isAddSpendingOpen, setIsAddSpendingOpen] = useState(false);
  const [isAddSavingsOpen, setIsAddSavingsOpen] = useState(false);
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
        const spendingRes = await fetch('/api/spending');
        if (!spendingRes.ok) throw new Error('Failed to fetch spending');
        const spendingData = await spendingRes.json();
        setSpending(spendingData.entries);

        // Load savings data
        const savingsRes = await fetch('/api/savings');
        if (!savingsRes.ok) throw new Error('Failed to fetch savings');
        const savingsData = await savingsRes.json();
        setSavings(savingsData.entries);

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
  }, [user, isLoading, setUser, setLoading, router]);

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

  const handleAddSavings = async (data: any) => {
    try {
      const res = await fetch('/api/savings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, userId: user?.id }),
      });
      if (!res.ok) throw new Error('Failed to add savings');
      const newEntry = await res.json();
      setSavings([newEntry, ...savings]);
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

  const handleDeleteSavings = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      const res = await fetch(`/api/savings/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setSavings(savings.filter((e) => e.id !== id));
    } catch (error) {
      alert('Failed to delete savings entry');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const totalSpending = spending.reduce((sum, e) => sum + e.amount, 0);
  const totalSavings = savings.reduce((sum, e) => sum + e.amount, 0);
  const totalBudget = totalSpending + totalSavings + 1000;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Budget Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        <DashboardSummary
          totalBudget={totalBudget}
          totalSpending={totalSpending}
          totalSavings={totalSavings}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Recent Spending</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAddSpendingOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  <Plus size={18} />
                  Add
                </button>
                <Link
                  href="/dashboard/spending"
                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                >
                  View All
                </Link>
              </div>
            </div>
            <SpendingList
              entries={spending.slice(0, 5)}
              onEdit={() => {}}
              onDelete={handleDeleteSpending}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Recent Savings</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAddSavingsOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                >
                  <Plus size={18} />
                  Add
                </button>
                <Link
                  href="/dashboard/savings"
                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                >
                  View All
                </Link>
              </div>
            </div>
            <SavingsList
              entries={savings.slice(0, 5)}
              onEdit={() => {}}
              onDelete={handleDeleteSavings}
            />
          </div>
        </div>

        <AddSpendingModal
          isOpen={isAddSpendingOpen}
          onClose={() => setIsAddSpendingOpen(false)}
          onSubmit={handleAddSpending}
          categories={categories}
        />

        <AddSavingsModal
          isOpen={isAddSavingsOpen}
          onClose={() => setIsAddSavingsOpen(false)}
          onSubmit={handleAddSavings}
        />
      </div>
    </div>
  );
}
