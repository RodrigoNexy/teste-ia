import React, { useState } from 'react';
import { LeadKanban } from './components/LeadKanban';
import { LeadModal } from './components/LeadModal';
import { LeadViewModal } from './components/LeadViewModal';
import { DashboardStats } from './components/DashboardStats';
import { LeadsTable } from './components/LeadsTable';
import { AnalyticsPage } from './components/AnalyticsPage';
import { Sidebar } from './components/Sidebar';
import { useLeads } from './hooks/useLeads';

function App() {
    const [currentPage, setCurrentPage] = useState('dashboard');

    const {
        leads,
        stats,
        editingLead,
        viewingLead,
        isModalOpen,
        isViewModalOpen,
        loading,
        handleCreate,
        handleUpdate,
        handleDelete,
        handleAnalyze,
        handleStatusChange,
        handleEdit,
        handleExpand,
        handleNewLead,
        handleCloseModal,
        handleCloseViewModal,
    } = useLeads();

    const handlePageChange = (page: string) => {
        setCurrentPage(page);
    };

    const renderPageContent = () => {
        switch (currentPage) {
            case 'dashboard':
                return (
                    <>
                        {/* Estatísticas */}
                        {stats && <DashboardStats stats={stats} />}

                        {/* Kanban de Leads */}
                        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                                <h2 className="text-2xl font-semibold text-gray-800">
                                    📋 Kanban de Leads
                                </h2>
                                <div className="text-sm text-gray-500">
                                    {stats && `Score médio: ${stats.averageScore}`}
                                </div>
                            </div>

                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <p className="text-gray-500 mt-4">Carregando leads...</p>
                                </div>
                            ) : (
                                <LeadKanban
                                    leads={leads}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onAnalyze={handleAnalyze}
                                    onStatusChange={handleStatusChange}
                                    onExpand={handleExpand}
                                />
                            )}
                        </div>
                    </>
                );
            case 'leads':
                return (
                    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 flex-shrink-0">
                            <h2 className="text-2xl font-semibold text-gray-800">
                                📊 Lista de Leads
                            </h2>
                            <div className="text-sm text-gray-500">
                                Total: {leads.length} leads
                            </div>
                        </div>
                        <div className="flex-1 min-h-0 overflow-hidden">
                            <LeadsTable
                                leads={leads}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onExpand={handleExpand}
                                onAnalyze={handleAnalyze}
                                loading={loading}
                            />
                        </div>
                    </div>
                );
            case 'analytics':
                return (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="mb-6 pb-4 border-b border-gray-200">
                            <h2 className="text-2xl font-semibold text-gray-800">
                                📈 Análises e Relatórios
                            </h2>
                            <p className="text-gray-600 mt-1">
                                Visualize métricas e tendências dos seus leads
                            </p>
                        </div>
                        <AnalyticsPage leads={leads} stats={stats} />
                    </div>
                );
            case 'settings':
                return (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            ⚙️ Configurações
                        </h2>
                        <p className="text-gray-600">Página de configurações em desenvolvimento...</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <Sidebar onNewLead={handleNewLead} currentPage={currentPage} onPageChange={handlePageChange} />

            {/* Main Content */}
            <div className="flex-1 ml-64 overflow-x-hidden">

                {/* Main Content */}
                <main className="px-6 py-8 overflow-x-hidden">
                    {renderPageContent()}
                </main>
            </div>

            {/* Modal de Edição/Criação */}
            <LeadModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                lead={editingLead}
                onSubmit={editingLead ? (data) => handleUpdate(editingLead.id, data) : handleCreate}
            />

            {/* Modal de Visualização */}
            <LeadViewModal
                isOpen={isViewModalOpen}
                onClose={handleCloseViewModal}
                lead={viewingLead}
                onEdit={handleEdit}
            />
        </div>
    );
}

export default App;
