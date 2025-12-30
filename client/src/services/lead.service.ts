import axios from 'axios';
import type { Lead, CreateLeadDto, UpdateLeadDto, LeadStats, LeadStatus } from '../types/lead.types';

const API_BASE_URL = '/api/leads';

export class LeadService {
  async getAll(): Promise<Lead[]> {
    const response = await axios.get<Lead[]>(API_BASE_URL);
    return response.data;
  }

  async getById(id: string): Promise<Lead> {
    const response = await axios.get<Lead>(`${API_BASE_URL}/${id}`);
    return response.data;
  }

  async create(data: CreateLeadDto): Promise<Lead> {
    const response = await axios.post<Lead>(API_BASE_URL, data);
    return response.data;
  }

  async update(id: string, data: UpdateLeadDto): Promise<Lead> {
    const response = await axios.put<Lead>(`${API_BASE_URL}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/${id}`);
  }

  async analyze(id: string): Promise<Lead> {
    const response = await axios.post<Lead>(`${API_BASE_URL}/${id}/analyze`);
    return response.data;
  }

  async getStats(): Promise<LeadStats> {
    const response = await axios.get<LeadStats>(`${API_BASE_URL}/stats`);
    return response.data;
  }
}

