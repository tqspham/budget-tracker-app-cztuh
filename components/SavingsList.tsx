'use client';

import { Edit2, Trash2 } from 'lucide-react';

interface SavingsEntry {
  id: string;
  amount: number;
  description?: string;
  date: string;
}

interface SavingsListProps {
  entries: SavingsEntry[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SavingsList({ entries, onEdit, onDelete }: SavingsListProps) {
  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600">No savings entries yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {entries.map((entry) => (
            <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm text-gray-900">
                {new Date(entry.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{entry.description || '-'}</td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                ${entry.amount.toFixed(2)}
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => onEdit(entry.id)}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mr-4 transition-colors"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(entry.id)}
                  className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
