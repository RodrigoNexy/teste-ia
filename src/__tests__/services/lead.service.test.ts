import { LeadService } from '../../services/lead.service.js';
import { GroqLeadAnalysisService } from '../../services/groq-lead-analysis.service.js';
import { PrismaClient } from '@prisma/client';

// Mock do Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    lead: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
    },
  })),
}));

// Mock do GroqLeadAnalysisService
jest.mock('../../services/groq-lead-analysis.service.js', () => ({
  GroqLeadAnalysisService: jest.fn().mockImplementation(() => ({
    analyzeLead: jest.fn(),
  })),
}));

describe('LeadService', () => {
  let leadService: LeadService;
  let mockPrisma: any;
  let mockAnalysisService: any;

  beforeEach(() => {
    mockPrisma = {
      lead: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
        aggregate: jest.fn(),
      },
    };

    mockAnalysisService = {
      analyzeLead: jest.fn(),
    };

    (PrismaClient as jest.Mock).mockImplementation(() => mockPrisma);
    (GroqLeadAnalysisService as jest.Mock).mockImplementation(() => mockAnalysisService);

    leadService = new LeadService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('deve retornar todos os leads ordenados por score', async () => {
      const mockLeads = [
        { id: '1', name: 'Lead 1', score: 90 },
        { id: '2', name: 'Lead 2', score: 70 },
      ];

      mockPrisma.lead.findMany.mockResolvedValue(mockLeads);

      const result = await leadService.findAll();

      expect(result).toEqual(mockLeads);
      expect(mockPrisma.lead.findMany).toHaveBeenCalledWith({
        orderBy: [
          { score: 'desc' },
          { createdAt: 'desc' },
        ],
      });
    });
  });

  describe('findById', () => {
    it('deve retornar um lead pelo ID', async () => {
      const mockLead = { id: '1', name: 'Lead 1' };
      mockPrisma.lead.findUnique.mockResolvedValue(mockLead);

      const result = await leadService.findById('1');

      expect(result).toEqual(mockLead);
      expect(mockPrisma.lead.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('create', () => {
    it('deve criar um lead e analisá-lo automaticamente', async () => {
      const createData = {
        name: 'Novo Lead',
        message: 'Mensagem teste',
        origin: 'WhatsApp',
        interactions: 1,
      };

      const createdLead = { id: '1', ...createData, status: 'em_atendimento', responseTime: null };
      const analyzedLead = { ...createdLead, score: 85, classification: 'Quente', scoreReason: 'Lead com alto interesse', analyzedAt: expect.any(Date) };

      mockPrisma.lead.create.mockResolvedValue(createdLead);
      mockPrisma.lead.update.mockResolvedValue(analyzedLead);
      // Primeira chamada: analyzeLead busca o lead
      // Segunda chamada: create retorna o lead analisado
      mockPrisma.lead.findUnique
        .mockResolvedValueOnce(createdLead) // Para analyzeLead buscar o lead
        .mockResolvedValueOnce(analyzedLead); // Para create retornar o lead analisado
      mockAnalysisService.analyzeLead.mockResolvedValue({
        score: 85,
        classification: 'Quente',
        reason: 'Lead com alto interesse',
      });

      const result = await leadService.create(createData);

      expect(mockPrisma.lead.create).toHaveBeenCalled();
      expect(mockAnalysisService.analyzeLead).toHaveBeenCalledWith({
        message: 'Mensagem teste',
        origin: 'WhatsApp',
        responseTime: undefined,
        interactions: 1,
      });
      expect(result).toEqual(analyzedLead);
    });

    it('deve usar valores padrão para interactions e status', async () => {
      const createData = {
        name: 'Novo Lead',
        message: 'Mensagem teste',
        origin: 'WhatsApp',
      };

      const createdLead = { id: '1', ...createData, interactions: 0, status: 'em_atendimento' };
      mockPrisma.lead.create.mockResolvedValue(createdLead);
      mockPrisma.lead.findUnique.mockResolvedValue(createdLead);
      mockAnalysisService.analyzeLead.mockResolvedValue({
        score: 50,
        classification: 'Morno',
        reason: 'Análise padrão',
      });

      await leadService.create(createData);

      expect(mockPrisma.lead.create).toHaveBeenCalledWith({
        data: {
          ...createData,
          interactions: 0,
          status: 'em_atendimento',
        },
      });
    });
  });

  describe('update', () => {
    it('deve atualizar um lead', async () => {
      const updateData = { name: 'Lead Atualizado' };
      const updatedLead = { id: '1', name: 'Lead Atualizado' };

      mockPrisma.lead.update.mockResolvedValue(updatedLead);
      mockPrisma.lead.findUnique.mockResolvedValue(updatedLead);

      const result = await leadService.update('1', updateData);

      expect(mockPrisma.lead.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
      });
      expect(result).toEqual(updatedLead);
    });

    it('deve re-analisar se message ou interactions mudarem', async () => {
      const updateData = { message: 'Nova mensagem', interactions: 2 };
      const existingLead = { id: '1', message: 'Nova mensagem', origin: 'WhatsApp', interactions: 2, responseTime: null };
      const analyzedLead = { ...existingLead, score: 75, classification: 'Quente', scoreReason: 'Nova análise', analyzedAt: expect.any(Date) };
      const updatedLead = { ...analyzedLead };

      // Primeira chamada: update atualiza os dados
      // Segunda chamada: analyzeLead atualiza com os resultados da análise
      mockPrisma.lead.update
        .mockResolvedValueOnce(existingLead) // Para update atualizar os dados
        .mockResolvedValueOnce(analyzedLead); // Para analyzeLead atualizar com análise
      // Primeira chamada: analyzeLead busca o lead
      // Segunda chamada: update retorna o lead atualizado
      mockPrisma.lead.findUnique
        .mockResolvedValueOnce(existingLead) // Para analyzeLead buscar o lead
        .mockResolvedValueOnce(updatedLead); // Para update retornar o lead atualizado
      mockAnalysisService.analyzeLead.mockResolvedValue({
        score: 75,
        classification: 'Quente',
        reason: 'Nova análise',
      });

      await leadService.update('1', updateData);

      expect(mockAnalysisService.analyzeLead).toHaveBeenCalledWith({
        message: 'Nova mensagem',
        origin: 'WhatsApp',
        responseTime: undefined,
        interactions: 2,
      });
    });

    it('não deve re-analisar se apenas outros campos mudarem', async () => {
      const updateData = { name: 'Novo Nome' };
      const updatedLead = { id: '1', ...updateData };

      mockPrisma.lead.update.mockResolvedValue(updatedLead);
      mockPrisma.lead.findUnique.mockResolvedValue(updatedLead);

      await leadService.update('1', updateData);

      expect(mockAnalysisService.analyzeLead).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('deve deletar um lead existente', async () => {
      mockPrisma.lead.delete.mockResolvedValue({ id: '1' });

      const result = await leadService.delete('1');

      expect(result).toBe(true);
      expect(mockPrisma.lead.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('deve retornar false se lead não existir', async () => {
      const error = new Error('Not found');
      (error as any).code = 'P2025';
      mockPrisma.lead.delete.mockRejectedValue(error);

      const result = await leadService.delete('1');

      expect(result).toBe(false);
    });
  });

  describe('analyzeLead', () => {
    it('deve analisar um lead e atualizar com os resultados', async () => {
      const lead = {
        id: '1',
        message: 'Mensagem teste',
        origin: 'WhatsApp',
        responseTime: 2,
        interactions: 1,
      };

      const analysisResult = {
        score: 85,
        classification: 'Quente' as const,
        reason: 'Lead com alto interesse',
      };

      mockPrisma.lead.findUnique.mockResolvedValue(lead);
      mockAnalysisService.analyzeLead.mockResolvedValue(analysisResult);
      mockPrisma.lead.update.mockResolvedValue({
        ...lead,
        ...analysisResult,
        analyzedAt: new Date(),
      });

      const result = await leadService.analyzeLead('1');

      expect(result).toEqual({
        ...lead,
        ...analysisResult,
        analyzedAt: expect.any(Date),
      });
      expect(mockAnalysisService.analyzeLead).toHaveBeenCalledWith({
        message: lead.message,
        origin: lead.origin,
        responseTime: lead.responseTime,
        interactions: lead.interactions,
      });
      expect(mockPrisma.lead.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          score: analysisResult.score,
          classification: analysisResult.classification,
          scoreReason: analysisResult.reason,
          analyzedAt: expect.any(Date),
        },
      });
    });

    it('deve lançar erro se lead não existir', async () => {
      mockPrisma.lead.findUnique.mockResolvedValue(null);

      await expect(leadService.analyzeLead('1')).rejects.toThrow('Lead não encontrado');
    });
  });

  describe('getStats', () => {
    it('deve retornar estatísticas corretas', async () => {
      mockPrisma.lead.count
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(30)  // quente
        .mockResolvedValueOnce(50)  // morno
        .mockResolvedValueOnce(20); // frio

      mockPrisma.lead.aggregate.mockResolvedValue({
        _avg: { score: 65 },
      });

      const result = await leadService.getStats();

      expect(result).toEqual({
        total: 100,
        quente: 30,
        morno: 50,
        frio: 20,
        averageScore: 65,
      });
    });

    it('deve retornar averageScore 0 se não houver leads', async () => {
      mockPrisma.lead.count.mockResolvedValue(0);

      const result = await leadService.getStats();

      expect(result.averageScore).toBe(0);
      expect(mockPrisma.lead.aggregate).not.toHaveBeenCalled();
    });
  });
});


