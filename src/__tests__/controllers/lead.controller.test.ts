import { Request, Response } from 'express';
import { LeadController } from '../../controllers/lead.controller.js';
import { LeadService } from '../../services/lead.service.js';

jest.mock('../../services/lead.service.js', () => ({
  LeadService: jest.fn().mockImplementation(() => ({
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    analyzeLead: jest.fn(),
    getStats: jest.fn(),
  })),
}));

describe('LeadController', () => {
  let controller: LeadController;
  let mockLeadService: any;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockLeadService = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      analyzeLead: jest.fn(),
      getStats: jest.fn(),
    };

    (LeadService as jest.Mock).mockImplementation(() => mockLeadService);
    controller = new LeadController();

    mockRequest = {
      params: {},
      body: {},
    };

    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('deve retornar todos os leads', async () => {
      const mockLeads = [{ id: '1', name: 'Lead 1' }];
      mockLeadService.findAll.mockResolvedValue(mockLeads);

      await controller.getAll(mockRequest as Request, mockResponse as Response);

      expect(mockLeadService.findAll).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockLeads);
    });

    it('deve retornar erro 500 em caso de falha', async () => {
      mockLeadService.findAll.mockRejectedValue(new Error('Database error'));

      await controller.getAll(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to fetch leads' });
    });
  });

  describe('getById', () => {
    it('deve retornar um lead pelo ID', async () => {
      const mockLead = { id: '1', name: 'Lead 1' };
      mockRequest.params = { id: '1' };
      mockLeadService.findById.mockResolvedValue(mockLead);

      await controller.getById(mockRequest as Request, mockResponse as Response);

      expect(mockLeadService.findById).toHaveBeenCalledWith('1');
      expect(mockResponse.json).toHaveBeenCalledWith(mockLead);
    });

    it('deve retornar 404 se lead não existir', async () => {
      mockRequest.params = { id: '1' };
      mockLeadService.findById.mockResolvedValue(null);

      await controller.getById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Lead not found' });
    });
  });

  describe('create', () => {
    it('deve criar um lead com dados válidos', async () => {
      const createData = {
        name: 'Novo Lead',
        message: 'Mensagem',
        origin: 'WhatsApp',
      };
      const createdLead = { id: '1', ...createData };

      mockRequest.body = createData;
      mockLeadService.create.mockResolvedValue(createdLead);

      await controller.create(mockRequest as Request, mockResponse as Response);

      expect(mockLeadService.create).toHaveBeenCalledWith(createData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdLead);
    });

    it('deve retornar 400 se campos obrigatórios estiverem faltando', async () => {
      mockRequest.body = { name: 'Lead' }; // falta message e origin

      await controller.create(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Name, message and origin are required',
      });
      expect(mockLeadService.create).not.toHaveBeenCalled();
    });

    it('deve retornar erro 500 em caso de falha', async () => {
      mockRequest.body = {
        name: 'Lead',
        message: 'Mensagem',
        origin: 'WhatsApp',
      };
      mockLeadService.create.mockRejectedValue(new Error('Database error'));

      await controller.create(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Failed to create lead',
        message: 'Database error',
      });
    });
  });

  describe('update', () => {
    it('deve atualizar um lead', async () => {
      const updateData = { name: 'Lead Atualizado' };
      const updatedLead = { id: '1', ...updateData };

      mockRequest.params = { id: '1' };
      mockRequest.body = updateData;
      mockLeadService.update.mockResolvedValue(updatedLead);

      await controller.update(mockRequest as Request, mockResponse as Response);

      expect(mockLeadService.update).toHaveBeenCalledWith('1', updateData);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedLead);
    });

    it('deve retornar 404 se lead não existir', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { name: 'Atualizado' };
      mockLeadService.update.mockResolvedValue(null);

      await controller.update(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Lead not found' });
    });
  });

  describe('delete', () => {
    it('deve deletar um lead', async () => {
      mockRequest.params = { id: '1' };
      mockLeadService.delete.mockResolvedValue(true);

      await controller.delete(mockRequest as Request, mockResponse as Response);

      expect(mockLeadService.delete).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('deve retornar 404 se lead não existir', async () => {
      mockRequest.params = { id: '1' };
      mockLeadService.delete.mockResolvedValue(false);

      await controller.delete(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Lead not found' });
    });
  });

  describe('analyze', () => {
    it('deve analisar um lead', async () => {
      const analyzedLead = { id: '1', score: 85, classification: 'Quente' };
      mockRequest.params = { id: '1' };
      mockLeadService.analyzeLead.mockResolvedValue(analyzedLead);

      await controller.analyze(mockRequest as Request, mockResponse as Response);

      expect(mockLeadService.analyzeLead).toHaveBeenCalledWith('1');
      expect(mockResponse.json).toHaveBeenCalledWith(analyzedLead);
    });

    it('deve retornar 404 se lead não existir', async () => {
      mockRequest.params = { id: '1' };
      const error = new Error('Lead not found');
      mockLeadService.analyzeLead.mockRejectedValue(error);

      await controller.analyze(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Lead not found' });
    });
  });

  describe('getStats', () => {
    it('deve retornar estatísticas', async () => {
      const stats = { total: 100, quente: 30, morno: 50, frio: 20, averageScore: 65 };
      mockLeadService.getStats.mockResolvedValue(stats);

      await controller.getStats(mockRequest as Request, mockResponse as Response);

      expect(mockLeadService.getStats).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(stats);
    });
  });
});

