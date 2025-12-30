import { useState, useEffect, useRef } from 'react';

interface UseTimePickerProps {
  value?: number; // valor em horas
  onChange: (hours: number | undefined) => void;
  placeholder?: string;
}

export function useTimePicker({ value, onChange, placeholder = 'Selecione o tempo' }: UseTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'picker' | 'manual'>('picker');
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [manualValue, setManualValue] = useState('');
  const [manualUnit, setManualUnit] = useState<'minutes' | 'hours' | 'days'>('hours');
  const [opensUpward, setOpensUpward] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value !== undefined && value !== null && value > 0) {
      const totalMinutes = Math.round(value * 60);
      setDays(Math.floor(totalMinutes / (24 * 60)));
      const remainingMinutes = totalMinutes % (24 * 60);
      setHours(Math.floor(remainingMinutes / 60));
      setMinutes(remainingMinutes % 60);
    } else {
      setDays(0);
      setHours(0);
      setMinutes(0);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const calculatePosition = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownHeight = 500;
        setOpensUpward(spaceBelow < dropdownHeight && spaceAbove > spaceBelow);
      }
    };

    if (isOpen) {
      calculatePosition();
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('resize', calculatePosition);
      window.addEventListener('scroll', calculatePosition, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition, true);
    };
  }, [isOpen]);

  const calculateTotalHours = (d: number, h: number, m: number) => {
    return d * 24 + h + m / 60;
  };

  const handlePickerChange = (newDays: number, newHours: number, newMinutes: number) => {
    setDays(newDays);
    setHours(newHours);
    setMinutes(newMinutes);
    const totalHours = calculateTotalHours(newDays, newHours, newMinutes);
    onChange(totalHours > 0 ? totalHours : undefined);
  };

  const handleManualChange = () => {
    const numValue = parseFloat(manualValue);
    if (isNaN(numValue) || numValue <= 0) {
      onChange(undefined);
      return;
    }

    let totalHours = 0;
    switch (manualUnit) {
      case 'minutes':
        totalHours = numValue / 60;
        break;
      case 'hours':
        totalHours = numValue;
        break;
      case 'days':
        totalHours = numValue * 24;
        break;
    }

    onChange(totalHours);

    const totalMinutes = Math.round(totalHours * 60);
    setDays(Math.floor(totalMinutes / (24 * 60)));
    const remainingMinutes = totalMinutes % (24 * 60);
    setHours(Math.floor(remainingMinutes / 60));
    setMinutes(remainingMinutes % 60);
  };

  useEffect(() => {
    if (mode === 'manual' && manualValue) {
      handleManualChange();
    }
  }, [manualValue, manualUnit]);

  const formatDisplayValue = () => {
    const currentValue = mode === 'picker' ? calculateTotalHours(days, hours, minutes) : value || 0;

    if (currentValue === undefined || currentValue === null || currentValue <= 0) {
      if (mode === 'picker' && (days > 0 || hours > 0 || minutes > 0)) {
        const localTotal = calculateTotalHours(days, hours, minutes);
        if (localTotal > 0) {
          const totalMinutes = Math.round(localTotal * 60);
          const d = Math.floor(totalMinutes / (24 * 60));
          const remainingMinutes = totalMinutes % (24 * 60);
          const h = Math.floor(remainingMinutes / 60);
          const m = remainingMinutes % 60;

          const parts: string[] = [];
          if (d > 0) parts.push(`${d} ${d === 1 ? 'dia' : 'dias'}`);
          if (h > 0) parts.push(`${h} ${h === 1 ? 'hora' : 'horas'}`);
          if (m > 0) parts.push(`${m} ${m === 1 ? 'minuto' : 'minutos'}`);

          return parts.length > 0 ? parts.join(', ') : placeholder;
        }
      }
      return placeholder;
    }

    const totalMinutes = Math.round(currentValue * 60);
    if (totalMinutes === 0) {
      return placeholder;
    }

    const d = Math.floor(totalMinutes / (24 * 60));
    const remainingMinutes = totalMinutes % (24 * 60);
    const h = Math.floor(remainingMinutes / 60);
    const m = remainingMinutes % 60;

    const parts: string[] = [];
    if (d > 0) parts.push(`${d} ${d === 1 ? 'dia' : 'dias'}`);
    if (h > 0) parts.push(`${h} ${h === 1 ? 'hora' : 'horas'}`);
    if (m > 0) parts.push(`${m} ${m === 1 ? 'minuto' : 'minutos'}`);

    return parts.length > 0 ? parts.join(', ') : placeholder;
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDays(0);
    setHours(0);
    setMinutes(0);
    setManualValue('');
    onChange(undefined);
  };

  return {
    // State
    isOpen,
    mode,
    days,
    hours,
    minutes,
    manualValue,
    manualUnit,
    opensUpward,
    containerRef,
    // Setters
    setIsOpen,
    setMode,
    setDays,
    setHours,
    setMinutes,
    setManualValue,
    setManualUnit,
    // Computed
    displayValue: formatDisplayValue(),
    // Actions
    handlePickerChange,
    handleManualChange,
    handleClear,
    calculateTotalHours,
  };
}

