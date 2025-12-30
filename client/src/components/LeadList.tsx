import type { Lead } from '../types/lead.types';
import React from 'react';
import { Mail, Phone, MapPin, Circle, Lightbulb, Timer, MessageCircle, BarChart3, Bot, Edit, Trash2 } from 'lucide-react';
import { getClassificationColor, getScoreColor } from '../utils/lead.utils';

interface LeadListProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onAnalyze: (id: string) => void;
}

export function LeadList({ leads, onEdit, onDelete, onAnalyze }: LeadListProps) {

  if (leads.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum lead cadastrado ainda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {leads.map((lead) => (
        <div
          key={lead.id}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
              <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-600">
                {lead.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {lead.email}</span>}
                {lead.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {lead.phone}</span>}
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {lead.origin}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {lead.score !== null && lead.score !== undefined && (
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getScoreColor(lead.score)}`}>
                    {lead.score}
                  </div>
                  <div className="text-xs text-gray-500">score</div>
                </div>
              )}
              {lead.classification && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${getClassificationColor(
                    lead.classification
                  )}`}
                >
                  {lead.classification === 'Quente' && <Circle className="w-3 h-3 inline-block text-green-500 fill-green-500 mr-1" />}
                  {lead.classification === 'Morno' && <Circle className="w-3 h-3 inline-block text-yellow-500 fill-yellow-500 mr-1" />}
                  {lead.classification === 'Frio' && <Circle className="w-3 h-3 inline-block text-red-500 fill-red-500 mr-1" />}
                  {lead.classification}
                </span>
              )}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-gray-700 whitespace-pre-wrap">{lead.message}</p>
          </div>

          {lead.scoreReason && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-900">
                <strong className="flex items-center gap-1"><Lightbulb className="w-4 h-4" /> Análise:</strong> {lead.scoreReason}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-4">
            {lead.responseTime !== null && lead.responseTime !== undefined && (
              <span className="flex items-center gap-1"><Timer className="w-4 h-4" /> {lead.responseTime}h de resposta</span>
            )}
            <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" /> {lead.interactions} interações</span>
            {lead.analyzedAt && (
              <span className="flex items-center gap-1"><BarChart3 className="w-4 h-4" /> Analisado em {new Date(lead.analyzedAt).toLocaleDateString('pt-BR')}</span>
            )}
          </div>

          <div className="flex gap-2 pt-4 border-t border-gray-200">
            {(!lead.score || !lead.classification) && (
              <button
                onClick={() => onAnalyze(lead.id)}
                className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-1"
              >
                <Bot className="w-4 h-4" />
                Analisar com IA
              </button>
            )}
            <button
              onClick={() => onEdit(lead)}
              className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-900 flex items-center gap-1"
            >
              <Edit className="w-4 h-4" />
              Editar
            </button>
            <button
              onClick={() => onDelete(lead.id)}
              className="px-3 py-1.5 text-sm text-red-600 hover:text-red-900 flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              Excluir
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

