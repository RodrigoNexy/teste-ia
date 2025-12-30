import React from 'react';
import { ChevronDown, X } from 'lucide-react';
import { useTimePicker } from '../hooks/useTimePicker';

interface TimePickerProps {
  value?: number; // valor em horas
  onChange: (hours: number | undefined) => void;
  placeholder?: string;
}

export function TimePicker({ value, onChange, placeholder = 'Selecione o tempo' }: TimePickerProps) {
  const {
    isOpen,
    mode,
    days,
    hours,
    minutes,
    manualValue,
    manualUnit,
    opensUpward,
    containerRef,
    displayValue,
    setIsOpen,
    setMode,
    setDays,
    setHours,
    setMinutes,
    setManualValue,
    setManualUnit,
    handlePickerChange,
    handleManualChange,
    handleClear,
    calculateTotalHours,
  } = useTimePicker({ value, onChange, placeholder });

  return (
    <div ref={containerRef} className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white hover:border-gray-400 flex items-center justify-between"
      >
        <span className={(value && value > 0) || (mode === 'picker' && (days > 0 || hours > 0 || minutes > 0)) ? 'text-gray-900' : 'text-gray-500'}>
          {displayValue}
        </span>
        <div className="flex items-center gap-2">
          {value && value > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isOpen && (
        <div className={`absolute z-50 bg-white border border-gray-300 rounded-md shadow-lg p-4 w-full min-w-[400px] max-w-[500px] ${opensUpward ? 'bottom-full mb-1' : 'top-full mt-1'
          }`}>
          <div className="space-y-4">
            {/* Tabs para escolher modo */}
            <div className="flex gap-2 border-b border-gray-200">
              <button
                type="button"
                onClick={() => setMode('picker')}
                className={`px-4 py-2 text-sm font-medium ${mode === 'picker'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Selecionar
              </button>
              <button
                type="button"
                onClick={() => setMode('manual')}
                className={`px-4 py-2 text-sm font-medium ${mode === 'manual'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Manual
              </button>
            </div>

            {mode === 'picker' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dias
                  </label>
                  <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                    {Array.from({ length: 31 }, (_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handlePickerChange(i, hours, minutes)}
                        className={`px-2 py-1 text-xs rounded ${days === i
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horas
                  </label>
                  <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                    {Array.from({ length: 24 }, (_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handlePickerChange(days, i, minutes)}
                        className={`px-2 py-1 text-xs rounded ${hours === i
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {i}h
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minutos
                  </label>
                  <div className="grid grid-cols-10 gap-1 max-h-48 overflow-y-auto">
                    {Array.from({ length: 60 }, (_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handlePickerChange(days, hours, i)}
                        className={`px-2 py-1 text-xs rounded ${minutes === i
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {i}m
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={manualValue}
                    onChange={(e) => setManualValue(e.target.value)}
                    placeholder="Ex: 10, 1.5, 30"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unidade
                  </label>
                  <select
                    value={manualUnit}
                    onChange={(e) => setManualUnit(e.target.value as 'minutes' | 'hours' | 'days')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="minutes">Minutos</option>
                    <option value="hours">Horas</option>
                    <option value="days">Dias</option>
                  </select>
                </div>
              </div>
            )}

            {(() => {
              const currentTotalHours = mode === 'picker'
                ? calculateTotalHours(days, hours, minutes)
                : (value || 0);

              if (currentTotalHours <= 0) return null;

              const totalMinutes = Math.round(currentTotalHours * 60);
              const d = Math.floor(totalMinutes / (24 * 60));
              const remainingMinutes = totalMinutes % (24 * 60);
              const h = Math.floor(remainingMinutes / 60);
              const m = remainingMinutes % 60;

              const parts: string[] = [];
              if (d > 0) parts.push(`${d} ${d === 1 ? 'dia' : 'dias'}`);
              if (h > 0) parts.push(`${h} ${h === 1 ? 'hora' : 'horas'}`);
              if (m > 0) parts.push(`${m} ${m === 1 ? 'minuto' : 'minutos'}`);

              return (
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>Total:</strong> {parts.length > 0 ? parts.join(', ') : '0 minutos'}
                  </p>
                </div>
              );
            })()}

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
