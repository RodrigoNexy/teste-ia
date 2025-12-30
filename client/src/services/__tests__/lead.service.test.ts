import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { LeadService } from '../lead.service';
import type { Lead } from '../../types/lead.types';

vi.mock('axios');
const mockedAxios = axios as any;

describe('LeadService', () => {
  let leadService: LeadService;

  beforeEach(() => {
    leadService = new LeadService();
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('deve buscar todos os leads', async () => {
      const mockLeads: Lead[] = [
        { id: '1', name: 'Lead 1', message: 'Teste', origin: 'WhatsApp', status: 'em_atendimento', interactions: 0, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
      ];

      mockedAxios.get.mockResolvedValue({ data: mockLeads });

      const result = await leadService.getAll();

      expect(result).toEqual(mockLeads);
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/leads');
    });
  });

  describe('getById', () => {
    it('deve buscar lead por ID', async () => {
      const mockLead: Lead = {
        id: '1',
        name: 'Lead 1',
        message: 'Teste',
        origin: 'WhatsApp',
        status: 'em_atendimento',
        interactions: 0,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockedAxios.get.mockResolvedValue({ data: mockLead });

      const result = await leadService.getById('1');

      expect(result).toEqual(mockLead);
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/leads/1');
    });
  });

  describe('create', () => {
    it('deve criar um novo lead', async () => {
      const createData = {
        name: 'Novo Lead',
        message: 'Mensagem',
        origin: 'WhatsApp',
      };

      const createdLead: Lead = {
        id: '1',
        ...createData,
        status: 'em_atendimento',
        interactions: 0,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockedAxios.post.mockResolvedValue({ data: createdLead });

      const result = await leadService.create(createData);

      expect(result).toEqual(createdLead);
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/leads', createData);
    });
  });

  describe('update', () => {
    it('deve atualizar um lead', async () => {
      const updateData = { name: 'Lead Atualizado' };
      const updatedLead: Lead = {
        id: '1',
        name: 'Lead Atualizado',
        message: 'Mensagem',
        origin: 'WhatsApp',
        status: 'em_atendimento',
        interactions: 0,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockedAxios.put.mockResolvedValue({ data: updatedLead });

      const result = await leadService.update('1', updateData);

      expect(result).toEqual(updatedLead);
      expect(mockedAxios.put).toHaveBeenCalledWith('/api/leads/1', updateData);
    });
  });

  describe('delete', () => {
    it('deve deletar um lead', async () => {
      mockedAxios.delete.mockResolvedValue({ status: 204 });

      await leadService.delete('1');

      expect(mockedAxios.delete).toHaveBeenCalledWith('/api/leads/1');
    });
  });

  describe('analyze', () => {
    it('deve analisar um lead', async () => {
      const analyzedLead: Lead = {
        id: '1',
        name: 'Lead',
        message: 'Mensagem',
        origin: 'WhatsApp',
        status: 'em_atendimento',
        score: 85,
        classification: 'Quente',
        interactions: 0,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      mockedAxios.post.mockResolvedValue({ data: analyzedLead });

      const result = await leadService.analyze('1');

      expect(result).toEqual(analyzedLead);
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/leads/1/analyze');
    });
  });

  describe('getStats', () => {
    it('deve buscar estatísticas', async () => {
      const mockStats = {
        total: 100,
        quente: 30,
        morno: 50,
        frio: 20,
        averageScore: 65,
      };

      mockedAxios.get.mockResolvedValue({ data: mockStats });

      const result = await leadService.getStats();

      expect(result).toEqual(mockStats);
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/leads/stats');
    });
  });
});

