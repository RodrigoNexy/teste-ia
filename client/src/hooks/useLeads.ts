import { useState, useEffect } from 'react';
import { LeadService } from '../services/lead.service';
import type { Lead, LeadStats, LeadStatus } from '../types/lead.types';

interface CreateLeadData {
  name: string;
  email?: string;
  phone?: string;
  message: string;
  origin: string;
  responseTime?: number;
  interactions?: number;
}

interface UpdateLeadData {
  name: string;
  email?: string;
  phone?: string;
  message: string;
  origin: string;
  responseTime?: number;
  interactions?: number;
  status?: LeadStatus;
}

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const leadService = new LeadService();

  const loadLeads = async () => {
    setLoading(true);
    try {
      const [leadsData, statsData] = await Promise.all([
        leadService.getAll(),
        leadService.getStats(),
      ]);
      setLeads(leadsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleCreate = async (data: CreateLeadData) => {
    try {
      await leadService.create(data);
      await loadLeads();
      setIsModalOpen(false);
      setEditingLead(null);
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  };

  const handleUpdate = async (id: string, data: UpdateLeadData) => {
    try {
      await leadService.update(id, data);
      await loadLeads();
      setIsModalOpen(false);
      setEditingLead(null);
    } catch (error) {
      console.error('Error updating lead:', error);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este lead?')) {
      return;
    }
    try {
      await leadService.delete(id);
      await loadLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const handleAnalyze = async (id: string) => {
    try {
      await leadService.analyze(id);
      await loadLeads();
    } catch (error) {
      console.error('Error analyzing lead:', error);
      alert('Erro ao analisar lead. Tente novamente.');
    }
  };

  const handleStatusChange = async (id: string, status: LeadStatus) => {
    try {
      await leadService.update(id, { status });
      await loadLeads();
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleExpand = (lead: Lead) => {
    setViewingLead(lead);
    setIsViewModalOpen(true);
  };

  const handleNewLead = () => {
    setEditingLead(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLead(null);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingLead(null);
  };

  return {
    // State
    leads,
    stats,
    editingLead,
    viewingLead,
    isModalOpen,
    isViewModalOpen,
    loading,
    // Actions
    handleCreate,
    handleUpdate,
    handleDelete,
    handleAnalyze,
    handleStatusChange,
    handleEdit,
    handleExpand,
    handleNewLead,
    handleCloseModal,
    handleCloseViewModal,
    // Utils
    loadLeads,
  };
}

