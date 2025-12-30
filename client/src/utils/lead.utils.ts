export const getClassificationColor = (classification?: string) => {
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

export const getScoreColor = (score?: number) => {
  if (score === undefined || score === null) return 'text-gray-500';
  if (score >= 71) return 'text-green-600 font-bold';
  if (score >= 41) return 'text-yellow-600 font-semibold';
  return 'text-red-600';
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'em_atendimento':
      return 'bg-blue-100 text-blue-800';
    case 'finalizado':
      return 'bg-green-100 text-green-800';
    case 'travado':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const formatResponseTime = (hours?: number) => {
  if (!hours && hours !== 0) return '-';
  const totalMinutes = Math.round(hours * 60);
  if (totalMinutes < 60) return `${totalMinutes}min`;
  const h = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (mins === 0) return `${h}h`;
  return `${h}h ${mins}min`;
};

export const formatResponseTimeDetailed = (hours?: number) => {
  if (!hours && hours !== 0) return 'Não informado';
  const totalMinutes = Math.round(hours * 60);
  if (totalMinutes < 60) return `${totalMinutes} minuto${totalMinutes !== 1 ? 's' : ''}`;
  const h = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (mins === 0) return `${h} hora${h !== 1 ? 's' : ''}`;
  return `${h}h ${mins}min`;
};

