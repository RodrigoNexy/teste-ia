import React from 'react';
import { X, Edit, User, Mail, Phone, MapPin, Lightbulb, Timer, MessageCircle, Calendar, Bot, Circle } from 'lucide-react';
import type { Lead } from '../types/lead.types';
import { getClassificationColor, getScoreColor, formatResponseTimeDetailed } from '../utils/lead.utils';
import { formatDateTimeFull } from '../utils/date.utils';

interface LeadViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    lead: Lead | null;
    onEdit: (lead: Lead) => void;
}

export function LeadViewModal({ isOpen, onClose, lead, onEdit }: LeadViewModalProps) {
    if (!isOpen || !lead) return null;

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
                        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <User className="w-6 h-6" />
                            Detalhes do Lead
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
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
                                            {lead.classification === 'Quente' && <Circle className="w-3 h-3 inline-block text-green-500 fill-green-500 mr-1" />}
                                            {lead.classification === 'Morno' && <Circle className="w-3 h-3 inline-block text-yellow-500 fill-yellow-500 mr-1" />}
                                            {lead.classification === 'Frio' && <Circle className="w-3 h-3 inline-block text-red-500 fill-red-500 mr-1" />}
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
                                            <Mail className="w-4 h-4" />
                                            <a href={`mailto:${lead.email}`} className="hover:text-blue-600 hover:underline">
                                                {lead.email}
                                            </a>
                                        </div>
                                    )}
                                    {lead.phone && (
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Phone className="w-4 h-4" />
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
                                    <MapPin className="w-4 h-4" />
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
                                    <Lightbulb className="w-4 h-4" />
                                    Análise da IA
                                </h4>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <p className="text-gray-800">{lead.scoreReason}</p>
                                </div>
                            </div>
                        )}

                        {/* Métricas */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                    <Timer className="w-4 h-4" />
                                    Tempo de Resposta
                                </div>
                                <div className="text-lg font-semibold text-gray-900">
                                    {formatResponseTimeDetailed(lead.responseTime)}
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                    <MessageCircle className="w-4 h-4" />
                                    Interações
                                </div>
                                <div className="text-lg font-semibold text-gray-900">{lead.interactions || 0}</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    Criado em
                                </div>
                                <div className="text-lg font-semibold text-gray-900">
                                    {formatDateTimeFull(lead.createdAt)}
                                </div>
                            </div>
                        </div>

                        {/* Data de Análise */}
                        {lead.analyzedAt && (
                            <div className="mb-6">
                                <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                    <Bot className="w-4 h-4" />
                                    Última análise em
                                </div>
                                <div className="text-base text-gray-700">{formatDateTimeFull(lead.analyzedAt)}</div>
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
                                <Edit className="w-5 h-5" />
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

