import { useState, useEffect } from 'react';
import type { User } from '../types/user.types';

interface UseUserFormProps {
  user: User | null;
  onSubmit: (id: string, name: string, email: string) => Promise<void>;
}

export function useUserForm({ user, onSubmit }: UseUserFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    } else {
      setName('');
      setEmail('');
    }
    setError('');
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name.trim() || !email.trim()) {
      setError('Nome e email são obrigatórios');
      setLoading(false);
      return;
    }

    try {
      const id = user?.id || '';
      await onSubmit(id, name.trim(), email.trim());
      if (!user) {
        setName('');
        setEmail('');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao salvar usuário');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
  };

  return {
    // Form fields
    name,
    email,
    // Setters
    setName,
    setEmail,
    // State
    error,
    loading,
    // Actions
    handleSubmit,
    resetForm,
  };
}

