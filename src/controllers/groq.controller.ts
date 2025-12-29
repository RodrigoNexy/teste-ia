import { Request, Response } from 'express';
import { GroqService } from '../services/groq.service.js';

export class GroqController {
  private groqService: GroqService;

  constructor() {
    this.groqService = new GroqService();
  }

  async chatCompletion(req: Request, res: Response): Promise<void> {
    try {
      const { messages, model, temperature, max_tokens } = req.body;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({ 
          error: 'Messages é obrigatório e deve ser um array não vazio' 
        });
        return;
      }

      const result = await this.groqService.createChatCompletion({
        messages,
        model,
        temperature,
        max_tokens,
      });

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ 
        error: 'Erro ao processar requisição',
        message: error.message 
      });
    }
  }

  async simpleCompletion(req: Request, res: Response): Promise<void> {
    try {
      const { prompt, model } = req.body;

      if (!prompt || typeof prompt !== 'string') {
        res.status(400).json({ 
          error: 'Prompt é obrigatório e deve ser uma string' 
        });
        return;
      }

      const result = await this.groqService.createSimpleCompletion(prompt, model);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ 
        error: 'Erro ao processar requisição',
        message: error.message 
      });
    }
  }
}

