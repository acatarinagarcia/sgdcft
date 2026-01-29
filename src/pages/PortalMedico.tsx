import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/StatusBadge';
import { WorkflowIndicator } from '@/components/WorkflowIndicator';
import { usePedidos } from '@/context/PedidosContext';
import { farmacos, servicos, tiposPedido, circuitos, Pedido } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { 
  Stethoscope, 
  Plus, 
  FileText, 
  Calculator,
  User,
  Pill,
  Euro,
  Calendar,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

export default function PortalMedico() {
  const { toast } = useToast();
  const { pedidos, adicionarPedido } = usePedidos();
  const [activeTab, setActiveTab] = useState('novo');
  
  // Form state
  const [formData, setFormData] = useState({
    tipo: '',
    iniciais: '',
    idade: '',
    peso: '',
    ecog: '',
    diagnostico: '',
    farmacoId: '',
    dosagem: '',
    posologia: '',
    duracaoMeses: '',
    servicoId: '',
    circuito: '',
    medico: '',
    justificacao: ''
  });

  // Calcular impacto financeiro
  const impacto = useMemo(() => {
    if (!formData.farmacoId || !formData.duracaoMeses) {
      return { custoMensal: 0, custoTotal: 0, custoAteAno: 0 };
    }
    
    const farmaco = farmacos.find(f => f.id === formData.farmacoId);
    if (!farmaco) return { custoMensal: 0, custoTotal: 0, custoAteAno: 0 };
    
    const meses = parseInt(formData.duracaoMeses) || 0;
    const custoMensal = farmaco.precoUnidade * 1.33; // Média de 1.33 unidades/mês
    const custoTotal = custoMensal * meses;
    
    // Cálculo até fim do ano
    const hoje = new Date();
    const fimAno = new Date(hoje.getFullYear(), 11, 31);
    const mesesAteAno = Math.ceil((fimAno.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24 * 30));
    const custoAteAno = custoMensal * Math.min(meses, mesesAteAno);
    
    return { custoMensal, custoTotal, custoAteAno };
  }, [formData.farmacoId, formData.duracaoMeses]);

  // Meus pedidos (simulando médico logado)
  const meusPedidos = pedidos.filter(p => p.medico === 'Dr. António Silva' || p.medico === formData.medico);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tipo || !formData.farmacoId || !formData.servicoId || !formData.justificacao) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor preencha todos os campos obrigatórios.',
        variant: 'destructive'
      });
      return;
    }

    adicionarPedido({
      tipo: formData.tipo,
      estado: 'submetido',
      dataSubmissao: new Date(),
      dataUltimaAtualizacao: new Date(),
      doente: {
        iniciais: formData.iniciais,
        idade: parseInt(formData.idade) || 0,
        peso: parseInt(formData.peso) || 0,
        ecog: parseInt(formData.ecog) || 0,
        diagnostico: formData.diagnostico
      },
      farmacoId: formData.farmacoId,
      dosagem: formData.dosagem,
      posologia: formData.posologia,
      duracaoMeses: parseInt(formData.duracaoMeses) || 0,
      servicoId: formData.servicoId,
      circuito: formData.circuito,
      medico: formData.medico,
      impacto,
      justificacao: formData.justificacao
    });

    toast({
      title: 'Pedido submetido',
      description: 'O seu pedido foi submetido com sucesso e aguarda triagem.',
    });

    // Reset form
    setFormData({
      tipo: '',
      iniciais: '',
      idade: '',
      peso: '',
      ecog: '',
      diagnostico: '',
      farmacoId: '',
      dosagem: '',
      posologia: '',
      duracaoMeses: '',
      servicoId: '',
      circuito: '',
      medico: '',
      justificacao: ''
    });
    
    setActiveTab('pedidos');
  };

  const tipoSelecionado = tiposPedido.find(t => t.id === formData.tipo);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full gradient-medico flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Portal Médico</h1>
              <p className="text-muted-foreground">Submissão e acompanhamento de pedidos terapêuticos</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="novo" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Pedido
            </TabsTrigger>
            <TabsTrigger value="pedidos" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Meus Pedidos
              {meusPedidos.length > 0 && (
                <Badge variant="secondary" className="ml-1">{meusPedidos.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="novo">
            <form onSubmit={handleSubmit}>
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Coluna Principal */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Tipo de Pedido */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Tipo de Pedido</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {tiposPedido.map(tipo => (
                          <div
                            key={tipo.id}
                            onClick={() => setFormData(prev => ({ ...prev, tipo: tipo.id }))}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              formData.tipo === tipo.id 
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                                : 'border-border hover:border-blue-300'
                            }`}
                          >
                            <p className="font-medium">{tipo.nome}</p>
                            <p className="text-sm text-muted-foreground">{tipo.descricao}</p>
                            {tipo.requerCES && (
                              <Badge variant="outline" className="mt-2 text-orange-600 border-orange-300">
                                Requer CES
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Dados do Doente */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Dados do Doente
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                          <Label htmlFor="iniciais">Iniciais</Label>
                          <Input 
                            id="iniciais" 
                            placeholder="ABC"
                            maxLength={4}
                            value={formData.iniciais}
                            onChange={e => setFormData(prev => ({ ...prev, iniciais: e.target.value.toUpperCase() }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="idade">Idade</Label>
                          <Input 
                            id="idade" 
                            type="number"
                            placeholder="65"
                            value={formData.idade}
                            onChange={e => setFormData(prev => ({ ...prev, idade: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="peso">Peso (kg)</Label>
                          <Input 
                            id="peso" 
                            type="number"
                            placeholder="70"
                            value={formData.peso}
                            onChange={e => setFormData(prev => ({ ...prev, peso: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="ecog">ECOG</Label>
                          <Select value={formData.ecog} onValueChange={v => setFormData(prev => ({ ...prev, ecog: v }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="0-4" />
                            </SelectTrigger>
                            <SelectContent>
                              {[0, 1, 2, 3, 4].map(n => (
                                <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="diagnostico">Diagnóstico</Label>
                        <Input 
                          id="diagnostico"
                          placeholder="Ex: Carcinoma pulmonar de não pequenas células - Estadio IV"
                          value={formData.diagnostico}
                          onChange={e => setFormData(prev => ({ ...prev, diagnostico: e.target.value }))}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Medicamento */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Pill className="h-5 w-5" />
                        Medicamento
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Fármaco</Label>
                        <Select value={formData.farmacoId} onValueChange={v => setFormData(prev => ({ ...prev, farmacoId: v }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o medicamento" />
                          </SelectTrigger>
                          <SelectContent>
                            {farmacos.map(f => (
                              <SelectItem key={f.id} value={f.id}>
                                <div className="flex items-center gap-2">
                                  <span>{f.nome}</span>
                                  <Badge variant="outline" className="text-xs">{f.apresentacao}</Badge>
                                  <span className="text-muted-foreground text-sm">
                                    {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(f.precoUnidade)}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="dosagem">Dosagem</Label>
                          <Input 
                            id="dosagem"
                            placeholder="Ex: 200mg"
                            value={formData.dosagem}
                            onChange={e => setFormData(prev => ({ ...prev, dosagem: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="posologia">Posologia</Label>
                          <Input 
                            id="posologia"
                            placeholder="Ex: q3w"
                            value={formData.posologia}
                            onChange={e => setFormData(prev => ({ ...prev, posologia: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="duracao">Duração (meses)</Label>
                          <Input 
                            id="duracao"
                            type="number"
                            placeholder="12"
                            value={formData.duracaoMeses}
                            onChange={e => setFormData(prev => ({ ...prev, duracaoMeses: e.target.value }))}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Serviço e Circuito */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Serviço e Dispensa</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <Label>Serviço</Label>
                          <Select value={formData.servicoId} onValueChange={v => setFormData(prev => ({ ...prev, servicoId: v }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {servicos.map(s => (
                                <SelectItem key={s.id} value={s.id}>{s.nome}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Circuito de Dispensa</Label>
                          <Select value={formData.circuito} onValueChange={v => setFormData(prev => ({ ...prev, circuito: v }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {circuitos.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="medico">Médico Prescritor</Label>
                          <Input 
                            id="medico"
                            placeholder="Dr. Nome Apelido"
                            value={formData.medico}
                            onChange={e => setFormData(prev => ({ ...prev, medico: e.target.value }))}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Justificação */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Justificação Clínica</CardTitle>
                      <CardDescription>
                        Descreva a fundamentação clínica para este pedido
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea 
                        placeholder="Descreva a indicação, linha de tratamento, estado do doente e fundamentação para o uso deste medicamento..."
                        className="min-h-[120px]"
                        maxLength={1000}
                        value={formData.justificacao}
                        onChange={e => setFormData(prev => ({ ...prev, justificacao: e.target.value }))}
                      />
                      <p className="text-sm text-muted-foreground mt-2 text-right">
                        {formData.justificacao.length}/1000 caracteres
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar - Impacto e Submissão */}
                <div className="space-y-6">
                  {/* Impacto Financeiro */}
                  <Card className="sticky top-20">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        Impacto Financeiro
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 rounded-lg bg-muted space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Custo Mensal</span>
                          <span className="font-semibold">
                            {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(impacto.custoMensal)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Custo Total</span>
                          <span className="font-semibold">
                            {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(impacto.custoTotal)}
                          </span>
                        </div>
                        <div className="border-t pt-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Até fim do ano</span>
                            <span className="font-bold text-lg text-blue-600">
                              {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(impacto.custoAteAno)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {tipoSelecionado?.requerCES && (
                        <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/20 border border-orange-300">
                          <p className="text-sm text-orange-800 dark:text-orange-200">
                            ⚠️ Este tipo de pedido requer aprovação da Comissão de Ética para a Saúde (CES)
                          </p>
                        </div>
                      )}

                      <Button type="submit" className="w-full gradient-medico hover:opacity-90" size="lg">
                        <Plus className="mr-2 h-5 w-5" />
                        Submeter Pedido
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="pedidos">
            <div className="space-y-4">
              {meusPedidos.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Ainda não tem pedidos submetidos.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setActiveTab('novo')}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Criar Novo Pedido
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                meusPedidos.map(pedido => (
                  <PedidoCard key={pedido.id} pedido={pedido} />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function PedidoCard({ pedido }: { pedido: Pedido }) {
  const farmaco = farmacos.find(f => f.id === pedido.farmacoId);
  const servico = servicos.find(s => s.id === pedido.servicoId);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg font-mono">{pedido.codigo}</CardTitle>
              <StatusBadge estado={pedido.estado} />
            </div>
            <CardDescription>
              Submetido em {format(pedido.dataSubmissao, "d 'de' MMMM 'de' yyyy", { locale: pt })}
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="font-semibold text-blue-600">
              {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(pedido.impacto.custoTotal)}
            </p>
            <p className="text-sm text-muted-foreground">custo total</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Doente</p>
            <p className="font-medium">{pedido.doente.iniciais} • {pedido.doente.idade} anos</p>
          </div>
          <div>
            <p className="text-muted-foreground">Diagnóstico</p>
            <p className="font-medium">{pedido.doente.diagnostico}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Medicamento</p>
            <p className="font-medium">{farmaco?.nome} {pedido.dosagem}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Serviço</p>
            <p className="font-medium">{servico?.nome}</p>
          </div>
        </div>

        <WorkflowIndicator estadoAtual={pedido.estado} />

        {/* Timeline do histórico */}
        <div className="pt-4 border-t">
          <p className="text-sm font-medium mb-3">Histórico</p>
          <div className="space-y-2">
            {pedido.historico.slice(-3).map((h, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground">
                    {format(h.data, "d MMM yyyy, HH:mm", { locale: pt })}
                  </p>
                  <p>{h.observacao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
