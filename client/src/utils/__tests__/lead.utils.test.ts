import { describe, it, expect } from 'vitest';
import {
  getClassificationColor,
  getScoreColor,
  getStatusColor,
  formatResponseTime,
  formatResponseTimeDetailed,
} from '../lead.utils';

describe('lead.utils', () => {
  describe('getClassificationColor', () => {
    it('deve retornar cor verde para Quente', () => {
      expect(getClassificationColor('Quente')).toBe('bg-green-100 text-green-800 border-green-300');
    });

    it('deve retornar cor amarela para Morno', () => {
      expect(getClassificationColor('Morno')).toBe('bg-yellow-100 text-yellow-800 border-yellow-300');
    });

    it('deve retornar cor vermelha para Frio', () => {
      expect(getClassificationColor('Frio')).toBe('bg-red-100 text-red-800 border-red-300');
    });

    it('deve retornar cor cinza para classificação desconhecida', () => {
      expect(getClassificationColor('Desconhecido')).toBe('bg-gray-100 text-gray-800 border-gray-300');
      expect(getClassificationColor(undefined)).toBe('bg-gray-100 text-gray-800 border-gray-300');
    });
  });

  describe('getScoreColor', () => {
    it('deve retornar cor verde para score >= 71', () => {
      expect(getScoreColor(85)).toBe('text-green-600 font-bold');
      expect(getScoreColor(71)).toBe('text-green-600 font-bold');
      expect(getScoreColor(100)).toBe('text-green-600 font-bold');
    });

    it('deve retornar cor amarela para score entre 41 e 70', () => {
      expect(getScoreColor(50)).toBe('text-yellow-600 font-semibold');
      expect(getScoreColor(41)).toBe('text-yellow-600 font-semibold');
      expect(getScoreColor(70)).toBe('text-yellow-600 font-semibold');
    });

    it('deve retornar cor vermelha para score <= 40', () => {
      expect(getScoreColor(30)).toBe('text-red-600');
      expect(getScoreColor(40)).toBe('text-red-600');
      expect(getScoreColor(0)).toBe('text-red-600');
    });

    it('deve retornar cor cinza para score undefined', () => {
      expect(getScoreColor(undefined)).toBe('text-gray-500');
    });
  });

  describe('getStatusColor', () => {
    it('deve retornar cor azul para em_atendimento', () => {
      expect(getStatusColor('em_atendimento')).toBe('bg-blue-100 text-blue-800');
    });

    it('deve retornar cor verde para finalizado', () => {
      expect(getStatusColor('finalizado')).toBe('bg-green-100 text-green-800');
    });

    it('deve retornar cor vermelha para travado', () => {
      expect(getStatusColor('travado')).toBe('bg-red-100 text-red-800');
    });

    it('deve retornar cor cinza para status desconhecido', () => {
      expect(getStatusColor('desconhecido')).toBe('bg-gray-100 text-gray-800');
    });
  });

  describe('formatResponseTime', () => {
    it('deve formatar apenas minutos quando < 60', () => {
      expect(formatResponseTime(0.5)).toBe('30min'); // 0.5 horas = 30 minutos
      expect(formatResponseTime(0.25)).toBe('15min');
      expect(formatResponseTime(0)).toBe('0min');
    });

    it('deve formatar horas quando não há minutos', () => {
      expect(formatResponseTime(1)).toBe('1h');
      expect(formatResponseTime(2)).toBe('2h');
    });

    it('deve formatar horas e minutos', () => {
      expect(formatResponseTime(1.5)).toBe('1h 30min');
      expect(formatResponseTime(2.25)).toBe('2h 15min');
    });

    it('deve retornar "-" para valores undefined/null', () => {
      expect(formatResponseTime(undefined)).toBe('-');
    });
  });

  describe('formatResponseTimeDetailed', () => {
    it('deve formatar apenas minutos quando < 60', () => {
      expect(formatResponseTimeDetailed(0.5)).toBe('30 minutos');
      expect(formatResponseTimeDetailed(0.25)).toBe('15 minutos');
      expect(formatResponseTimeDetailed(0)).toBe('0 minutos');
    });

    it('deve formatar horas no singular', () => {
      expect(formatResponseTimeDetailed(1)).toBe('1 hora');
    });

    it('deve formatar horas no plural', () => {
      expect(formatResponseTimeDetailed(2)).toBe('2 horas');
    });

    it('deve formatar horas e minutos', () => {
      expect(formatResponseTimeDetailed(1.5)).toBe('1h 30min');
      expect(formatResponseTimeDetailed(2.25)).toBe('2h 15min');
    });

    it('deve retornar "Não informado" para valores undefined/null', () => {
      expect(formatResponseTimeDetailed(undefined)).toBe('Não informado');
    });
  });
});


