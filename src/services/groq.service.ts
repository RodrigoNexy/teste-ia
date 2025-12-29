import Groq from 'groq-sdk';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatCompletionRequest {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export class GroqService {
  private client: Groq;

  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      throw new Error('GROQ_API_KEY não configurada no ambiente');
    }

    this.client = new Groq({
      apiKey,
    });
  }

  async createChatCompletion(request: ChatCompletionRequest) {
    const {
      messages,
      model = 'llama-3.3-70b-versatile',
      temperature = 0.7,
      max_tokens = 1024,
    } = request;

    try {
      const completion = await this.client.chat.completions.create({
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        model,
        temperature,
        max_tokens,
      });

      return {
        content: completion.choices[0]?.message?.content || '',
        model: completion.model,
        usage: completion.usage,
      };
    } catch (error: any) {
      throw new Error(`Erro ao chamar Groq API: ${error.message}`);
    }
  }

  async createSimpleCompletion(prompt: string, model?: string) {
    return this.createChatCompletion({
      messages: [{ role: 'user', content: prompt }],
      model,
    });
  }
}

