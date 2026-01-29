import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Stethoscope, 
  Pill, 
  Users, 
  TrendingUp, 
  Calendar,
  ArrowRight,
  Euro,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { usePedidos } from '@/context/PedidosContext';
import { WorkflowIndicator } from '@/components/WorkflowIndicator';
import { reunioesCFT } from '@/lib/data';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

export default function Dashboard() {
  const { getEstatisticas, getPedidosByReuniao } = usePedidos();
  const stats = getEstatisticas();
  
  // Próxima reunião agendada
  const proximaReuniao = reunioesCFT.find(r => r.estado === 'agendada' && r.data >= new Date());
  const pedidosProximaReuniao = proximaReuniao ? getPedidosByReuniao(proximaReuniao.id) : [];

  const portais = [
    {
      titulo: 'Portal Médico',
      descricao: 'Submissão de pedidos terapêuticos',
      icon: Stethoscope,
      path: '/medico',
      gradient: 'gradient-medico',
      stats: 'Submeter novo pedido'
    },
    {
      titulo: 'Portal Farmácia',
      descricao: 'Triagem e encaminhamento',
      icon: Pill,
      path: '/farmacia',
      gradient: 'gradient-farmacia',
      stats: `${stats.emTriagem} pedidos em triagem`
    },
    {
      titulo: 'Portal CFT',
      descricao: 'Deliberação em comissão',
      icon: Users,
      path: '/cft',
      gradient: 'gradient-cft',
      stats: `${stats.emAgenda} pedidos em agenda`
    },
  ];

  return (
    <div className="min-h-screen gradient-dark text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">SGT-CFT</h1>
              <p className="text-sm text-white/60">Sistema de Gestão Terapêutica</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Estatísticas */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-white/10 border-white/20 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">Total Pedidos</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-white/40" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-500/20 border-amber-500/30 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">Em Triagem</p>
                  <p className="text-3xl font-bold">{stats.emTriagem}</p>
                </div>
                <Clock className="h-8 w-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-500/20 border-purple-500/30 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">Em Agenda</p>
                  <p className="text-3xl font-bold">{stats.emAgenda}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-500/20 border-green-500/30 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">Aprovados</p>
                  <p className="text-3xl font-bold">{stats.aprovados}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-500/20 border-blue-500/30 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">Taxa Aprovação</p>
                  <p className="text-3xl font-bold">{stats.taxaAprovacao.toFixed(0)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Impacto Financeiro */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Euro className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-white/60">Impacto Financeiro (Pedidos Aprovados)</p>
                  <p className="text-2xl font-bold text-white">
                    {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(stats.impactoTotal)}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-emerald-400 border-emerald-400/50">
                Custo Total Aprovado
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Workflow Visual */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Fluxo de Trabalho
            </CardTitle>
            <CardDescription className="text-white/60">
              Ciclo de vida dos pedidos terapêuticos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WorkflowIndicator estadoAtual="submetido" className="py-4" />
          </CardContent>
        </Card>

        {/* Portais de Acesso */}
        <section className="grid md:grid-cols-3 gap-6">
          {portais.map(portal => {
            const Icon = portal.icon;
            return (
              <Link key={portal.path} to={portal.path}>
                <Card className={`${portal.gradient} border-0 text-white hover:scale-105 transition-transform cursor-pointer h-full`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Icon className="h-10 w-10" />
                      <ArrowRight className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-xl">{portal.titulo}</CardTitle>
                    <CardDescription className="text-white/80">
                      {portal.descricao}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary" className="bg-white/20 text-white border-0">
                      {portal.stats}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </section>

        {/* Próxima Reunião CFT */}
        {proximaReuniao && (
          <Card className="bg-purple-500/10 border-purple-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Próxima Reunião CFT</CardTitle>
                    <CardDescription className="text-white/60">
                      {format(proximaReuniao.data, "EEEE, d 'de' MMMM 'de' yyyy", { locale: pt })} às {proximaReuniao.hora}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-purple-400">{pedidosProximaReuniao.length}</p>
                  <p className="text-sm text-white/60">pedidos em agenda</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link to="/cft">
                <Button variant="outline" className="border-purple-400/50 text-purple-300 hover:bg-purple-500/20">
                  Ver Agenda Completa
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Alertas */}
        <Card className="bg-orange-500/10 border-orange-500/30">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-orange-400" />
              <p className="text-white/80 text-sm">
                <strong className="text-orange-300">Modo Demonstração:</strong> Os dados apresentados são fictícios e servem apenas para demonstração do sistema.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-white/40 text-sm">
          SGT-CFT © 2025 • Sistema de Gestão Terapêutica - Demonstração
        </div>
      </footer>
    </div>
  );
}
