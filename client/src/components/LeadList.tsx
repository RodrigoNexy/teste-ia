import type { Lead } from '../types/lead.types';

interface LeadListProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onAnalyze: (id: string) => void;
}

export function LeadList({ leads, onEdit, onDelete, onAnalyze }: LeadListProps) {
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
                {lead.email && <span>📧 {lead.email}</span>}
                {lead.phone && <span>📱 {lead.phone}</span>}
                <span>📍 {lead.origin}</span>
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
                  {lead.classification === 'Quente' && '🟢'}
                  {lead.classification === 'Morno' && '🟡'}
                  {lead.classification === 'Frio' && '🔴'}
                  {' '}
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
                <strong>💡 Análise:</strong> {lead.scoreReason}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-4">
            {lead.responseTime !== null && lead.responseTime !== undefined && (
              <span>⏱️ {lead.responseTime}h de resposta</span>
            )}
            <span>💬 {lead.interactions} interações</span>
            {lead.analyzedAt && (
              <span>📊 Analisado em {new Date(lead.analyzedAt).toLocaleDateString('pt-BR')}</span>
            )}
          </div>

          <div className="flex gap-2 pt-4 border-t border-gray-200">
            {(!lead.score || !lead.classification) && (
              <button
                onClick={() => onAnalyze(lead.id)}
                className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                🤖 Analisar com IA
              </button>
            )}
            <button
              onClick={() => onEdit(lead)}
              className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-900"
            >
              ✏️ Editar
            </button>
            <button
              onClick={() => onDelete(lead.id)}
              className="px-3 py-1.5 text-sm text-red-600 hover:text-red-900"
            >
              🗑️ Excluir
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

