import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAnalytics } from '../useAnalytics';
import type { Lead, LeadStats } from '../../types/lead.types';

describe('useAnalytics', () => {
  const mockLeads: Lead[] = [
    {
      id: '1',
      name: 'Lead 1',
      message: 'Teste',
      origin: 'WhatsApp',
      status: 'em_atendimento',
      score: 85,
      classification: 'Quente',
      interactions: 1,
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
    },
    {
      id: '2',
      name: 'Lead 2',
      message: 'Teste',
      origin: 'Formulário',
      status: 'finalizado',
      score: 50,
      classification: 'Morno',
      interactions: 2,
      createdAt: '2024-02-15T00:00:00Z',
      updatedAt: '2024-02-15T00:00:00Z',
    },
    {
      id: '3',
      name: 'Lead 3',
      message: 'Teste',
      origin: 'WhatsApp',
      status: 'travado',
      score: 30,
      classification: 'Frio',
      interactions: 0,
      createdAt: '2024-03-15T00:00:00Z',
      updatedAt: '2024-03-15T00:00:00Z',
    },
  ];

  const mockStats: LeadStats = {
    total: 3,
    quente: 1,
    morno: 1,
    frio: 1,
    averageScore: 55,
  };

  it('deve calcular statusData corretamente', () => {
    const { result } = renderHook(() => useAnalytics(mockLeads, mockStats));

    expect(result.current.statusData).toEqual([
      { name: 'Em Atendimento', value: 1, color: '#3B82F6' },
      { name: 'Finalizado', value: 1, color: '#10B981' },
      { name: 'Travado', value: 1, color: '#EF4444' },
    ]);
  });

  it('deve calcular classificationData a partir de stats', () => {
    const { result } = renderHook(() => useAnalytics(mockLeads, mockStats));

    expect(result.current.classificationData).toEqual([
      { name: 'Quente', value: 1, color: '#10B981' },
      { name: 'Morno', value: 1, color: '#F59E0B' },
      { name: 'Frio', value: 1, color: '#EF4444' },
    ]);
  });

  it('deve calcular originData corretamente', () => {
    const { result } = renderHook(() => useAnalytics(mockLeads, mockStats));

    const originData = result.current.originData;
    expect(originData).toHaveLength(2);
    expect(originData.find((o) => o.name === 'WhatsApp')?.value).toBe(2);
    expect(originData.find((o) => o.name === 'Formulário')?.value).toBe(1);
  });

  it('deve calcular evolutionData para últimos 6 meses', () => {
    const { result } = renderHook(() => useAnalytics(mockLeads, mockStats));

    const evolutionData = result.current.evolutionData;
    expect(evolutionData).toHaveLength(6);
    expect(evolutionData.every((item) => 'month' in item && 'leads' in item)).toBe(true);
  });

  it('deve calcular averageScoreByStatus corretamente', () => {
    const { result } = renderHook(() => useAnalytics(mockLeads, mockStats));

    const averageScore = result.current.averageScoreByStatus;
    expect(averageScore).toHaveLength(3);
    expect(averageScore.find((s) => s.status === 'Em Atendimento')?.score).toBe(85);
    expect(averageScore.find((s) => s.status === 'Finalizado')?.score).toBe(50);
    expect(averageScore.find((s) => s.status === 'Travado')?.score).toBe(30);
  });

  it('deve calcular conversionRate corretamente', () => {
    const { result } = renderHook(() => useAnalytics(mockLeads, mockStats));

    // 1 finalizado de 3 total = 33%
    expect(result.current.conversionRate).toBe(33);
  });

  it('deve retornar 0 para conversionRate se não houver stats', () => {
    const { result } = renderHook(() => useAnalytics(mockLeads, null));

    expect(result.current.conversionRate).toBe(0);
  });

  it('deve retornar valores padrão quando stats é null', () => {
    const { result } = renderHook(() => useAnalytics(mockLeads, null));

    expect(result.current.classificationData).toEqual([
      { name: 'Quente', value: 0, color: '#10B981' },
      { name: 'Morno', value: 0, color: '#F59E0B' },
      { name: 'Frio', value: 0, color: '#EF4444' },
    ]);
  });
});


