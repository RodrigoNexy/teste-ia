import { Request, Response } from 'express';
import { LeadService } from '../services/lead.service.js';

export class LeadController {
  private leadService: LeadService;

  constructor() {
    this.leadService = new LeadService();
  }

  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const leads = await this.leadService.findAll();
      res.json(leads);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch leads' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const lead = await this.leadService.findById(id);
      
      if (!lead) {
        res.status(404).json({ error: 'Lead not found' });
        return;
      }
      
      res.json(lead);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch lead' });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone, message, origin, responseTime, interactions, status } = req.body;
      
      if (!name || !message || !origin) {
        res.status(400).json({ error: 'Name, message and origin are required' });
        return;
      }

      const lead = await this.leadService.create({
        name,
        email,
        phone,
        message,
        origin,
        responseTime,
        interactions,
        status,
      });
      
      res.status(201).json(lead);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to create lead', message: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, email, phone, message, origin, responseTime, interactions, status } = req.body;

      const lead = await this.leadService.update(id, {
        name,
        email,
        phone,
        message,
        origin,
        responseTime,
        interactions,
        status,
      });
      
      if (!lead) {
        res.status(404).json({ error: 'Lead not found' });
        return;
      }
      
      res.json(lead);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to update lead', message: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.leadService.delete(id);
      
      if (!deleted) {
        res.status(404).json({ error: 'Lead not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete lead' });
    }
  }

  async analyze(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const lead = await this.leadService.analyzeLead(id);
      res.json(lead);
    } catch (error: any) {
      if (error.message === 'Lead not found') {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Failed to analyze lead', message: error.message });
    }
  }

  async getStats(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.leadService.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  }
}

