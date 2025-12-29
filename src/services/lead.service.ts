import { PrismaClient } from '@prisma/client';
import { GroqLeadAnalysisService, LeadAnalysisInput } from './groq-lead-analysis.service.js';

export type LeadStatus = 'em_atendimento' | 'finalizado' | 'travado';

export interface CreateLeadDto {
  name: string;
  email?: string;
  phone?: string;
  message: string;
  origin: string;
  responseTime?: number;
  interactions?: number;
  status?: LeadStatus;
}

export interface UpdateLeadDto {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  origin?: string;
  responseTime?: number;
  interactions?: number;
  status?: LeadStatus;
}

export class LeadService {
  private prisma: PrismaClient;
  private analysisService: GroqLeadAnalysisService;

  constructor() {
    this.prisma = new PrismaClient();
    this.analysisService = new GroqLeadAnalysisService();
  }

  async findAll() {
    return this.prisma.lead.findMany({
      orderBy: [
        { score: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findById(id: string) {
    return this.prisma.lead.findUnique({
      where: { id },
    });
  }

  async create(data: CreateLeadDto) {
    const lead = await this.prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        origin: data.origin,
        responseTime: data.responseTime,
        interactions: data.interactions || 0,
        status: data.status || 'em_atendimento',
      },
    });

    // Analisa o lead automaticamente
    await this.analyzeLead(lead.id);

    return this.prisma.lead.findUnique({
      where: { id: lead.id },
    });
  }

  async update(id: string, data: UpdateLeadDto) {
    const lead = await this.prisma.lead.update({
      where: { id },
      data,
    });

    // Re-analisa se a mensagem ou interações mudaram
    if (data.message || data.interactions !== undefined) {
      await this.analyzeLead(id);
    }

    return this.prisma.lead.findUnique({
      where: { id },
    });
  }

  async delete(id: string) {
    try {
      await this.prisma.lead.delete({
        where: { id },
      });
      return true;
    } catch (error: any) {
      if (error.code === 'P2025') {
        return false;
      }
      throw error;
    }
  }

  async analyzeLead(id: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
    });

    if (!lead) {
      throw new Error('Lead não encontrado');
    }

    const analysisInput: LeadAnalysisInput = {
      message: lead.message,
      origin: lead.origin,
      responseTime: lead.responseTime || undefined,
      interactions: lead.interactions,
    };

    const analysis = await this.analysisService.analyzeLead(analysisInput);

    return this.prisma.lead.update({
      where: { id },
      data: {
        score: analysis.score,
        classification: analysis.classification,
        scoreReason: analysis.reason,
        analyzedAt: new Date(),
      },
    });
  }

  async getStats() {
    const total = await this.prisma.lead.count();
    const quente = await this.prisma.lead.count({
      where: { classification: 'Quente' },
    });
    const morno = await this.prisma.lead.count({
      where: { classification: 'Morno' },
    });
    const frio = await this.prisma.lead.count({
      where: { classification: 'Frio' },
    });

    return {
      total,
      quente,
      morno,
      frio,
      averageScore: total > 0
        ? await this.prisma.lead.aggregate({
            _avg: { score: true },
          }).then(r => Math.round(r._avg.score || 0))
        : 0,
    };
  }
}

