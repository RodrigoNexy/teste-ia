import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLeadKanban } from '../useLeadKanban';
import type { Lead, LeadStatus } from '../../types/lead.types';

describe('useLeadKanban', () => {
  const mockLeads: Lead[] = [
    {
      id: '1',
      name: 'Lead 1',
      message: 'Teste',
      origin: 'WhatsApp',
      status: 'em_atendimento',
      interactions: 0,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Lead 2',
      message: 'Teste',
      origin: 'Formulário',
      status: 'finalizado',
      interactions: 0,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '3',
      name: 'Lead 3',
      message: 'Teste',
      origin: 'Email',
      status: 'travado',
      interactions: 0,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ];

  const mockOnStatusChange = vi.fn();

  it('deve agrupar leads por status', () => {
    const { result } = renderHook(() =>
      useLeadKanban({ leads: mockLeads, onStatusChange: mockOnStatusChange })
    );

    expect(result.current.leadsByStatus.em_atendimento).toHaveLength(1);
    expect(result.current.leadsByStatus.finalizado).toHaveLength(1);
    expect(result.current.leadsByStatus.travado).toHaveLength(1);
  });

  it('deve iniciar drag ao chamar handleDragStart', () => {
    const { result } = renderHook(() =>
      useLeadKanban({ leads: mockLeads, onStatusChange: mockOnStatusChange })
    );

    const mockEvent = {
      dataTransfer: {
        setData: vi.fn(),
      },
    } as unknown as React.DragEvent;

    act(() => {
      result.current.handleDragStart(mockEvent, '1');
    });

    expect(result.current.draggedLead).toBe('1');
    expect(mockEvent.dataTransfer.setData).toHaveBeenCalledWith('text/plain', '1');
  });

  it('deve atualizar dragOverColumn ao chamar handleDragOver', () => {
    const { result } = renderHook(() =>
      useLeadKanban({ leads: mockLeads, onStatusChange: mockOnStatusChange })
    );

    const mockEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: {
        dropEffect: 'move',
      },
    } as unknown as React.DragEvent;

    act(() => {
      result.current.handleDragOver(mockEvent, 'finalizado');
    });

    expect(result.current.dragOverColumn).toBe('finalizado');
  });

  it('deve chamar onStatusChange ao fazer drop', () => {
    const { result } = renderHook(() =>
      useLeadKanban({ leads: mockLeads, onStatusChange: mockOnStatusChange })
    );

    const mockDragStartEvent = {
      dataTransfer: {
        effectAllowed: 'move',
        setData: vi.fn(),
      },
      currentTarget: document.createElement('div'),
    } as unknown as React.DragEvent;

    const mockDropEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: {
        getData: vi.fn((type: string) => {
          if (type === 'application/json') return JSON.stringify({ leadId: '1' });
          if (type === 'text/plain') return '1';
          return '';
        }),
      },
    } as unknown as React.DragEvent;

    act(() => {
      result.current.handleDragStart(mockDragStartEvent, '1');
    });

    act(() => {
      result.current.handleDrop(mockDropEvent, 'finalizado');
    });

    expect(mockOnStatusChange).toHaveBeenCalledWith('1', 'finalizado');
  });

  it('deve limpar dragOverColumn ao chamar handleDragLeave', () => {
    const { result } = renderHook(() =>
      useLeadKanban({ leads: mockLeads, onStatusChange: mockOnStatusChange })
    );

    const mockElement = document.createElement('div');
    mockElement.getBoundingClientRect = vi.fn(() => ({
      left: 0,
      right: 100,
      top: 0,
      bottom: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      toJSON: vi.fn(),
    }));

    const mockDragOverEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: {
        dropEffect: 'move',
      },
    } as unknown as React.DragEvent;

    const mockDragLeaveEvent = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      currentTarget: mockElement,
      clientX: 150,
      clientY: 150,
    } as unknown as React.DragEvent;

    act(() => {
      result.current.handleDragOver(mockDragOverEvent, 'finalizado');
    });

    expect(result.current.dragOverColumn).toBe('finalizado');

    act(() => {
      result.current.handleDragLeave(mockDragLeaveEvent);
    });

    expect(result.current.dragOverColumn).toBeNull();
  });

  it('deve limpar draggedLead ao chamar handleDragEnd', () => {
    const { result } = renderHook(() =>
      useLeadKanban({ leads: mockLeads, onStatusChange: mockOnStatusChange })
    );

    const mockDragStartEvent = {
      dataTransfer: {
        effectAllowed: 'move',
        setData: vi.fn(),
      },
      currentTarget: document.createElement('div'),
    } as unknown as React.DragEvent;

    const mockDragEndEvent = {
      currentTarget: document.createElement('div'),
    } as unknown as React.DragEvent;

    act(() => {
      result.current.handleDragStart(mockDragStartEvent, '1');
    });

    expect(result.current.draggedLead).toBe('1');

    act(() => {
      result.current.handleDragEnd(mockDragEndEvent);
    });

    expect(result.current.draggedLead).toBeNull();
  });
});

