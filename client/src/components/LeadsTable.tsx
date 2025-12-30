import React from 'react';
import type { Lead } from '../types/lead.types';
import { getClassificationColor, getScoreColor, getStatusColor, formatResponseTime } from '../utils/lead.utils';
import { formatDate } from '../utils/date.utils';

interface LeadsTableProps {
    leads: Lead[];
    onEdit: (lead: Lead) => void;
    onDelete: (id: string) => void;
    onExpand: (lead: Lead) => void;
    onAnalyze: (id: string) => void;
    loading?: boolean;
}

export function LeadsTable({ leads, onEdit, onDelete, onExpand, onAnalyze, loading }: LeadsTableProps) {

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-gray-500 mt-4">Carregando leads...</p>
            </div>
        );
    }

    if (leads.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Nenhum lead encontrado.</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden flex flex-col h-full w-full">
            <div className="overflow-x-auto overflow-y-auto flex-1 w-full">
                <table className="min-w-full divide-y divide-gray-200" style={{ minWidth: '1000px' }}>
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nome
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Contato
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Origem
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Score
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Classificação
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tempo Resposta
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Interações
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Criado em
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {leads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                                    <div className="text-xs text-gray-500 line-clamp-1 max-w-xs">{lead.message}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{lead.email || '-'}</div>
                                    <div className="text-xs text-gray-500">{lead.phone || '-'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{lead.origin}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {lead.score !== null && lead.score !== undefined ? (
                                        <span className={`text-lg font-bold ${getScoreColor(lead.score)}`}>
                                            {lead.score}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {lead.classification ? (
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
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}
                                    >
                                        {lead.status === 'em_atendimento' && 'Em Atendimento'}
                                        {lead.status === 'finalizado' && 'Finalizado'}
                                        {lead.status === 'travado' && 'Travado'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatResponseTime(lead.responseTime)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {lead.interactions || 0}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(lead.createdAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end gap-2">
                                        {(!lead.score || !lead.classification) && (
                                            <button
                                                onClick={() => onAnalyze(lead.id)}
                                                className="text-purple-600 hover:text-purple-900"
                                                title="Analisar"
                                            >
                                                🤖
                                            </button>
                                        )}
                                        <button
                                            onClick={() => onExpand(lead)}
                                            className="text-green-600 hover:text-green-900"
                                            title="Expandir"
                                        >
                                            🔍
                                        </button>
                                        <button
                                            onClick={() => onEdit(lead)}
                                            className="text-blue-600 hover:text-blue-900"
                                            title="Editar"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => onDelete(lead.id)}
                                            className="text-red-600 hover:text-red-900"
                                            title="Excluir"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

