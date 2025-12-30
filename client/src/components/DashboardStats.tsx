import { Users, TrendingUp, Clock, TrendingDown, Circle } from 'lucide-react';
import type { LeadStats } from '../types/lead.types';

interface DashboardStatsProps {
  stats: LeadStats;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const quentePercent = stats.total > 0 ? Math.round((stats.quente / stats.total) * 100) : 0;
  const mornoPercent = stats.total > 0 ? Math.round((stats.morno / stats.total) * 100) : 0;
  const frioPercent = stats.total > 0 ? Math.round((stats.frio / stats.total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total de Leads */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total de Leads</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
          </div>
          <div className="bg-blue-100 rounded-full p-3">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Leads Quentes */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
              <Circle className="w-3 h-3 text-green-500 fill-green-500" />
              Leads Quentes
            </p>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.quente}</p>
            <p className="text-xs text-gray-500 mt-1">{quentePercent}% do total</p>
          </div>
          <div className="bg-green-100 rounded-full p-3">
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Leads Mornos */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
              <Circle className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              Leads Mornos
            </p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.morno}</p>
            <p className="text-xs text-gray-500 mt-1">{mornoPercent}% do total</p>
          </div>
          <div className="bg-yellow-100 rounded-full p-3">
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Leads Frios */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 flex items-center gap-1">
              <Circle className="w-3 h-3 text-red-500 fill-red-500" />
              Leads Frios
            </p>
            <p className="text-3xl font-bold text-red-600 mt-2">{stats.frio}</p>
            <p className="text-xs text-gray-500 mt-1">{frioPercent}% do total</p>
          </div>
          <div className="bg-red-100 rounded-full p-3">
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

