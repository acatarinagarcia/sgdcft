import { useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/StatusBadge';
import { WorkflowIndicator } from '@/components/WorkflowIndicator';
import { usePedidos } from '@/context/PedidosContext';
import { farmacos, servicos, tiposPedido, reunioesCFT, Pedido, EstadoPedido } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { 
  Pill, 
  Search,
  Calendar,
  ArrowRight,
  Clock,
  FileText,
  User,
  Euro,
  AlertCircle,
  CheckCircle,
  Send,
  Building
} from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

type FiltroEstado = 'todos' | 'submetido' | 'em-triagem' | 'pendente-info';

export default function PortalFarmacia() {
  const { toast } = useToast();
  const { pedidos, atualizarEstado, agendarCFT } = usePedidos();
  const [filtro, setFiltro] = useState<FiltroEstado>('todos');
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);
  const [reuniaoSelecionada, setReuniaoSelecionada] = useState('');
  const [observacao, setObservacao] = useState('');
  const [dialogAberto, setDialogAberto] = useState(false);
  const [acaoDialog, setAcaoDialog] = useState<'agendar' | 'info' | 'dc'>('agendar');

  // Filtrar pedidos para triagem
  const pedidosFiltrados = pedidos.filter(p => {
    if (filtro === 'todos') {
      return ['submetido', 'em-triagem', 'pendente-info'].includes(p.estado);
    }
    return p.estado === filtro;
  });

  // Contadores
  const contadores = {
    todos: pedidos.filter(p => ['submetido', 'em-triagem', 'pendente-info'].includes(p.estado)).length,
    submetido: pedidos.filter(p => p.estado === 'submetido').length,
    'em-triagem': pedidos.filter(p => p.estado === 'em-triagem').length,
    'pendente-info': pedidos.filter(p => p.estado === 'pendente-info').length,
  };

  const reunioesDisponiveis = reunioesCFT.filter(r => r.estado === 'agendada' && r.data >= new Date());

  const handleIniciarTriagem = (pedido: Pedido) => {
    atualizarEstado(pedido.id, 'em-triagem', 'Triagem iniciada pela farmácia');
    toast({
      title: 'Triagem iniciada',
      description: `Pedido ${pedido.codigo} está agora em triagem.`,
    });
  };

  const handleAbrirDialog = (pedido: Pedido, acao: 'agendar' | 'info' | 'dc') => {
    setPedidoSelecionado(pedido);
    setAcaoDialog(acao);
    setReuniaoSelecionada('');
    setObservacao('');
    setDialogAberto(true);
  };

  const handleConfirmarAcao = () => {
    if (!pedidoSelecionado) return;

    if (acaoDialog === 'agendar' && reuniaoSelecionada) {
      agendarCFT(pedidoSelecionado.id, reuniaoSelecionada);
      const reuniao = reunioesCFT.find(r => r.id === reuniaoSelecionada);
      toast({
        title: 'Pedido agendado',
        description: `Agendado para CFT de ${reuniao ? format(reuniao.data, "d 'de' MMMM", { locale: pt }) : ''}`,
      });
    } else if (acaoDialog === 'info') {
      atualizarEstado(pedidoSelecionado.id, 'pendente-info', observacao || 'Solicitada informação adicional ao médico');
      toast({
        title: 'Informação solicitada',
        description: 'O médico será notificado para fornecer informação adicional.',
      });
    } else if (acaoDialog === 'dc') {
      atualizarEstado(pedidoSelecionado.id, 'encaminhado-dc', observacao || 'Encaminhado para aprovação da Direção Clínica');
      toast({
        title: 'Encaminhado',
        description: 'Pedido encaminhado para Direção Clínica.',
      });
    }

    setDialogAberto(false);
    setPedidoSelecionado(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full gradient-farmacia flex items-center justify-center">
              <Pill className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Portal Farmácia</h1>
              <p className="text-muted-foreground">Triagem técnica e encaminhamento de pedidos</p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['todos', 'submetido', 'em-triagem', 'pendente-info'] as FiltroEstado[]).map(f => (
            <Button
              key={f}
              variant={filtro === f ? 'default' : 'outline'}
              onClick={() => setFiltro(f)}
              className={filtro === f ? 'gradient-farmacia' : ''}
            >
              {f === 'todos' ? 'Todos' : 
               f === 'submetido' ? 'Aguardam Triagem' :
               f === 'em-triagem' ? 'Em Triagem' : 'Pendente Info'}
              <Badge variant="secondary" className="ml-2 bg-white/20">
                {contadores[f]}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Lista de Pedidos */}
        <div className="space-y-4">
          {pedidosFiltrados.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Não existem pedidos neste filtro.</p>
              </CardContent>
            </Card>
          ) : (
            pedidosFiltrados.map(pedido => (
              <PedidoTriagemCard 
                key={pedido.id} 
                pedido={pedido}
                onIniciarTriagem={() => handleIniciarTriagem(pedido)}
                onAgendar={() => handleAbrirDialog(pedido, 'agendar')}
                onPedirInfo={() => handleAbrirDialog(pedido, 'info')}
                onEncaminharDC={() => handleAbrirDialog(pedido, 'dc')}
              />
            ))
          )}
        </div>
      </main>

      {/* Dialog de Ação */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {acaoDialog === 'agendar' && 'Agendar para Reunião CFT'}
              {acaoDialog === 'info' && 'Solicitar Informação Adicional'}
              {acaoDialog === 'dc' && 'Encaminhar para Direção Clínica'}
            </DialogTitle>
            <DialogDescription>
              Pedido: {pedidoSelecionado?.codigo}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {acaoDialog === 'agendar' && (
              <div>
                <Label>Selecione a Reunião</Label>
                <Select value={reuniaoSelecionada} onValueChange={setReuniaoSelecionada}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha uma data" />
                  </SelectTrigger>
                  <SelectContent>
                    {reunioesDisponiveis.map(r => (
                      <SelectItem key={r.id} value={r.id}>
                        {format(r.data, "EEEE, d 'de' MMMM 'de' yyyy", { locale: pt })} às {r.hora}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {(acaoDialog === 'info' || acaoDialog === 'dc') && (
              <div>
                <Label>Observação</Label>
                <Textarea
                  placeholder={acaoDialog === 'info' 
                    ? 'Descreva a informação necessária...'
                    : 'Motivo do encaminhamento...'}
                  value={observacao}
                  onChange={e => setObservacao(e.target.value)}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogAberto(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmarAcao}
              disabled={acaoDialog === 'agendar' && !reuniaoSelecionada}
              className="gradient-farmacia"
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface PedidoTriagemCardProps {
  pedido: Pedido;
  onIniciarTriagem: () => void;
  onAgendar: () => void;
  onPedirInfo: () => void;
  onEncaminharDC: () => void;
}

function PedidoTriagemCard({ pedido, onIniciarTriagem, onAgendar, onPedirInfo, onEncaminharDC }: PedidoTriagemCardProps) {
  const farmaco = farmacos.find(f => f.id === pedido.farmacoId);
  const servico = servicos.find(s => s.id === pedido.servicoId);
  const tipoPedido = tiposPedido.find(t => t.id === pedido.tipo);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <CardTitle className="text-lg font-mono">{pedido.codigo}</CardTitle>
              <StatusBadge estado={pedido.estado} />
              <Badge variant="outline">{tipoPedido?.nome}</Badge>
              {tipoPedido?.requerCES && (
                <Badge variant="outline" className="text-orange-600 border-orange-300">CES</Badge>
              )}
            </div>
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              Submetido em {format(pedido.dataSubmissao, "d 'de' MMMM", { locale: pt })} por {pedido.medicoNomeCompleto || pedido.medico}
            </CardDescription>
          </div>
          {pedido.impacto && (
            <div className="text-right">
              <p className="font-semibold text-green-600 text-lg">
                {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(pedido.impacto.custoTotal)}
              </p>
              <p className="text-sm text-muted-foreground">{pedido.duracaoMeses || '-'} meses</p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Informações principais */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <User className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-muted-foreground">Doente</p>
              <p className="font-medium">
                {pedido.doente.ndDoente || pedido.doente.iniciais} • {pedido.doente.peso}kg • ECOG {pedido.doente.ecog}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Pill className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-muted-foreground">Terapêutica Proposta</p>
              <p className="font-medium">
                {pedido.terapeuticaProposta || (farmaco?.nome ? `${farmaco.nome} ${pedido.dosagem || ''} ${pedido.posologia || ''}` : '-')}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Building className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-muted-foreground">Serviço</p>
              <p className="font-medium">{servico?.nome}</p>
            </div>
          </div>
          {pedido.impacto && (
            <div className="flex items-start gap-2">
              <Euro className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-muted-foreground">Impacto Mensal</p>
                <p className="font-medium">
                  {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(pedido.impacto.custoMensal)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Indicação e Resumo Clínico */}
        <div className="p-4 rounded-lg bg-muted/50 space-y-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Indicação Terapêutica</p>
            <p className="text-sm">{pedido.doente.indicacaoTerapeutica || pedido.doente.diagnostico}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Resumo Clínico</p>
            <p className="text-sm">{pedido.resumoClinico || pedido.justificacao}</p>
          </div>
        </div>

        {/* Workflow */}
        <WorkflowIndicator estadoAtual={pedido.estado} />

        {/* Ações */}
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          {pedido.estado === 'submetido' && (
            <Button onClick={onIniciarTriagem} className="gradient-farmacia text-white">
              <Search className="mr-2 h-4 w-4" />
              Iniciar Triagem
            </Button>
          )}

          {pedido.estado === 'em-triagem' && (
            <>
              <Button onClick={onAgendar} className="gradient-cft text-white">
                <Calendar className="mr-2 h-4 w-4" />
                Agendar CFT
              </Button>
              <Button variant="outline" onClick={onPedirInfo}>
                <AlertCircle className="mr-2 h-4 w-4" />
                Pedir Informação
              </Button>
              <Button variant="outline" onClick={onEncaminharDC}>
                <Send className="mr-2 h-4 w-4" />
                Encaminhar DC
              </Button>
            </>
          )}

          {pedido.estado === 'pendente-info' && (
            <Badge variant="outline" className="text-orange-600">
              <Clock className="mr-1 h-3 w-3" />
              Aguarda resposta do médico
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
