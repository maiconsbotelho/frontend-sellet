import Agenda from '@/components/agenda/agenda';
import Dashboard from '@/components/dashboard/dashboard';
import DashboardSemanal from '@/components/dashboard/dashboardAgendamentos';
import Nav from '@/components/ui/nav';

export default function AdminPage() {
  return (
    <div className="flex flex-col items-center justify-start h-screen">
      {/* <DashboardSemanal /> */}
      <Agenda />
    </div>
  );
}
