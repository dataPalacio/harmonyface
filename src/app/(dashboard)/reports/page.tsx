import { getDashboardKPIs, getRevenueChartData, getProcedureDistribution } from '@/lib/services/analytics-service';
import { KPICard } from '@/components/dashboard/kpi-card';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { ProcedureChart } from '@/components/dashboard/procedure-chart';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { StockAlerts } from '@/components/dashboard/stock-alerts';
import { Users, DollarSign, Calendar, TrendingUp, Activity, BarChart3 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function ReportsPage() {
  // Fetch all dashboard data
  const kpis = await getDashboardKPIs();
  const revenueData = await getRevenueChartData(30);
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  const procedureDistribution = await getProcedureDistribution(monthStart);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do consultório e métricas principais</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="clinical">Clínico</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* KPI Cards Row 1 - Patients */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title="Pacientes Hoje"
              value={kpis.patientsToday}
              subtitle="Atendimentos realizados"
              icon={Users}
              format="number"
            />
            <KPICard
              title="Pacientes (Semana)"
              value={kpis.patientsThisWeek}
              subtitle="Últimos 7 dias"
              icon={Users}
              format="number"
            />
            <KPICard
              title="Pacientes (Mês)"
              value={kpis.patientsThisMonth}
              subtitle="Mês atual"
              icon={Users}
              format="number"
            />
            <KPICard
              title="Total Pacientes"
              value={kpis.patientsTotal}
              subtitle="Todos os atendimentos"
              icon={Users}
              format="number"
            />
          </div>

          {/* KPI Cards Row 2 - Revenue */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title="Faturamento Hoje"
              value={kpis.revenueToday}
              subtitle="Recebido hoje"
              icon={DollarSign}
              format="currency"
            />
            <KPICard
              title="Faturamento (Semana)"
              value={kpis.revenueThisWeek}
              subtitle="Últimos 7 dias"
              icon={DollarSign}
              format="currency"
            />
            <KPICard
              title="Faturamento (Mês)"
              value={kpis.revenueThisMonth}
              subtitle="Mês atual"
              icon={DollarSign}
              format="currency"
            />
            <KPICard
              title="Ticket Médio"
              value={kpis.averageTicket}
              subtitle="Por atendimento"
              icon={TrendingUp}
              format="currency"
            />
          </div>

          {/* KPI Cards Row 3 - Appointments & Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title="Agendamentos Hoje"
              value={kpis.appointmentsToday}
              subtitle="Consultas marcadas"
              icon={Calendar}
              format="number"
            />
            <KPICard
              title="Taxa de Retorno"
              value={kpis.returnRate}
              subtitle="Pacientes recorrentes"
              icon={Activity}
              format="percentage"
              trend={kpis.returnRate >= 70 ? 'up' : kpis.returnRate >= 50 ? 'neutral' : 'down'}
            />
            <KPICard
              title="Taxa de No-Show"
              value={kpis.noShowRate}
              subtitle="Faltas nos agendamentos"
              icon={BarChart3}
              format="percentage"
              trend={kpis.noShowRate <= 10 ? 'up' : kpis.noShowRate <= 20 ? 'neutral' : 'down'}
            />
            <KPICard
              title="Taxa de Ocupação"
              value={kpis.occupancyRate}
              subtitle="Utilização da agenda"
              icon={BarChart3}
              format="percentage"
              trend={kpis.occupancyRate >= 80 ? 'up' : kpis.occupancyRate >= 60 ? 'neutral' : 'down'}
            />
          </div>

          {/* Charts Row */}
          <div className="grid gap-4 md:grid-cols-2">
            <RevenueChart data={revenueData} />
            <ProcedureChart data={procedureDistribution} />
          </div>

          {/* Recent Activity */}
          <RecentActivity sessions={kpis.recentSessions} appointments={kpis.upcomingAppointments} />

          {/* Stock Alerts */}
          <StockAlerts lowStock={kpis.lowStockAlerts} expiring={kpis.expiringProducts} />
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title="Faturamento Anual"
              value={kpis.revenueThisYear}
              subtitle="Janeiro até hoje"
              icon={DollarSign}
              format="currency"
            />
            <KPICard
              title="Faturamento Mensal"
              value={kpis.revenueThisMonth}
              subtitle="Mês atual"
              icon={DollarSign}
              format="currency"
            />
            <KPICard
              title="Ticket Médio"
              value={kpis.averageTicket}
              subtitle="Por atendimento"
              icon={TrendingUp}
              format="currency"
            />
            <KPICard
              title="Sessões Pagas"
              value={kpis.patientsThisMonth}
              subtitle="Mês atual"
              icon={BarChart3}
              format="number"
            />
          </div>

          <RevenueChart data={revenueData} title="Evolução do Faturamento" description="Últimos 30 dias" />

          {/* Top Procedures by Revenue */}
          <div className="rounded-lg border bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Procedimentos Mais Rentáveis</h3>
            <div className="space-y-2">
              {kpis.topProcedures.slice(0, 5).map((proc, idx) => (
                <div key={proc.procedureId} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">#{idx + 1}</span>
                    <span className="text-sm font-medium">{proc.procedureName}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proc.revenue)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {proc.count} procedimentos ({proc.percentage.toFixed(1)}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="clinical" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title="Sessões (Mês)"
              value={kpis.patientsThisMonth}
              subtitle="Atendimentos realizados"
              icon={Activity}
              format="number"
            />
            <KPICard
              title="Taxa de Retorno"
              value={kpis.returnRate}
              subtitle="Pacientes recorrentes"
              icon={Users}
              format="percentage"
              trend={kpis.returnRate >= 70 ? 'up' : 'neutral'}
            />
            <KPICard
              title="Agendamentos Futuros"
              value={kpis.appointmentsThisMonth}
              subtitle="Próximas consultas"
              icon={Calendar}
              format="number"
            />
            <KPICard
              title="Taxa de No-Show"
              value={kpis.noShowRate}
              subtitle="Faltas no mês"
              icon={BarChart3}
              format="percentage"
              trend={kpis.noShowRate <= 10 ? 'up' : 'down'}
            />
          </div>

          <ProcedureChart data={procedureDistribution} title="Distribuição de Procedimentos" description="Mês atual" />

          {/* Top Procedures by Count */}
          <div className="rounded-lg border bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Procedimentos Mais Realizados</h3>
            <div className="space-y-2">
              {kpis.topProcedures.slice(0, 10).map((proc, idx) => (
                <div key={proc.procedureId} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">#{idx + 1}</span>
                    <span className="text-sm font-medium">{proc.procedureName}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{proc.count} procedimentos</div>
                    <div className="text-xs text-muted-foreground">{proc.percentage.toFixed(1)}% do total</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <RecentActivity sessions={kpis.recentSessions} appointments={kpis.upcomingAppointments} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
