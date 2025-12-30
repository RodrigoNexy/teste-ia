import { useMemo } from 'react';
import type { Lead, LeadStats } from '../types/lead.types';

export function useAnalytics(leads: Lead[], stats: LeadStats | null) {
  const statusData = useMemo(() => {
    return [
      {
        name: 'Em Atendimento',
        value: leads.filter((l) => l.status === 'em_atendimento').length,
        color: '#3B82F6',
      },
      {
        name: 'Finalizado',
        value: leads.filter((l) => l.status === 'finalizado').length,
        color: '#10B981',
      },
      {
        name: 'Travado',
        value: leads.filter((l) => l.status === 'travado').length,
        color: '#EF4444',
      },
    ];
  }, [leads]);

  const classificationData = useMemo(() => {
    return [
      {
        name: 'Quente',
        value: stats?.quente || 0,
        color: '#10B981',
      },
      {
        name: 'Morno',
        value: stats?.morno || 0,
        color: '#F59E0B',
      },
      {
        name: 'Frio',
        value: stats?.frio || 0,
        color: '#EF4444',
      },
    ];
  }, [stats]);

  const originData = useMemo(() => {
    const originCounts: Record<string, number> = {};
    leads.forEach((lead) => {
      originCounts[lead.origin] = (originCounts[lead.origin] || 0) + 1;
    });

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

    return Object.entries(originCounts)
      .map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length],
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10 origens
  }, [leads]);

  const evolutionData = useMemo(() => {
    const months: string[] = [];
    const counts: number[] = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
      months.push(monthName);

      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

      const count = leads.filter((lead) => {
        const leadDate = new Date(lead.createdAt);
        return leadDate >= monthStart && leadDate <= monthEnd;
      }).length;

      counts.push(count);
    }

    return months.map((month, index) => ({
      month,
      leads: counts[index],
    }));
  }, [leads]);

  const averageScoreByStatus = useMemo(() => {
    return [
      {
        status: 'Em Atendimento',
        score: leads
          .filter((l) => l.status === 'em_atendimento' && l.score)
          .reduce((acc, l) => acc + (l.score || 0), 0) /
          leads.filter((l) => l.status === 'em_atendimento' && l.score).length || 0,
      },
      {
        status: 'Finalizado',
        score: leads
          .filter((l) => l.status === 'finalizado' && l.score)
          .reduce((acc, l) => acc + (l.score || 0), 0) /
          leads.filter((l) => l.status === 'finalizado' && l.score).length || 0,
      },
      {
        status: 'Travado',
        score: leads
          .filter((l) => l.status === 'travado' && l.score)
          .reduce((acc, l) => acc + (l.score || 0), 0) /
          leads.filter((l) => l.status === 'travado' && l.score).length || 0,
      },
    ].map((item) => ({
      ...item,
      score: Math.round(item.score * 10) / 10,
    }));
  }, [leads]);

  const conversionRate = useMemo(() => {
    if (!stats?.total) return 0;
    const finalized = leads.filter((l) => l.status === 'finalizado').length;
    return Math.round((finalized / stats.total) * 100);
  }, [leads, stats]);

  return {
    statusData,
    classificationData,
    originData,
    evolutionData,
    averageScoreByStatus,
    conversionRate,
  };
}

