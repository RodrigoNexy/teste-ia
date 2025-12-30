import { GroqLeadAnalysisService, LeadAnalysisInput } from '../../services/groq-lead-analysis.service.js';
import { GroqService } from '../../services/groq.service.js';

jest.mock('../../services/groq.service.js', () => ({
  GroqService: jest.fn().mockImplementation(() => ({
    createChatCompletion: jest.fn(),
  })),
}));

describe('GroqLeadAnalysisService', () => {
  let analysisService: GroqLeadAnalysisService;
  let mockGroqService: any;

  beforeEach(() => {
    mockGroqService = {
      createChatCompletion: jest.fn(),
    };

    (GroqService as jest.Mock).mockImplementation(() => mockGroqService);
    analysisService = new GroqLeadAnalysisService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('analyzeLead', () => {
    it('deve analisar um lead e retornar resultado válido', async () => {
      const input: LeadAnalysisInput = {
        message: 'Gostaria de saber mais sobre o produto',
        origin: 'WhatsApp',
        responseTime: 2,
        interactions: 1,
      };

      const mockResponse = {
        content: JSON.stringify({
          score: 85,
          classification: 'Quente',
          reason: 'Lead demonstra alto interesse',
        }),
      };

      mockGroqService.createChatCompletion.mockResolvedValue(mockResponse);

      const result = await analysisService.analyzeLead(input);

      expect(result).toEqual({
        score: 85,
        classification: 'Quente',
        reason: 'Lead demonstra alto interesse',
      });
      expect(mockGroqService.createChatCompletion).toHaveBeenCalled();
    });

    it('deve normalizar classificação corretamente', async () => {
      const input: LeadAnalysisInput = {
        message: 'Teste',
        origin: 'Formulário',
        interactions: 0,
      };

      const testCases = [
        { input: 'Quente', expected: 'Quente' },
        { input: 'quente', expected: 'Quente' },
        { input: 'HOT', expected: 'Quente' },
        { input: 'Frio', expected: 'Frio' },
        { input: 'frio', expected: 'Frio' },
        { input: 'COLD', expected: 'Frio' },
        { input: 'Morno', expected: 'Morno' },
        { input: 'outro', expected: 'Morno' },
      ];

      for (const testCase of testCases) {
        mockGroqService.createChatCompletion.mockResolvedValue({
          content: JSON.stringify({
            score: 50,
            classification: testCase.input,
            reason: 'Teste',
          }),
        });

        const result = await analysisService.analyzeLead(input);
        expect(result.classification).toBe(testCase.expected);
      }
    });

    it('deve limitar score entre 0 e 100', async () => {
      const input: LeadAnalysisInput = {
        message: 'Teste',
        origin: 'Formulário',
        interactions: 0,
      };

      const testCases = [
        { score: -10, expected: 0 },
        { score: 150, expected: 100 },
        { score: 75, expected: 75 },
      ];

      for (const testCase of testCases) {
        mockGroqService.createChatCompletion.mockResolvedValue({
          content: JSON.stringify({
            score: testCase.score,
            classification: 'Morno',
            reason: 'Teste',
          }),
        });

        const result = await analysisService.analyzeLead(input);
        expect(result.score).toBe(testCase.expected);
      }
    });

    it('deve retornar resultado padrão se parsing falhar', async () => {
      const input: LeadAnalysisInput = {
        message: 'Teste',
        origin: 'Formulário',
        interactions: 0,
      };

      mockGroqService.createChatCompletion.mockResolvedValue({
        content: 'Resposta inválida não JSON',
      });

      const result = await analysisService.analyzeLead(input);

      expect(result).toEqual({
        score: 50,
        classification: 'Morno',
        reason: 'Não foi possível analisar automaticamente. Análise manual recomendada.',
      });
    });

    it('deve limpar markdown do JSON', async () => {
      const input: LeadAnalysisInput = {
        message: 'Teste',
        origin: 'Formulário',
        interactions: 0,
      };

      mockGroqService.createChatCompletion.mockResolvedValue({
        content: '```json\n{"score": 80, "classification": "Quente", "reason": "Teste"}\n```',
      });

      const result = await analysisService.analyzeLead(input);

      expect(result.score).toBe(80);
      expect(result.classification).toBe('Quente');
    });

    it('deve construir prompt corretamente', async () => {
      const input: LeadAnalysisInput = {
        message: 'Mensagem do lead',
        origin: 'WhatsApp',
        responseTime: 2,
        interactions: 3,
      };

      mockGroqService.createChatCompletion.mockResolvedValue({
        content: JSON.stringify({
          score: 70,
          classification: 'Morno',
          reason: 'Teste',
        }),
      });

      await analysisService.analyzeLead(input);

      const callArgs = mockGroqService.createChatCompletion.mock.calls[0][0];
      expect(callArgs.messages[1].content).toContain('Mensagem do lead');
      expect(callArgs.messages[1].content).toContain('WhatsApp');
      expect(callArgs.messages[1].content).toContain('2 horas');
      expect(callArgs.messages[1].content).toContain('3');
    });
  });
});


