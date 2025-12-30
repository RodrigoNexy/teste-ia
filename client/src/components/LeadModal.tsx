import React from 'react';
import { X, Edit, Plus } from 'lucide-react';
import { LeadForm } from './LeadForm';
import type { Lead } from '../types/lead.types';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export function LeadModal({ isOpen, onClose, lead, onSubmit }: LeadModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-start justify-center min-h-screen px-4 pt-4 pb-4 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-4 sm:align-middle sm:max-w-6xl sm:w-full max-h-[95vh] overflow-y-auto">
          <div className="bg-white h-[900px] px-8 pt-6 pb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {lead ? (
                  <>
                    <Edit className="w-6 h-6" />
                    Editar Lead
                  </>
                ) : (
                  <>
                    <Plus className="w-6 h-6" />
                    Novo Lead
                  </>
                )}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <LeadForm
              lead={lead}
              onSubmit={onSubmit}
              onCancel={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

