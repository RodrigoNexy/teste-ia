import React, { useState } from 'react';
import type { Lead, LeadStatus } from '../types/lead.types';

interface LeadKanbanProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onAnalyze: (id: string) => void;
  onStatusChange: (id: string, status: LeadStatus) => void;
  onExpand: (lead: Lead) => void;
}

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; bgColor: string; borderColor: string }> = {
  em_atendimento: {
    label: 'Em Atendimento',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
  },
  finalizado: {
    label: 'Finalizado',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
  },
  travado: {
    label: 'Travado',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
  },
};

export function LeadKanban({ leads, onEdit, onDelete, onAnalyze, onStatusChange, onExpand }: LeadKanbanProps) {
  const [draggedLead, setDraggedLead] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<LeadStatus | null>(null);

  const getClassificationColor = (classification?: string) => {
    switch (classification) {
      case 'Quente':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Morno':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Frio':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-gray-500';
    if (score >= 71) return 'text-green-600 font-bold';
    if (score >= 41) return 'text-yellow-600 font-semibold';
    return 'text-red-600';
  };

  const leadsByStatus = {
    em_atendimento: leads.filter((lead) => lead.status === 'em_atendimento'),
    finalizado: leads.filter((lead) => lead.status === 'finalizado'),
    travado: leads.filter((lead) => lead.status === 'travado'),
  };

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    setDraggedLead(leadId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/json', JSON.stringify({ leadId }));
    e.dataTransfer.setData('text/plain', leadId);
    // Adiciona uma classe visual ao elemento sendo arrastado
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragOver = (e: React.DragEvent, status: LeadStatus) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(status);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Só remove o highlight se realmente saiu da coluna
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStatus: LeadStatus) => {
    e.preventDefault();
    e.stopPropagation();

    let leadId: string | null = null;

    // Tenta pegar o ID de diferentes formas
    try {
      const jsonData = e.dataTransfer.getData('application/json');
      if (jsonData) {
        const parsed = JSON.parse(jsonData);
        leadId = parsed.leadId || parsed;
      }
    } catch (err) {
      // Ignora erro de parsing
    }

    if (!leadId) {
      leadId = e.dataTransfer.getData('text/plain');
    }

    if (leadId) {
      const currentLead = leads.find(l => l.id === leadId);
      if (currentLead && currentLead.status !== targetStatus) {
        console.log(`Moving lead ${leadId} from ${currentLead.status} to ${targetStatus}`);
        onStatusChange(leadId, targetStatus);
      }
    } else {
      console.error('No lead ID found in drop event');
    }

    setDraggedLead(null);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedLead(null);
    // Restaura a opacidade
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  };

  const renderLeadCard = (lead: Lead) => {
    const isDragging = draggedLead === lead.id;

    return (
      <div
        key={lead.id}
        draggable={true}
        onDragStart={(e) => handleDragStart(e, lead.id)}
        onDragEnd={handleDragEnd}
        className={`bg-white border border-gray-300 rounded-lg p-4 mb-3 cursor-move transition-all hover:border-gray-400 hover:shadow-md ${isDragging ? 'opacity-50 scale-95' : 'opacity-100'
          }`}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 text-sm">{lead.name}</h3>
          {lead.score !== null && lead.score !== undefined && (
            <div className={`text-lg font-bold ${getScoreColor(lead.score)}`}>
              {lead.score}
            </div>
          )}
        </div>

        <div className="text-xs text-gray-600 mb-2 space-y-1">
          {lead.email && <div>📧 {lead.email}</div>}
          {lead.phone && <div>📱 {lead.phone}</div>}
          <div>📍 {lead.origin}</div>
        </div>

        <p className="text-xs text-gray-700 mb-3 line-clamp-2">{lead.message}</p>

        {lead.classification && (
          <div className="mb-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold border ${getClassificationColor(
                lead.classification
              )}`}
            >
              {lead.classification === 'Quente' && '🟢'}
              {lead.classification === 'Morno' && '🟡'}
              {lead.classification === 'Frio' && '🔴'}
              {' '}
              {lead.classification}
            </span>
          </div>
        )}

        {lead.scoreReason && (
          <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900">
            <strong>💡 Análise:</strong> {lead.scoreReason}
          </div>
        )}

        <div className="flex flex-wrap gap-1 text-xs text-gray-500 mb-3">
          {lead.responseTime !== null && lead.responseTime !== undefined && (
            <span>⏱️ {lead.responseTime}h</span>
          )}
          <span>💬 {lead.interactions}</span>
        </div>

        <div className="flex gap-1 flex-wrap" onClick={(e) => e.stopPropagation()}>
          {(!lead.score || !lead.classification) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAnalyze(lead.id);
              }}
              className="px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              🤖 Analisar
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExpand(lead);
            }}
            className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            🔍 Expandir
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(lead);
            }}
            className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            ✏️ Editar
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(lead.id);
            }}
            className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            🗑️ Excluir
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Object.entries(STATUS_CONFIG).map(([status, config]) => {
        const statusKey = status as LeadStatus;
        const columnLeads = leadsByStatus[statusKey];

        return (
          <div
            key={status}
            className={`${config.bgColor} border-2 ${config.borderColor} rounded-lg p-4 min-h-[600px] transition-all ${dragOverColumn === statusKey ? 'ring-4 ring-opacity-50 ring-offset-2 ring-offset-white' : ''
              }`}
            onDragOver={(e) => handleDragOver(e, statusKey)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => {
              handleDrop(e, statusKey);
              setDragOverColumn(null);
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
              <h3 className={`font-bold text-lg ${config.color}`}>
                {config.label}
              </h3>
              <span className={`${config.color} bg-white px-3 py-1 rounded-full text-sm font-semibold border ${config.borderColor}`}>
                {columnLeads.length}
              </span>
            </div>

            <div className="space-y-2">
              {columnLeads.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm border-2 border-dashed border-gray-300 rounded-lg bg-white/50">
                  Arraste leads aqui
                </div>
              ) : (
                columnLeads.map(renderLeadCard)
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
