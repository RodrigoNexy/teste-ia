import React from 'react';
import { LayoutGrid, Users, BarChart3, Settings, Plus, LogOut, Flame } from 'lucide-react';

interface SidebarProps {
  onNewLead: () => void;
  currentPage?: string;
  onPageChange: (page: string) => void;
}

export function Sidebar({ onNewLead, currentPage = 'dashboard', onPageChange }: SidebarProps) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutGrid className="w-5 h-5" />,
    },
    {
      id: 'leads',
      label: 'Leads',
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: 'analytics',
      label: 'Análises',
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Lead Scoring</h1>
            <p className="text-xs text-gray-500">com IA</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentPage === item.id
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Novo Lead Button */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={onNewLead}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
          >
            <Plus className="w-5 h-5" />
            Novo Lead
          </button>
        </div>
      </nav>

      {/* Status Section */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-sm text-gray-700">Sistema operacional</p>
          </div>
        </div>
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors text-sm">
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}

