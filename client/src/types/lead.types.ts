export type LeadStatus = 'em_atendimento' | 'finalizado' | 'travado';

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  message: string;
  origin: string;
  responseTime?: number;
  interactions: number;
  score?: number;
  classification?: 'Frio' | 'Morno' | 'Quente';
  scoreReason?: string;
  status: LeadStatus;
  analyzedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadDto {
  name: string;
  email?: string;
  phone?: string;
  message: string;
  origin: string;
  responseTime?: number;
  interactions?: number;
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

export interface LeadStats {
  total: number;
  quente: number;
  morno: number;
  frio: number;
  averageScore: number;
}

