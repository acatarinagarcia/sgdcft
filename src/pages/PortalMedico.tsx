import { useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { usePedidos } from '@/context/PedidosContext';
import { tiposPedido } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Stethoscope, Plus, FileText } from 'lucide-react';

// Componentes do formulário
import { IdentificacaoMedico } from '@/components/medico/IdentificacaoMedico';
import { TipoPedido } from '@/components/medico/TipoPedido';
import { InformacaoClinica, InformacaoClinicaData } from '@/components/medico/InformacaoClinica';
import { IntroducaoFormulario, IntroducaoFormularioData } from '@/components/medico/IntroducaoFormulario';
import { ProtocoloNOC, ProtocoloNOCData } from '@/components/medico/ProtocoloNOC';
import { PedidoCardMedico } from '@/components/medico/PedidoCardMedico';

// Estado inicial dos formulários
const initialIdentificacao = {
  nomeCompleto: '',
  servicoId: '',
  telemovel: '',
  emailDiretor: ''
};

const initialInformacaoClinica: InformacaoClinicaData = {
  ndDoente: '',
  peso: '',
  altura: '',
  ecog: '',
  indicacaoTerapeutica: '',
  terapeuticaProposta: '',
  linhaTratamento: '',
  historiaTerapeuticaPrevia: '',
  resumoClinico: '',
  aprovadoDiretor: ''
};

const initialIntroducaoFormulario: IntroducaoFormularioData = {
  substanciaAtiva: '',
  marcaComercial: '',
  dosagem: '',
  formaFarmaceutica: '',
  viaAdministracao: '',
  indicacoesTerapeuticas: '',
  indicacoesConstamRCM: '',
  criteriosPrescricao: '',
  posologiaDuracao: '',
  previsaoTratamentosAnuais: '',
  terapeuticaAtual: '',
  justificacaoIntroducao: '',
  aprovadoDiretor: '',
  emailDiretor: ''
};

const initialProtocoloNOC: ProtocoloNOCData = {
  nomeProtocolo: '',
  aprovadoDiretor: '',
  emailDiretor: ''
};

