import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimePicker } from '../useTimePicker';

describe('useTimePicker', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve inicializar com valores padrão', () => {
    const { result } = renderHook(() =>
      useTimePicker({ value: undefined, onChange: mockOnChange })
    );

    expect(result.current.isOpen).toBe(false);
    expect(result.current.mode).toBe('picker');
    expect(result.current.days).toBe(0);
    expect(result.current.hours).toBe(0);
    expect(result.current.minutes).toBe(0);
  });

  it('deve converter value em horas para dias, horas e minutos', () => {
    // 1 dia + 2 horas + 30 minutos = 26.5 horas
    const { result } = renderHook(() =>
      useTimePicker({ value: 26.5, onChange: mockOnChange })
    );

    expect(result.current.days).toBe(1);
    expect(result.current.hours).toBe(2);
    expect(result.current.minutes).toBe(30);
  });

  it('deve calcular total de horas corretamente', () => {
    const { result } = renderHook(() =>
      useTimePicker({ value: undefined, onChange: mockOnChange })
    );

    const total = result.current.calculateTotalHours(1, 2, 30);
    expect(total).toBe(26.5); // 1 dia (24h) + 2h + 30min (0.5h)
  });

  it('deve atualizar onChange quando picker muda', () => {
    const { result } = renderHook(() =>
      useTimePicker({ value: undefined, onChange: mockOnChange })
    );

    act(() => {
      result.current.handlePickerChange(1, 2, 30);
    });

    expect(mockOnChange).toHaveBeenCalledWith(26.5);
    expect(result.current.days).toBe(1);
    expect(result.current.hours).toBe(2);
    expect(result.current.minutes).toBe(30);
  });

  it('deve chamar onChange com undefined quando total é 0', () => {
    const { result } = renderHook(() =>
      useTimePicker({ value: undefined, onChange: mockOnChange })
    );

    act(() => {
      result.current.handlePickerChange(0, 0, 0);
    });

    expect(mockOnChange).toHaveBeenCalledWith(undefined);
  });

  it('deve converter minutos para horas no modo manual', () => {
    const { result } = renderHook(() =>
      useTimePicker({ value: undefined, onChange: mockOnChange })
    );

    act(() => {
      result.current.setMode('manual');
      result.current.setManualUnit('minutes');
      result.current.setManualValue('120'); // 120 minutos = 2 horas
    });

    expect(mockOnChange).toHaveBeenCalledWith(2);
  });

  it('deve converter horas no modo manual', () => {
    const { result } = renderHook(() =>
      useTimePicker({ value: undefined, onChange: mockOnChange })
    );

    act(() => {
      result.current.setMode('manual');
      result.current.setManualUnit('hours');
      result.current.setManualValue('5');
    });

    expect(mockOnChange).toHaveBeenCalledWith(5);
  });

  it('deve converter dias para horas no modo manual', () => {
    const { result } = renderHook(() =>
      useTimePicker({ value: undefined, onChange: mockOnChange })
    );

    act(() => {
      result.current.setMode('manual');
      result.current.setManualUnit('days');
      result.current.setManualValue('2'); // 2 dias = 48 horas
    });

    expect(mockOnChange).toHaveBeenCalledWith(48);
  });

  it('deve formatar displayValue corretamente', () => {
    const { result } = renderHook(() =>
      useTimePicker({ value: 26.5, onChange: mockOnChange })
    );

    expect(result.current.displayValue).toContain('1 dia');
    expect(result.current.displayValue).toContain('2 horas');
    expect(result.current.displayValue).toContain('30 minutos');
  });

  it('deve limpar valores ao chamar handleClear', () => {
    const { result } = renderHook(() =>
      useTimePicker({ value: 26.5, onChange: mockOnChange })
    );

    const mockEvent = {
      stopPropagation: vi.fn(),
    } as unknown as React.MouseEvent;

    act(() => {
      result.current.handleClear(mockEvent);
    });

    expect(result.current.days).toBe(0);
    expect(result.current.hours).toBe(0);
    expect(result.current.minutes).toBe(0);
    expect(mockOnChange).toHaveBeenCalledWith(undefined);
  });

  it('deve retornar placeholder quando não há valor', () => {
    const { result } = renderHook(() =>
      useTimePicker({ value: undefined, onChange: mockOnChange, placeholder: 'Custom placeholder' })
    );

    expect(result.current.displayValue).toBe('Custom placeholder');
  });
});


