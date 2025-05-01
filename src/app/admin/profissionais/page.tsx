import Agenda from '@/components/agenda/agenda';
import ClientesPage from '@/components/clientes/clientes';
import Dashboard from '@/components/dashboard/dashboard';
import DashboardSemanal from '@/components/dashboard/dashboardAgendamentos';
import ProfissionaisPage from '@/components/profissionais/profissionais';
import Nav from '@/components/ui/nav';

export default function ProfissionalPage() {
  return (
    <div className="flex flex-col items-center justify-start h-screen">
      <ProfissionaisPage />
    </div>
  );
}
