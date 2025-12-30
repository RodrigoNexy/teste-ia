import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useLeads } from '../useLeads';
import { LeadService } from '../../services/lead.service';
import type { LeadStatus } from '../../types/lead.types';

vi.mock('../../services/lead.service', () => {
  const instance = {
    getAll: vi.fn(),
    getStats: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    analyze: vi.fn(),
  };

  const MockLeadService = function() {
    return instance;
  } as any;
  MockLeadService.prototype = instance;
  return {
    LeadService: MockLeadService,
  };
});

// Obter a instância mockada - sempre retorna a mesma instância
let mockLeadServiceInstance: any;
const getMockInstance = () => {
  if (!mockLeadServiceInstance) {
    mockLeadServiceInstance = new LeadService();
  }
  return mockLeadServiceInstance;
};

// Mock do window.confirm
global.confirm = vi.fn(() => true);

describe('useLeads', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve carregar leads e stats ao inicializar', async () => {
    const mockLeads = [{ id: '1', name: 'Lead 1', message: 'Teste', origin: 'WhatsApp', status: 'em_atendimento' as LeadStatus, interactions: 0, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }];
    const mockStats = { total: 1, quente: 0, morno: 0, frio: 0, averageScore: 0 };

    getMockInstance().getAll.mockResolvedValue(mockLeads);
    getMockInstance().getStats.mockResolvedValue(mockStats);

    const { result } = renderHook(() => useLeads());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.leads).toEqual(mockLeads);
    expect(result.current.stats).toEqual(mockStats);
  });

  it('deve criar um lead', async () => {
    const createData = {
      name: 'Novo Lead',
      message: 'Mensagem',
      origin: 'WhatsApp',
    };

    getMockInstance().getAll.mockResolvedValue([]);
    getMockInstance().getStats.mockResolvedValue({ total: 0, quente: 0, morno: 0, frio: 0, averageScore: 0 });
    getMockInstance().create.mockResolvedValue({ id: '1', ...createData });

    const { result } = renderHook(() => useLeads());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.handleCreate(createData);

    expect(getMockInstance().create).toHaveBeenCalledWith(createData);
    expect(result.current.isModalOpen).toBe(false);
  });

  it('deve atualizar um lead', async () => {
    const updateData = {
      name: 'Lead Atualizado',
      message: 'Mensagem',
      origin: 'WhatsApp',
    };

    getMockInstance().getAll.mockResolvedValue([]);
    getMockInstance().getStats.mockResolvedValue({ total: 0, quente: 0, morno: 0, frio: 0, averageScore: 0 });
    getMockInstance().update.mockResolvedValue({ id: '1', ...updateData });

    const { result } = renderHook(() => useLeads());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.handleUpdate('1', updateData);

    expect(getMockInstance().update).toHaveBeenCalledWith('1', updateData);
    expect(result.current.isModalOpen).toBe(false);
  });

  it('deve deletar um lead após confirmação', async () => {
    getMockInstance().getAll.mockResolvedValue([]);
    getMockInstance().getStats.mockResolvedValue({ total: 0, quente: 0, morno: 0, frio: 0, averageScore: 0 });
    getMockInstance().delete.mockResolvedValue(undefined);

    const { result } = renderHook(() => useLeads());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.handleDelete('1');

    expect(global.confirm).toHaveBeenCalled();
    expect(getMockInstance().delete).toHaveBeenCalledWith('1');
  });

  it('deve analisar um lead', async () => {
    getMockInstance().getAll.mockResolvedValue([]);
    getMockInstance().getStats.mockResolvedValue({ total: 0, quente: 0, morno: 0, frio: 0, averageScore: 0 });
    getMockInstance().analyze.mockResolvedValue({ id: '1', score: 85 });

    const { result } = renderHook(() => useLeads());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.handleAnalyze('1');

    expect(getMockInstance().analyze).toHaveBeenCalledWith('1');
  });

  it('deve alterar status de um lead', async () => {
    getMockInstance().getAll.mockResolvedValue([]);
    getMockInstance().getStats.mockResolvedValue({ total: 0, quente: 0, morno: 0, frio: 0, averageScore: 0 });
    getMockInstance().update.mockResolvedValue({ id: '1', status: 'finalizado' });

    const { result } = renderHook(() => useLeads());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.handleStatusChange('1', 'finalizado');

    expect(getMockInstance().update).toHaveBeenCalledWith('1', { status: 'finalizado' });
  });

  it('deve abrir modal de edição', async () => {
    const mockLead = {
      id: '1',
      name: 'Lead',
      message: 'Teste',
      origin: 'WhatsApp',
      status: 'em_atendimento' as LeadStatus,
      interactions: 0,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    getMockInstance().getAll.mockResolvedValue([]);
    getMockInstance().getStats.mockResolvedValue({ total: 0, quente: 0, morno: 0, frio: 0, averageScore: 0 });

    const { result } = renderHook(() => useLeads());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.handleEdit(mockLead);
    });

    expect(result.current.editingLead).toEqual(mockLead);
    expect(result.current.isModalOpen).toBe(true);
  });

  it('deve abrir modal de visualização', async () => {
    const mockLead = {
      id: '1',
      name: 'Lead',
      message: 'Teste',
      origin: 'WhatsApp',
      status: 'em_atendimento' as LeadStatus,
      interactions: 0,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    getMockInstance().getAll.mockResolvedValue([]);
    getMockInstance().getStats.mockResolvedValue({ total: 0, quente: 0, morno: 0, frio: 0, averageScore: 0 });

    const { result } = renderHook(() => useLeads());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.handleExpand(mockLead);
    });

    expect(result.current.viewingLead).toEqual(mockLead);
    expect(result.current.isViewModalOpen).toBe(true);
  });
});


