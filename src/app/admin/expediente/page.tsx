import Agenda from '@/components/agenda/agenda';
import ClientesPage from '@/components/clientes/clientes';
import Dashboard from '@/components/dashboard/dashboard';
import DashboardSemanal from '@/components/dashboard/dashboardAgendamentos';
import ExpedientePage from '@/components/profissionais/expediente';
import ServicosPage from '@/components/servicos/servicos';
import Nav from '@/components/ui/nav';

export default function ExpedientePages() {
  return (
    <div className="flex flex-col items-center justify-start h-screen">
      <ExpedientePage />
      <Nav />
    </div>
  );
}
