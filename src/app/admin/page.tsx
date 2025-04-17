import TabelaAgendamentos from '@/components/agendamentos/tabelaAgendamentos';
import Dashboard from '@/components/dashboard/dashboard';
import DashboardSemanal from '@/components/dashboard/dashboardAgendamentos';
import Nav from '@/components/ui/nav';

export default function AdminPage() {
  return (
    <div className="flex flex-col items-center justify-start h-screen">
      <DashboardSemanal />
      {/* <TabelaAgendamentos /> */}
      <Nav />
    </div>
  );
}
