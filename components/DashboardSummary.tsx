'use client';

import { Wallet, TrendingDown, TrendingUp, PieChart } from 'lucide-react';

interface DashboardSummaryProps {
  totalBudget: number;
  totalSpending: number;
  totalSavings: number;
}

export function DashboardSummary({
  totalBudget,
  totalSpending,
  totalSavings,
}: DashboardSummaryProps) {
  const remainingBalance = totalBudget - totalSpending;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Budget</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">${totalBudget.toFixed(2)}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <Wallet className="text-blue-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Spending</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">${totalSpending.toFixed(2)}</p>
          </div>
          <div className="bg-red-100 p-3 rounded-lg">
            <TrendingDown className="text-red-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Remaining Balance</p>
            <p className={`text-2xl font-bold mt-1 ${
              remainingBalance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              ${remainingBalance.toFixed(2)}
            </p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <PieChart className="text-green-600" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Savings</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">${totalSavings.toFixed(2)}</p>
          </div>
          <div className="bg-green-100 p-3 rounded-lg">
            <TrendingUp className="text-green-600" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}
