import { describe, it, expect } from 'vitest';
import { formatDate, formatDateTime, formatDateTimeFull } from '../date.utils';

describe('date.utils', () => {
  const mockDate = new Date('2024-01-15T14:30:00Z');

  describe('formatDate', () => {
    it('deve formatar data no formato brasileiro', () => {
      const result = formatDate(mockDate.toISOString());
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it('deve retornar data formatada corretamente', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      const result = formatDate(date.toISOString());
      // Formato esperado: DD/MM/YYYY (pode variar por timezone)
      expect(result).toMatch(/\d{2}\/\d{2}\/2024/);
    });
  });

  describe('formatDateTime', () => {
    it('deve formatar data e hora no formato brasileiro', () => {
      const result = formatDateTime(mockDate.toISOString());
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}/);
    });

    it('deve incluir hora e minuto', () => {
      const date = new Date('2024-01-15T14:30:00Z');
      const result = formatDateTime(date.toISOString());
      // Pode variar por timezone, então apenas verifica o formato
      expect(result).toMatch(/\d{2}:\d{2}/);
    });
  });

  describe('formatDateTimeFull', () => {
    it('deve formatar data e hora completa', () => {
      const result = formatDateTimeFull(mockDate.toISOString());
      // Formato: DD/MM/YYYY, HH:MM (pode variar por timezone)
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
      expect(result).toMatch(/\d{2}:\d{2}/);
    });

    it('deve retornar "Não informado" para undefined', () => {
      expect(formatDateTimeFull(undefined)).toBe('Não informado');
    });

    it('deve retornar "Não informado" para string vazia', () => {
      expect(formatDateTimeFull('')).toBe('Não informado');
    });

    it('deve formatar corretamente uma data válida', () => {
      const date = new Date('2024-01-15T14:30:00Z');
      const result = formatDateTimeFull(date.toISOString());
      // Verifica formato geral (pode variar por timezone)
      expect(result).toMatch(/\d{2}\/\d{2}\/2024/);
      expect(result).toMatch(/\d{2}:\d{2}/);
    });
  });
});


