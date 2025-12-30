import React from 'react';
import type { Lead } from '../types/lead.types';

interface LeadViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onEdit: (lead: Lead) => void;
}

export function LeadViewModal({ isOpen, onClose, lead, onEdit }: LeadViewModalProps) {
  if (!isOpen || !lead) return null;

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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não informado';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatResponseTime = (hours?: number) => {
    if (!hours && hours !== 0) return 'Não informado';
    const totalMinutes = Math.round(hours * 60);
    if (totalMinutes < 60) return `${totalMinutes} minuto${totalMinutes !== 1 ? 's' : ''}`;
    const h = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (mins === 0) return `${h} hora${h !== 1 ? 's' : ''}`;
    return `${h}h ${mins}min`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-4">
        {/* Overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h3 className="text-2xl font-bold text-gray-900">
              👤 Detalhes do Lead
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Nome e Score */}
            <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-200">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{lead.name}</h2>
                <div className="flex items-center gap-3">
                  {lead.classification && (
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold border ${getClassificationColor(
                        lead.classification
                      )}`}
                    >
                      {lead.classification === 'Quente' && '🟢'}
                      {lead.classification === 'Morno' && '🟡'}
                      {lead.classification === 'Frio' && '🔴'}
                      {' '}
                      {lead.classification}
                    </span>
                  )}
                  {lead.status && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      {lead.status === 'em_atendimento' && 'Em Atendimento'}
                      {lead.status === 'finalizado' && 'Finalizado'}
                      {lead.status === 'travado' && 'Travado'}
                    </span>
                  )}
                </div>
              </div>
              {lead.score !== null && lead.score !== undefined && (
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">Score</div>
                  <div className={`text-4xl font-bold ${getScoreColor(lead.score)}`}>
                    {lead.score}
                  </div>
                </div>
              )}
            </div>

            {/* Informações de Contato */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Contato</h4>
                <div className="space-y-2">
                  {lead.email && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="text-lg">📧</span>
                      <a href={`mailto:${lead.email}`} className="hover:text-blue-600 hover:underline">
                        {lead.email}
                      </a>
                    </div>
                  )}
                  {lead.phone && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="text-lg">📱</span>
                      <a href={`tel:${lead.phone}`} className="hover:text-blue-600 hover:underline">
                        {lead.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Origem</h4>
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-lg">📍</span>
                  <span>{lead.origin}</span>
                </div>
              </div>
            </div>

            {/* Mensagem */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">Mensagem Inicial</h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-gray-800 whitespace-pre-wrap">{lead.message}</p>
              </div>
            </div>

            {/* Análise da IA */}
            {lead.scoreReason && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
                  <span>💡</span> Análise da IA
                </h4>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-gray-800">{lead.scoreReason}</p>
                </div>
              </div>
            )}

            {/* Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">⏱️ Tempo de Resposta</div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatResponseTime(lead.responseTime)}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">💬 Interações</div>
                <div className="text-lg font-semibold text-gray-900">{lead.interactions || 0}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">📅 Criado em</div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatDate(lead.createdAt)}
                </div>
              </div>
            </div>

            {/* Data de Análise */}
            {lead.analyzedAt && (
              <div className="mb-6">
                <div className="text-sm text-gray-500 mb-1">🤖 Última análise em</div>
                <div className="text-base text-gray-700">{formatDate(lead.analyzedAt)}</div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  onEdit(lead);
                  onClose();
                }}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar Lead
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

