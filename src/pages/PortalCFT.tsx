import { useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/StatusBadge';
import { usePedidos } from '@/context/PedidosContext';
import { farmacos, servicos, tiposPedido, reunioesCFT, Pedido, ReuniaoCFT } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Calendar,
  Clock,
  Euro,
  CheckCircle,
  XCircle,
  RotateCcw,
  FileText,
  Pill,
  User,
  Building
} from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

export default function PortalCFT() {
  const { toast } = useToast();
  const { pedidos, getPedidosByReuniao, deliberar } = usePedidos();
  const [reuniaoSelecionada, setReuniaoSelecionada] = useState<ReuniaoCFT | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [pedidoDeliberacao, setPedidoDeliberacao] = useState<Pedido | null>(null);
  const [decisao, setDecisao] = useState<'favoravel' | 'desfavoravel' | 'adiado' | null>(null);
  const [observacao, setObservacao] = useState('');
  const [numeroAta, setNumeroAta] = useState('');

  // Reuniões futuras
  const reunioesFuturas = reunioesCFT.filter(r => r.estado === 'agendada' && r.data >= new Date());
  
  // Pedidos deliberados
  const pedidosDeliberados = pedidos.filter(p => p.estado === 'aprovado' || p.estado === 'rejeitado');

  // Pedidos da reunião selecionada
  const pedidosReuniao = reuniaoSelecionada ? getPedidosByReuniao(reuniaoSelecionada.id) : [];

  // Impacto total da reunião
  const impactoReuniao = pedidosReuniao.reduce((acc, p) => acc + (p.impacto?.custoTotal || 0), 0);

  const handleAbrirDeliberacao = (pedido: Pedido) => {
    setPedidoDeliberacao(pedido);
    setDecisao(null);
    setObservacao('');
    setDialogAberto(true);
  };

  const handleConfirmarDeliberacao = () => {
    if (!pedidoDeliberacao || !decisao) return;

    deliberar(pedidoDeliberacao.id, decisao, observacao || `Decisão CFT: ${decisao}`);
    
    const mensagens = {
      favoravel: 'Parecer favorável emitido. Aguarda aprovação do CA.',
      desfavoravel: 'Pedido não aprovado pela CFT.',
      adiado: 'Pedido adiado para próxima reunião.'
    };

    toast({
      title: 'Deliberação registada',
      description: mensagens[decisao],
    });

    setDialogAberto(false);
    setPedidoDeliberacao(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full gradient-cft flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Portal CFT</h1>
              <p className="text-muted-foreground">Comissão de Farmácia e Terapêutica</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="reunioes">
          <TabsList className="mb-6">
            <TabsTrigger value="reunioes" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Reuniões
            </TabsTrigger>
            <TabsTrigger value="historico" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Histórico
              {pedidosDeliberados.length > 0 && (
                <Badge variant="secondary">{pedidosDeliberados.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reunioes">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Lista de Reuniões */}
              <div className="space-y-4">
                <h2 className="font-semibold text-lg">Próximas Reuniões</h2>
                {reunioesFuturas.map(reuniao => {
                  const pedidosCount = getPedidosByReuniao(reuniao.id).length;
                  const isSelected = reuniaoSelecionada?.id === reuniao.id;
                  
                  return (
                    <Card 
                      key={reuniao.id}
                      className={`cursor-pointer transition-all ${
                        isSelected ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-950' : 'hover:border-purple-300'
                      }`}
                      onClick={() => setReuniaoSelecionada(reuniao)}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              {format(reuniao.data, "d 'de' MMMM", { locale: pt })}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {reuniao.hora}
                            </p>
                          </div>
                          <Badge className="gradient-cft text-white border-0">
                            {pedidosCount} pedidos
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {reunioesFuturas.length === 0 && (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Sem reuniões agendadas</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Agenda da Reunião */}
              <div className="lg:col-span-2">
                {reuniaoSelecionada ? (
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-purple-500" />
                            Reunião CFT - {format(reuniaoSelecionada.data, "d 'de' MMMM 'de' yyyy", { locale: pt })}
                          </CardTitle>
                          <CardDescription>
                            Horário: {reuniaoSelecionada.hora} • {pedidosReuniao.length} pedidos em agenda
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Impacto Total</p>
                          <p className="text-xl font-bold text-purple-600">
                            {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(impactoReuniao)}
                          </p>
                        </div>
                      </div>

                      {/* Número de Ata */}
                      <div className="flex items-center gap-2 mt-4">
                        <Label htmlFor="ata" className="text-sm">Nº Ata:</Label>
                        <Input 
                          id="ata"
                          placeholder="Ex: 2025/01"
                          value={numeroAta}
                          onChange={e => setNumeroAta(e.target.value)}
                          className="w-32"
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      {pedidosReuniao.length === 0 ? (
                        <div className="py-8 text-center">
                          <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">Nenhum pedido agendado para esta reunião</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {pedidosReuniao.map((pedido, index) => (
                            <PedidoAgendaCard 
                              key={pedido.id}
                              pedido={pedido}
                              numero={index + 1}
                              onDeliberar={() => handleAbrirDeliberacao(pedido)}
                            />
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="py-16 text-center">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Selecione uma reunião para ver a agenda
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="historico">
            <div className="space-y-4">
              {pedidosDeliberados.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Ainda não existem pedidos deliberados.</p>
                  </CardContent>
                </Card>
              ) : (
                pedidosDeliberados.map(pedido => (
                  <PedidoHistoricoCard key={pedido.id} pedido={pedido} />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialog de Deliberação */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Deliberação CFT</DialogTitle>
            <DialogDescription>
              Pedido: {pedidoDeliberacao?.codigo}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Botões de decisão */}
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={decisao === 'favoravel' ? 'default' : 'outline'}
                className={decisao === 'favoravel' ? 'bg-green-600 hover:bg-green-700' : ''}
                onClick={() => setDecisao('favoravel')}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Favorável
              </Button>
              <Button
                variant={decisao === 'desfavoravel' ? 'default' : 'outline'}
                className={decisao === 'desfavoravel' ? 'bg-red-600 hover:bg-red-700' : ''}
                onClick={() => setDecisao('desfavoravel')}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Desfavorável
              </Button>
              <Button
                variant={decisao === 'adiado' ? 'default' : 'outline'}
                className={decisao === 'adiado' ? 'bg-amber-600 hover:bg-amber-700' : ''}
                onClick={() => setDecisao('adiado')}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Adiado
              </Button>
            </div>

            <div>
              <Label>Observações</Label>
              <Textarea
                placeholder="Fundamentação da decisão..."
                value={observacao}
                onChange={e => setObservacao(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogAberto(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmarDeliberacao}
              disabled={!decisao}
              className="gradient-cft"
            >
              Confirmar Decisão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PedidoAgendaCard({ pedido, numero, onDeliberar }: { pedido: Pedido; numero: number; onDeliberar: () => void }) {
  const farmaco = farmacos.find(f => f.id === pedido.farmacoId);
  const servico = servicos.find(s => s.id === pedido.servicoId);
  const tipoPedido = tiposPedido.find(t => t.id === pedido.tipo);

  return (
    <Card className="border-l-4 border-l-purple-500">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <span className="text-sm font-bold text-purple-600">{numero}</span>
            </div>
            <div>
              <p className="font-mono font-medium">{pedido.codigo}</p>
              <p className="text-sm text-muted-foreground">{tipoPedido?.nome}</p>
            </div>
          </div>
          <Button onClick={onDeliberar} className="gradient-cft">
            Deliberar
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <User className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-muted-foreground">Doente</p>
              <p>{pedido.doente.ndDoente || pedido.doente.iniciais} • ECOG {pedido.doente.ecog}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Pill className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-muted-foreground">Terapêutica Proposta</p>
              <p>{pedido.terapeuticaProposta || (farmaco?.nome ? `${farmaco.nome} ${pedido.dosagem || ''}` : '-')}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 p-3 rounded bg-muted/50">
          <p className="text-sm text-muted-foreground mb-1">Indicação</p>
          <p className="text-sm">{pedido.doente.indicacaoTerapeutica || pedido.doente.diagnostico}</p>
        </div>

        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {servico?.nome} • {pedido.medicoNomeCompleto || pedido.medico}
          </span>
          {pedido.impacto && (
            <span className="font-semibold text-purple-600">
              {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(pedido.impacto.custoTotal)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function PedidoHistoricoCard({ pedido }: { pedido: Pedido }) {
  const farmaco = farmacos.find(f => f.id === pedido.farmacoId);
  const servico = servicos.find(s => s.id === pedido.servicoId);

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
              pedido.estado === 'aprovado' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
            }`}>
              {pedido.estado === 'aprovado' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
            </div>
            <div>
              <p className="font-mono font-medium">{pedido.codigo}</p>
              <p className="text-sm text-muted-foreground">
                {format(pedido.dataUltimaAtualizacao, "d 'de' MMMM 'de' yyyy", { locale: pt })}
              </p>
            </div>
          </div>
          <StatusBadge estado={pedido.estado} />
        </div>

        <div className="mt-4 grid sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Doente</p>
            <p>{pedido.doente.ndDoente || pedido.doente.iniciais}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Indicação</p>
            <p>{pedido.doente.indicacaoTerapeutica || pedido.doente.diagnostico}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Terapêutica</p>
            <p>{pedido.terapeuticaProposta || farmaco?.nome}</p>
          </div>
        </div>
        {pedido.impacto && (
          <div className="mt-3 pt-3 border-t">
            <span className="text-sm text-muted-foreground">Impacto: </span>
            <span className="font-semibold">
              {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(pedido.impacto.custoTotal)}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
