import { Request, Response } from 'express';
import { GroqController } from '../../controllers/groq.controller.js';
import { GroqService } from '../../services/groq.service.js';

jest.mock('../../services/groq.service.js', () => ({
  GroqService: jest.fn().mockImplementation(() => ({
    createChatCompletion: jest.fn(),
    createSimpleCompletion: jest.fn(),
  })),
}));

describe('GroqController', () => {
  let controller: GroqController;
  let mockGroqService: any;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockGroqService = {
      createChatCompletion: jest.fn(),
      createSimpleCompletion: jest.fn(),
    };

    (GroqService as jest.Mock).mockImplementation(() => mockGroqService);
    controller = new GroqController();

    mockRequest = {
      body: {},
    };

    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('chatCompletion', () => {
    it('deve criar chat completion', async () => {
      const requestData = {
        messages: [{ role: 'user', content: 'Olá!' }],
        model: 'llama-3.3-70b-versatile',
      };

      const mockServiceResponse = {
        content: 'Resposta da IA',
        model: 'llama-3.3-70b-versatile',
      };

      mockRequest.body = requestData;
      mockGroqService.createChatCompletion.mockResolvedValue(mockServiceResponse);

      await controller.chatCompletion(mockRequest as Request, mockResponse as Response);

      expect(mockGroqService.createChatCompletion).toHaveBeenCalledWith(requestData);
      expect(mockResponse.json).toHaveBeenCalledWith(mockServiceResponse);
    });

    it('deve retornar 400 se messages não for fornecido', async () => {
      mockRequest.body = {};

      await controller.chatCompletion(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Messages é obrigatório e deve ser um array não vazio',
      });
    });
  });

  describe('simpleCompletion', () => {
    it('deve criar simple completion', async () => {
      const requestData = {
        prompt: 'Explique TypeScript',
        model: 'llama-3.3-70b-versatile',
      };

      const mockServiceResponse = {
        content: 'TypeScript é...',
      };

      mockRequest.body = requestData;
      mockGroqService.createSimpleCompletion.mockResolvedValue(mockServiceResponse);

      await controller.simpleCompletion(mockRequest as Request, mockResponse as Response);

      expect(mockGroqService.createSimpleCompletion).toHaveBeenCalledWith(
        requestData.prompt,
        requestData.model
      );
      expect(mockResponse.json).toHaveBeenCalledWith(mockServiceResponse);
    });

    it('deve retornar 400 se prompt não for fornecido', async () => {
      mockRequest.body = {};

      await controller.simpleCompletion(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Prompt é obrigatório e deve ser uma string',
      });
    });
  });
});