export default function PortalMedico() {
  const { toast } = useToast();
  const { pedidos, adicionarPedido } = usePedidos();
  const [activeTab, setActiveTab] = useState('novo');
  
  // Estado do formulário
  const [tipoPedido, setTipoPedido] = useState('');
  const [identificacao, setIdentificacao] = useState(initialIdentificacao);
  const [infoClinica, setInfoClinica] = useState(initialInformacaoClinica);
  const [introducaoFormulario, setIntroducaoFormulario] = useState(initialIntroducaoFormulario);
  const [protocoloNOC, setProtocoloNOC] = useState(initialProtocoloNOC);

  // Meus pedidos (filtra pelo nome do médico)
  const meusPedidos = pedidos.filter(p => 
    p.medicoNomeCompleto === identificacao.nomeCompleto || 
    p.medico === identificacao.nomeCompleto ||
    p.medico === 'Dr. António Silva' // Demo
  );

  const tipoSelecionado = tiposPedido.find(t => t.id === tipoPedido);
  const isCasuistico = tipoPedido === 'casuistico-on' || tipoPedido === 'casuistico-off';
  const isIntroducao = tipoPedido === 'formulario';
  const isProtocolo = tipoPedido === 'protocolo';

  const validarFormulario = (): boolean => {
    // Validar identificação do médico
    if (!identificacao.nomeCompleto || !identificacao.servicoId || !identificacao.telemovel) {
      toast({
        title: 'Identificação incompleta',
        description: 'Por favor preencha todos os dados de identificação do médico.',
        variant: 'destructive'
      });
      return false;
    }

    // Validar tipo de pedido
    if (!tipoPedido) {
      toast({
        title: 'Tipo de pedido',
        description: 'Por favor selecione o tipo de pedido.',
        variant: 'destructive'
      });
      return false;
    }

    // Validar campos específicos por tipo
    if (isCasuistico) {
      if (!infoClinica.ndDoente || !infoClinica.peso || !infoClinica.terapeuticaProposta || !infoClinica.resumoClinico) {
        toast({
          title: 'Informação clínica incompleta',
          description: 'Por favor preencha todos os campos obrigatórios da informação clínica.',
          variant: 'destructive'
        });
        return false;
      }
      if (infoClinica.aprovadoDiretor !== 'sim') {
        toast({
          title: 'Aprovação necessária',
          description: 'O pedido necessita de aprovação do Diretor de Serviço.',
          variant: 'destructive'
        });
        return false;
      }
    }

    if (isIntroducao) {
      if (!introducaoFormulario.substanciaAtiva || !introducaoFormulario.indicacoesTerapeuticas || !introducaoFormulario.justificacaoIntroducao) {
        toast({
          title: 'Dados do medicamento incompletos',
          description: 'Por favor preencha todos os campos obrigatórios.',
          variant: 'destructive'
        });
        return false;
      }
      if (introducaoFormulario.aprovadoDiretor !== 'sim') {
        toast({
          title: 'Aprovação necessária',
          description: 'O pedido necessita de aprovação do Diretor de Serviço.',
          variant: 'destructive'
        });
        return false;
      }
    }

    if (isProtocolo) {
      if (!protocoloNOC.nomeProtocolo) {
        toast({
          title: 'Protocolo não identificado',
          description: 'Por favor identifique o protocolo/norma.',
          variant: 'destructive'
        });
        return false;
      }
      if (protocoloNOC.aprovadoDiretor !== 'sim') {
        toast({
          title: 'Aprovação necessária',
          description: 'O pedido necessita de aprovação do Diretor de Serviço.',
          variant: 'destructive'
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;

    // Construir o pedido conforme o tipo
    const pedidoBase = {
      tipo: tipoPedido,
      estado: 'submetido' as const,
      dataSubmissao: new Date(),
      dataUltimaAtualizacao: new Date(),
      medicoNomeCompleto: identificacao.nomeCompleto,
      medicoTelemovel: identificacao.telemovel,
      emailDiretor: identificacao.emailDiretor,
      servicoId: identificacao.servicoId,
      medico: identificacao.nomeCompleto, // Para compatibilidade
    };

    if (isCasuistico) {
      adicionarPedido({
        ...pedidoBase,
        doente: {
          ndDoente: infoClinica.ndDoente,
          peso: parseInt(infoClinica.peso) || 0,
          altura: parseInt(infoClinica.altura) || 0,
          ecog: infoClinica.ecog,
          indicacaoTerapeutica: infoClinica.indicacaoTerapeutica,
        },
        terapeuticaProposta: infoClinica.terapeuticaProposta,
        linhaTratamento: infoClinica.linhaTratamento,
        historiaTerapeuticaPrevia: infoClinica.historiaTerapeuticaPrevia,
        resumoClinico: infoClinica.resumoClinico,
        aprovadoDiretor: infoClinica.aprovadoDiretor,
      });
    } else if (isIntroducao) {
      adicionarPedido({
        ...pedidoBase,
        doente: { peso: 0, ecog: 'na' },
        terapeuticaProposta: introducaoFormulario.substanciaAtiva,
        aprovadoDiretor: introducaoFormulario.aprovadoDiretor,
        introducaoFormulario: {
          substanciaAtiva: introducaoFormulario.substanciaAtiva,
          marcaComercial: introducaoFormulario.marcaComercial,
          dosagem: introducaoFormulario.dosagem,
          formaFarmaceutica: introducaoFormulario.formaFarmaceutica,
          viaAdministracao: introducaoFormulario.viaAdministracao,
          indicacoesTerapeuticas: introducaoFormulario.indicacoesTerapeuticas,
          indicacoesConstamRCM: introducaoFormulario.indicacoesConstamRCM,
          criteriosPrescricao: introducaoFormulario.criteriosPrescricao,
          posologiaDuracao: introducaoFormulario.posologiaDuracao,
          previsaoTratamentosAnuais: introducaoFormulario.previsaoTratamentosAnuais,
          terapeuticaAtual: introducaoFormulario.terapeuticaAtual,
          justificacaoIntroducao: introducaoFormulario.justificacaoIntroducao,
        },
      });
    } else if (isProtocolo) {
      adicionarPedido({
        ...pedidoBase,
        doente: { peso: 0, ecog: 'na' },
        terapeuticaProposta: protocoloNOC.nomeProtocolo,
        aprovadoDiretor: protocoloNOC.aprovadoDiretor,
        protocoloNOC: {
          nomeProtocolo: protocoloNOC.nomeProtocolo,
        },
      });
    }

    toast({
      title: 'Pedido submetido',
      description: 'O seu pedido foi submetido com sucesso e aguarda triagem.',
    });

    // Reset todos os formulários
    setTipoPedido('');
    setIdentificacao(initialIdentificacao);
    setInfoClinica(initialInformacaoClinica);
    setIntroducaoFormulario(initialIntroducaoFormulario);
    setProtocoloNOC(initialProtocoloNOC);
    
    setActiveTab('pedidos');
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
            <form onSubmit={handleSubmit}>
              <div className="space-y-6 max-w-4xl">
                {/* Identificação do Médico */}
                <IdentificacaoMedico 
                  data={identificacao}
                  onChange={setIdentificacao}
                />

                {/* Tipo de Pedido */}
                <TipoPedido 
                  value={tipoPedido}
                  onChange={setTipoPedido}
                />

                {/* Formulário específico por tipo */}
                {isCasuistico && (
                  <InformacaoClinica 
                    data={infoClinica}
                    onChange={setInfoClinica}
                    tipoPedido={tipoPedido}
                  />
                )}

                {isIntroducao && (
                  <IntroducaoFormulario 
                    data={introducaoFormulario}
                    onChange={setIntroducaoFormulario}
                  />
                )}

                {isProtocolo && (
                  <ProtocoloNOC 
                    data={protocoloNOC}
                    onChange={setProtocoloNOC}
                  />
                )}

                {/* Aviso CES para off-label */}
                {tipoSelecionado?.requerCES && (
                  <div className="p-4 rounded-lg bg-orange-100 dark:bg-orange-900/20 border border-orange-300">
                    <p className="text-sm text-orange-800 dark:text-orange-200">
                      ⚠️ Este tipo de pedido requer aprovação da Comissão de Ética para a Saúde (CES). 
                      O processo será encaminhado automaticamente após aprovação da CFT.
                    </p>
                  </div>
                )}

                {/* Botão de submissão */}
                {tipoPedido && (
                  <div className="flex justify-end pt-4">
                    <Button type="submit" className="gradient-medico hover:opacity-90" size="lg">
                      <Plus className="mr-2 h-5 w-5" />
                      Submeter Pedido
                    </Button>
                  </div>
                )}
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
