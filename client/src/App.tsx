import React, { useState, useEffect } from 'react';
import { LeadKanban } from './components/LeadKanban';
import { LeadModal } from './components/LeadModal';
import { DashboardStats } from './components/DashboardStats';
import { LeadService } from './services/lead.service';
import type { Lead, LeadStats as LeadStatsType, LeadStatus } from './types/lead.types';

function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStatsType | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleCreate = async (data: {
    name: string;
    email?: string;
    phone?: string;
    message: string;
    origin: string;
    responseTime?: number;
    interactions?: number;
  }) => {
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

  const handleUpdate = async (
    id: string,
    data: {
      name: string;
      email?: string;
      phone?: string;
      message: string;
      origin: string;
      responseTime?: number;
      interactions?: number;
      status?: LeadStatus;
    }
  ) => {
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

  const handleNewLead = () => {
    setEditingLead(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLead(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🔥 Lead Scoring com IA
              </h1>
              <p className="text-gray-600 mt-1">
                Sistema inteligente de qualificação de leads usando Groq AI
              </p>
            </div>
            <button
              onClick={handleNewLead}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Novo Lead
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas */}
        {stats && <DashboardStats stats={stats} />}

        {/* Kanban de Leads */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">
              📋 Kanban de Leads
            </h2>
            <div className="text-sm text-gray-500">
              {stats && `Score médio: ${stats.averageScore}`}
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-500 mt-4">Carregando leads...</p>
            </div>
          ) : (
            <LeadKanban
              leads={leads}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAnalyze={handleAnalyze}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>
      </main>

      {/* Modal */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        lead={editingLead}
        onSubmit={editingLead ? (data) => handleUpdate(editingLead.id, data) : handleCreate}
      />
    </div>
  );
}

export default App;
