import React from 'react';
import type { Lead } from '../types/lead.types';
import { TimePicker } from './TimePicker';
import { useLeadForm } from '../hooks/useLeadForm';

interface LeadFormProps {
    lead: Lead | null;
    onSubmit: (data: {
        name: string;
        email?: string;
        phone?: string;
        message: string;
        origin: string;
        responseTime?: number;
        interactions?: number;
    }) => Promise<void>;
    onCancel?: () => void;
}

const ORIGINS = ['WhatsApp', 'Formulário', 'Email', 'LinkedIn', 'Instagram', 'Outro'];

export function LeadForm({ lead, onSubmit, onCancel }: LeadFormProps) {
    const {
        name,
        email,
        phone,
        message,
        origin,
        responseTime,
        interactions,
        error,
        loading,
        setName,
        setEmail,
        setPhone,
        setMessage,
        setOrigin,
        setResponseTime,
        setInteractions,
        handleSubmit,
    } = useLeadForm({ lead, onSubmit });

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nome *
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">
                        Origem *
                    </label>
                    <select
                        id="origin"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        {ORIGINS.map((o) => (
                            <option key={o} value={o}>
                                {o}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Telefone
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Mensagem do Lead *
                </label>
                <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Cole aqui a mensagem inicial do lead..."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tempo de Resposta
                    </label>
                    <TimePicker
                        value={responseTime ? parseFloat(responseTime) : undefined}
                        onChange={(hours) => setResponseTime(hours?.toString() || '')}
                        placeholder="Clique para selecionar o tempo de resposta"
                    />
                </div>

                <div>
                    <label htmlFor="interactions" className="block text-sm font-medium text-gray-700 mb-1">
                        Número de Interações
                    </label>
                    <input
                        type="number"
                        id="interactions"
                        value={interactions}
                        onChange={(e) => setInteractions(e.target.value)}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Salvando...' : lead ? 'Atualizar' : 'Criar Lead'}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
}

