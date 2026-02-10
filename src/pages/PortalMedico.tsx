import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { usePedidos } from '@/context/PedidosContext';
import { useToast } from '@/hooks/use-toast';
import { Stethoscope, Plus, FileText, Save, ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { PedidoCardMedico } from '@/components/medico/PedidoCardMedico';

// Wizard components
import {
  WizardState,
  WizardStep,
  FormDestino,
  initialWizardState,
  getFormDestino,
  getStepLabels,
  saveDraft,
  loadDraft,
  clearDraft,
} from '@/components/medico/wizard/types';
import { WizardProgress } from '@/components/medico/wizard/WizardProgress';
import { Passo1Identificacao } from '@/components/medico/wizard/Passo1Identificacao';
import { Passo2Natureza } from '@/components/medico/wizard/Passo2Natureza';
import { Passo3OnLabel } from '@/components/medico/wizard/Passo3OnLabel';
import { PassoReavaliacao } from '@/components/medico/wizard/PassoReavaliacao';
import { Passo5IntroducaoFH } from '@/components/medico/wizard/Passo5IntroducaoFH';
import { Passo6ProtocoloNOC } from '@/components/medico/wizard/Passo6ProtocoloNOC';

export default function PortalMedico() {
  const { toast } = useToast();
  const { pedidos, adicionarPedido } = usePedidos();
  const [activeTab, setActiveTab] = useState('novo');
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [wizardData, setWizardData] = useState<WizardState>(initialWizardState);
  const [hasDraft, setHasDraft] = useState(false);

  // Check for draft on mount
  useEffect(() => {
    const draft = loadDraft();
    if (draft) setHasDraft(true);
  }, []);

  const formDestino = getFormDestino(wizardData);
  const stepLabels = getStepLabels(formDestino);

  const meusPedidos = pedidos.filter(
    p =>
      p.medicoNomeCompleto === wizardData.identificacao.nomeCompleto ||
      p.medico === wizardData.identificacao.nomeCompleto ||
      p.medico === 'Dr. António Silva'
  );

  // Auto-save draft on change
  const handleWizardChange = useCallback((newData: WizardState) => {
    setWizardData(newData);
    saveDraft(newData);
    setHasDraft(true);
  }, []);

  const handleLoadDraft = () => {
    const draft = loadDraft();
    if (draft) {
      setWizardData(draft);
      toast({ title: 'Rascunho recuperado', description: 'Os dados guardados foram carregados.' });
    }
  };

  const handleSaveDraft = () => {
    saveDraft(wizardData);
    toast({ title: 'Rascunho guardado', description: 'Pode retomar mais tarde.' });
  };

  const handleClearAndReset = () => {
    clearDraft();
    setWizardData(initialWizardState);
    setCurrentStep(1);
    setHasDraft(false);
  };

  // Navigation validation
  const canAdvanceFromStep1 = (): boolean => {
    if (!wizardData.identificacao.telemovel) {
      toast({ title: 'Telemóvel obrigatório', description: 'Preencha o telemóvel para continuar.', variant: 'destructive' });
      return false;
    }
    if (!wizardData.vinculoDoente) {
      toast({ title: 'Selecione vínculo', description: 'Indique se o pedido se associa a um doente.', variant: 'destructive' });
      return false;
    }
    if (wizardData.vinculoDoente === 'sim' && !wizardData.doente.validado) {
      toast({ title: 'Doente não validado', description: 'Preencha e valide o ND do doente.', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const canAdvanceFromStep2 = (): boolean => {
    if (!formDestino) {
      toast({ title: 'Selecione o objetivo', description: 'Escolha o tipo/objetivo do pedido.', variant: 'destructive' });
      return false;
    }
    if (wizardData.objetivoSubmissao === 'reavaliacao' && !wizardData.pedidoAnteriorId) {
      toast({ title: 'Selecione o pedido', description: 'Escolha o tratamento ativo para reavaliação.', variant: 'destructive' });
      return false;
    }
    if (wizardData.objetivoSubmissao === 'recurso' && !wizardData.pedidoAnteriorId) {
      toast({ title: 'Selecione o pedido', description: 'Escolha o pedido recusado.', variant: 'destructive' });
      return false;
    }
    if (wizardData.objetivoSubmissao === 'nova-terapeutica' && !wizardData.classificacaoNova) {
      toast({ title: 'Selecione classificação', description: 'Escolha a classificação da nova terapêutica.', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !canAdvanceFromStep1()) return;
    if (currentStep === 2 && !canAdvanceFromStep2()) return;
    if (currentStep < 3) setCurrentStep((currentStep + 1) as WizardStep);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((currentStep - 1) as WizardStep);
  };

  // Submit
  const canSubmit = (): boolean => {
    if (formDestino === 'on-label' || formDestino === 'off-label' || formDestino === 'recurso') {
      const c = wizardData.clinico;
      if (!c.peso || !c.ecog || !c.indicacaoTerapeutica || !c.resumoClinico) return false;
      if (c.farmacos[0] && !c.farmacos[0].medicamentoId && !c.farmacos[0].nomeManual) return false;
      if (formDestino === 'off-label' && !c.bibliografiaPDF) return false;
      if (formDestino === 'recurso' && !wizardData.recurso.fundamentacao) return false;
    }
    if (formDestino === 'reavaliacao') {
      const r = wizardData.reavaliacao;
      if (!r.resultadoClinico || !r.observacoesMedico || !r.decisaoRenovacao) return false;
    }
    if (formDestino === 'introducao-fh') {
      const f = wizardData.introducaoFH;
      if (!f.substanciaAtiva || !f.indicacoesTerapeuticas || !f.justificacaoIntroducao || !f.referenciasPDF) return false;
    }
    if (formDestino === 'protocolo-noc') {
      const p = wizardData.protocoloNOC;
      if (!p.nomeProtocolo || !p.ficheiroDraft) return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!canSubmit()) {
      toast({ title: 'Campos obrigatórios', description: 'Preencha todos os campos obrigatórios.', variant: 'destructive' });
      return;
    }

    // Map to pedido format
    const tipoMap: Record<FormDestino, string> = {
      'on-label': 'casuistico-on',
      'off-label': 'casuistico-off',
      'reavaliacao': 'casuistico-on',
      'recurso': 'casuistico-on',
      'introducao-fh': 'formulario',
      'protocolo-noc': 'protocolo',
      '': 'casuistico-on',
    };

    const base = {
      tipo: tipoMap[formDestino],
      estado: 'submetido' as const,
      dataSubmissao: new Date(),
      dataUltimaAtualizacao: new Date(),
      medicoNomeCompleto: wizardData.identificacao.nomeCompleto,
      medicoTelemovel: wizardData.identificacao.telemovel,
      emailDiretor: '',
      servicoId: wizardData.identificacao.servico,
      medico: wizardData.identificacao.nomeCompleto,
    };

    if (formDestino === 'on-label' || formDestino === 'off-label' || formDestino === 'recurso') {
      const c = wizardData.clinico;
      const farmacoNome = c.farmacos[0]?.medicamentoNome || c.farmacos[0]?.nomeManual || '';
      adicionarPedido({
        ...base,
        doente: {
          ndDoente: wizardData.doente.ndDoente,
          peso: parseFloat(c.peso) || 0,
          altura: parseInt(c.altura) || 0,
          ecog: c.ecog,
          indicacaoTerapeutica: c.indicacaoTerapeutica,
        },
        terapeuticaProposta: farmacoNome,
        linhaTratamento: c.linhaTratamento,
        historiaTerapeuticaPrevia: c.historiaTerapeuticaPrevia,
        resumoClinico: c.resumoClinico,
        aprovadoDiretor: c.aprovadoDiretor || 'sim',
      });
    } else if (formDestino === 'reavaliacao') {
      adicionarPedido({
        ...base,
        doente: { ndDoente: wizardData.doente.ndDoente, peso: 0, ecog: 'na' },
        terapeuticaProposta: 'Reavaliação Terapêutica',
        aprovadoDiretor: 'sim',
        resumoClinico: wizardData.reavaliacao.observacoesMedico,
      });
    } else if (formDestino === 'introducao-fh') {
      const f = wizardData.introducaoFH;
      adicionarPedido({
        ...base,
        doente: { peso: 0, ecog: 'na' },
        terapeuticaProposta: f.substanciaAtiva,
        aprovadoDiretor: f.aprovadoDiretor || 'sim',
        introducaoFormulario: {
          substanciaAtiva: f.substanciaAtiva,
          marcaComercial: f.marcaComercial,
          dosagem: f.dosagem,
          formaFarmaceutica: f.formaFarmaceutica,
          viaAdministracao: f.viaAdministracao,
          indicacoesTerapeuticas: f.indicacoesTerapeuticas,
          indicacoesConstamRCM: f.indicacoesConstamRCM,
          criteriosPrescricao: f.criteriosUtilizacao,
          posologiaDuracao: f.posologiaDuracao,
          previsaoTratamentosAnuais: f.previsaoTratamentosAnuais,
          terapeuticaAtual: f.terapeuticaAtual,
          justificacaoIntroducao: f.justificacaoIntroducao,
        },
      });
    } else if (formDestino === 'protocolo-noc') {
      adicionarPedido({
        ...base,
        doente: { peso: 0, ecog: 'na' },
        terapeuticaProposta: wizardData.protocoloNOC.nomeProtocolo,
        aprovadoDiretor: wizardData.protocoloNOC.aprovadoDiretor || 'sim',
        protocoloNOC: { nomeProtocolo: wizardData.protocoloNOC.nomeProtocolo },
      });
    }

    toast({ title: 'Pedido submetido ✓', description: 'O seu pedido foi submetido com sucesso e aguarda triagem.' });
    handleClearAndReset();
    setActiveTab('pedidos');
  };

  // Render step 3 content based on destination
  const renderFormStep = () => {
    switch (formDestino) {
      case 'on-label':
        return <Passo3OnLabel data={wizardData} onChange={handleWizardChange} />;
      case 'off-label':
        return <Passo3OnLabel data={wizardData} onChange={handleWizardChange} isOffLabel />;
      case 'recurso':
        return <Passo3OnLabel data={wizardData} onChange={handleWizardChange} isRecurso />;
      case 'reavaliacao':
        return <PassoReavaliacao data={wizardData} onChange={handleWizardChange} />;
      case 'introducao-fh':
        return <Passo5IntroducaoFH data={wizardData} onChange={handleWizardChange} />;
      case 'protocolo-noc':
        return <Passo6ProtocoloNOC data={wizardData} onChange={handleWizardChange} />;
      default:
        return null;
    }
  };

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
              <p className="text-muted-foreground">Submissão de pedidos à Comissão de Farmácia e Terapêutica</p>
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
            <div className="max-w-4xl space-y-6">
              {/* Draft banner */}
              {hasDraft && currentStep === 1 && wizardData === initialWizardState && (
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
                  <div>
                    <p className="text-sm font-medium">Rascunho encontrado</p>
                    <p className="text-xs text-muted-foreground">Tem um pedido guardado. Deseja continuar?</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setHasDraft(false)}>Ignorar</Button>
                    <Button size="sm" onClick={handleLoadDraft}>Carregar Rascunho</Button>
                  </div>
                </div>
              )}

              {/* Progress Bar */}
              <WizardProgress currentStep={currentStep} labels={stepLabels} />

              {/* Step Content */}
              {currentStep === 1 && (
                <Passo1Identificacao data={wizardData} onChange={handleWizardChange} />
              )}
              {currentStep === 2 && (
                <Passo2Natureza data={wizardData} onChange={handleWizardChange} />
              )}
              {currentStep === 3 && renderFormStep()}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex gap-2">
                  {currentStep > 1 && (
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={handleSaveDraft}>
                    <Save className="h-4 w-4 mr-2" /> Guardar Rascunho
                  </Button>
                  {currentStep < 3 ? (
                    <Button onClick={handleNext} className="gradient-medico text-white hover:opacity-90">
                      Seguinte <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={!canSubmit()}
                      className="gradient-medico text-white hover:opacity-90"
                    >
                      <Send className="h-4 w-4 mr-2" /> Submeter Pedido
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pedidos">
            <div className="space-y-4">
              {meusPedidos.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Ainda não tem pedidos submetidos.</p>
                    <Button variant="outline" className="mt-4" onClick={() => setActiveTab('novo')}>
                      <Plus className="mr-2 h-4 w-4" /> Criar Novo Pedido
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                meusPedidos.map(pedido => (
                  <PedidoCardMedico key={pedido.id} pedido={pedido} />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
