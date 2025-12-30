import { useState, useEffect } from 'react';
import type { Lead } from '../types/lead.types';

interface UseLeadFormProps {
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
}

export function useLeadForm({ lead, onSubmit }: UseLeadFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [origin, setOrigin] = useState('WhatsApp');
  const [responseTime, setResponseTime] = useState('');
  const [interactions, setInteractions] = useState('0');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lead) {
      setName(lead.name);
      setEmail(lead.email || '');
      setPhone(lead.phone || '');
      setMessage(lead.message);
      setOrigin(lead.origin);
      setResponseTime(lead.responseTime?.toString() || '');
      setInteractions(lead.interactions.toString());
    } else {
      resetForm();
    }
    setError('');
  }, [lead]);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setOrigin('WhatsApp');
    setResponseTime('');
    setInteractions('0');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name.trim() || !message.trim() || !origin) {
      setError('Nome, mensagem e origem são obrigatórios');
      setLoading(false);
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        message: message.trim(),
        origin,
        responseTime: responseTime ? parseInt(responseTime) : undefined,
        interactions: parseInt(interactions) || 0,
      });
      if (!lead) {
        resetForm();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao salvar lead');
    } finally {
      setLoading(false);
    }
  };

  return {
    // Form fields
    name,
    email,
    phone,
    message,
    origin,
    responseTime,
    interactions,
    // Setters
    setName,
    setEmail,
    setPhone,
    setMessage,
    setOrigin,
    setResponseTime,
    setInteractions,
    // State
    error,
    loading,
    // Actions
    handleSubmit,
    resetForm,
  };
}

