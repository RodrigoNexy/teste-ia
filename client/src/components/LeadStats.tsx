import React from 'react';
import type { LeadStats } from '../types/lead.types';

interface LeadStatsProps {
  stats: LeadStats;
}

export function LeadStats({ stats }: LeadStatsProps) {
  const quentePercent = stats.total > 0 ? Math.round((stats.quente / stats.total) * 100) : 0;
  const mornoPercent = stats.total > 0 ? Math.round((stats.morno / stats.total) * 100) : 0;
  const frioPercent = stats.total > 0 ? Math.round((stats.frio / stats.total) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">📊 Estatísticas</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-500">Total</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">{stats.quente}</div>
          <div className="text-sm text-gray-500">🟢 Quente ({quentePercent}%)</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-600">{stats.morno}</div>
          <div className="text-sm text-gray-500">🟡 Morno ({mornoPercent}%)</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-red-600">{stats.frio}</div>
          <div className="text-sm text-gray-500">🔴 Frio ({frioPercent}%)</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{stats.averageScore}</div>
          <div className="text-sm text-gray-500">Score Médio</div>
        </div>
      </div>
    </div>
  );
}

