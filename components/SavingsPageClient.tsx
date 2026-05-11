'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { SavingsList } from './SavingsList';
import { AddSavingsModal } from './AddSavingsModal';
import { EditSavingsModal } from './EditSavingsModal';

interface SavingsEntry {
  id: string;
  amount: number;
  description?: string;
  date: string;
}

export function SavingsPageClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [savings, setSavings] = useState<SavingsEntry[]>([]);
  const [userId, setUserId] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<SavingsEntry | undefined>();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const savingsRes = await fetch('/api/savings');
        if (!savingsRes.ok) throw new Error('Failed to fetch savings');
        const savingsData = await savingsRes.json();
        setSavings(savingsData.entries);
      } catch (error) {
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleAddSavings = async (data: any) => {
    try {
      const res = await fetch('/api/savings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, userId }),
      });
      if (!res.ok) throw new Error('Failed to add savings');
      const newEntry = await res.json();
      setSavings([newEntry, ...savings]);
    } catch (error) {
      throw error;
    }
  };

  const handleEditSavings = (id: string) => {
    const entry = savings.find((e) => e.id === id);
    if (entry) {
      setEditingEntry(entry);
      setIsEditOpen(true);
    }
  };

  const handleUpdateSavings = async (data: any) => {
    if (!editingEntry) return;
    try {
      const res = await fetch(`/api/savings/${editingEntry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update savings');
      const updated = await res.json();
      setSavings(
        savings.map((e) =>
          e.id === editingEntry.id
            ? { ...e, amount: updated.amount, description: updated.description }
            : e
        )
      );
      setIsEditOpen(false);
      setEditingEntry(undefined);
    } catch (error) {
      throw error;
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <ArrowLeft size={20} />
              Back
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Savings Entries</h1>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
          >
            <Plus size={18} />
            Add Entry
          </button>
        </div>

        <SavingsList
          entries={savings}
          onEdit={handleEditSavings}
          onDelete={handleDeleteSavings}
        />

        <AddSavingsModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSubmit={handleAddSavings}
        />

        <EditSavingsModal
          isOpen={isEditOpen}
          entry={editingEntry}
          onClose={() => {
            setIsEditOpen(false);
            setEditingEntry(undefined);
          }}
          onSubmit={handleUpdateSavings}
        />
      </div>
    </div>
  );
}
