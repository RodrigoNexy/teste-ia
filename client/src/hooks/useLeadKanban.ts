import { useState } from 'react';
import type { Lead, LeadStatus } from '../types/lead.types';

interface UseLeadKanbanProps {
  leads: Lead[];
  onStatusChange: (id: string, status: LeadStatus) => void;
}

export function useLeadKanban({ leads, onStatusChange }: UseLeadKanbanProps) {
  const [draggedLead, setDraggedLead] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<LeadStatus | null>(null);

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
      const currentLead = leads.find((l) => l.id === leadId);
      if (currentLead && currentLead.status !== targetStatus) {
        onStatusChange(leadId, targetStatus);
      }
    }

    setDraggedLead(null);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedLead(null);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  };

  const clearDragOverColumn = () => {
    setDragOverColumn(null);
  };

  return {
    draggedLead,
    dragOverColumn,
    leadsByStatus,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    clearDragOverColumn,
  };
}

