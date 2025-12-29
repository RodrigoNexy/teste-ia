import { GroqService } from './groq.service.js';

export interface LeadAnalysisInput {
  message: string;
  origin: string;
  responseTime?: number;
  interactions: number;
}

export interface LeadAnalysisResult {
  score: number;
  classification: 'Frio' | 'Morno' | 'Quente';
  reason: string;
}

export class GroqLeadAnalysisService {
  private groqService: GroqService;

  constructor() {
    this.groqService = new GroqService();
  }

  async analyzeLead(input: LeadAnalysisInput): Promise<LeadAnalysisResult> {
    const prompt = this.buildAnalysisPrompt(input);

    try {
      const response = await this.groqService.createChatCompletion({
        messages: [
          {
            role: 'system',
            content: `Você é um especialista em análise de leads e vendas. Analise leads e retorne APENAS um JSON válido no formato:
{
  "score": número de 0 a 100,
  "classification": "Frio" ou "Morno" ou "Quente",
  "reason": "explicação detalhada do score em português"
}

Classificação:
- Frio (0-40): Baixa intenção, mensagem genérica, sem urgência
- Morno (41-70): Interesse moderado, algumas informações específicas
- Quente (71-100): Alta intenção, pergunta específica, urgência, orçamento claro

Considere: qualidade da mensagem, origem, tempo de resposta e número de interações.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3,
        max_tokens: 500,
      });

      const result = this.parseAnalysisResponse(response.content);
      return result;
    } catch (error: any) {
      throw new Error(`Erro ao analisar lead: ${error.message}`);
    }
  }

  private buildAnalysisPrompt(input: LeadAnalysisInput): string {
    const { message, origin, responseTime, interactions } = input;

    return `Analise este lead e retorne o JSON com score, classificação e motivo:

MENSAGEM DO LEAD:
"${message}"

ORIGEM: ${origin}
TEMPO DE RESPOSTA: ${responseTime ? `${responseTime} horas` : 'Não informado'}
INTERAÇÕES: ${interactions}

Retorne APENAS o JSON válido, sem markdown, sem código, apenas o JSON.`;
  }

  private parseAnalysisResponse(content: string): LeadAnalysisResult {
    try {
      const cleaned = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      const parsed = JSON.parse(cleaned);

      const score = Math.max(0, Math.min(100, parseInt(parsed.score) || 0));
      const classification = this.normalizeClassification(parsed.classification);
      const reason = parsed.reason || 'Análise realizada com base nas informações fornecidas.';

      return {
        score,
        classification,
        reason,
      };
    } catch (error) {
      return {
        score: 50,
        classification: 'Morno',
        reason: 'Não foi possível analisar automaticamente. Análise manual recomendada.',
      };
    }
  }

  private normalizeClassification(classification: string): 'Frio' | 'Morno' | 'Quente' {
    const normalized = classification?.trim().toLowerCase();
    
    if (normalized?.includes('quente') || normalized?.includes('hot')) {
      return 'Quente';
    }
    if (normalized?.includes('frio') || normalized?.includes('cold')) {
      return 'Frio';
    }
    return 'Morno';
  }
}

