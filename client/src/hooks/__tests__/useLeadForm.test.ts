import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLeadForm } from '../useLeadForm';
import type { Lead } from '../../types/lead.types';

describe('useLeadForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve inicializar com valores padrão quando lead é null', () => {
    const { result } = renderHook(() =>
      useLeadForm({ lead: null, onSubmit: mockOnSubmit })
    );

    expect(result.current.name).toBe('');
    expect(result.current.email).toBe('');
    expect(result.current.phone).toBe('');
    expect(result.current.message).toBe('');
    expect(result.current.origin).toBe('WhatsApp');
    expect(result.current.responseTime).toBe('');
    expect(result.current.interactions).toBe('0');
  });

  it('deve preencher campos quando lead é fornecido', () => {
    const mockLead: Lead = {
      id: '1',
      name: 'Lead Teste',
      email: 'teste@test.com',
      phone: '11999999999',
      message: 'Mensagem teste',
      origin: 'Formulário',
      responseTime: 2,
      interactions: 3,
      status: 'em_atendimento',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    const { result } = renderHook(() =>
      useLeadForm({ lead: mockLead, onSubmit: mockOnSubmit })
    );

    expect(result.current.name).toBe('Lead Teste');
    expect(result.current.email).toBe('teste@test.com');
    expect(result.current.phone).toBe('11999999999');
    expect(result.current.message).toBe('Mensagem teste');
    expect(result.current.origin).toBe('Formulário');
    expect(result.current.responseTime).toBe('2');
    expect(result.current.interactions).toBe('3');
  });

  it('deve validar campos obrigatórios no submit', async () => {
    const { result } = renderHook(() =>
      useLeadForm({ lead: null, onSubmit: mockOnSubmit })
    );

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(result.current.error).toBe('Nome, mensagem e origem são obrigatórios');
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('deve chamar onSubmit com dados corretos', async () => {
    const { result } = renderHook(() =>
      useLeadForm({ lead: null, onSubmit: mockOnSubmit })
    );

    act(() => {
      result.current.setName('Novo Lead');
      result.current.setMessage('Mensagem');
      result.current.setOrigin('WhatsApp');
      result.current.setEmail('email@test.com');
      result.current.setResponseTime('2');
      result.current.setInteractions('1');
    });

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent;

    mockOnSubmit.mockResolvedValue(undefined);

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Novo Lead',
      email: 'email@test.com',
      phone: undefined,
      message: 'Mensagem',
      origin: 'WhatsApp',
      responseTime: 2,
      interactions: 1,
    });
  });

  it('deve resetar formulário após criar novo lead', async () => {
    const { result } = renderHook(() =>
      useLeadForm({ lead: null, onSubmit: mockOnSubmit })
    );

    act(() => {
      result.current.setName('Lead');
      result.current.setMessage('Mensagem');
      result.current.setOrigin('WhatsApp');
    });

    mockOnSubmit.mockResolvedValue(undefined);

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(result.current.name).toBe('');
    expect(result.current.message).toBe('');
  });

  it('não deve resetar formulário ao editar lead existente', async () => {
    const mockLead: Lead = {
      id: '1',
      name: 'Lead Original',
      message: 'Mensagem original',
      origin: 'WhatsApp',
      status: 'em_atendimento',
      interactions: 0,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    const { result } = renderHook(() =>
      useLeadForm({ lead: mockLead, onSubmit: mockOnSubmit })
    );

    mockOnSubmit.mockResolvedValue(undefined);

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(result.current.name).toBe('Lead Original');
  });

  it('deve resetar formulário manualmente', () => {
    const { result } = renderHook(() =>
      useLeadForm({ lead: null, onSubmit: mockOnSubmit })
    );

    act(() => {
      result.current.setName('Teste');
      result.current.setMessage('Mensagem');
    });

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.name).toBe('');
    expect(result.current.message).toBe('');
    expect(result.current.origin).toBe('WhatsApp');
  });
});


