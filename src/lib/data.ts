// Catálogo de Fármacos
export const farmacos = [
  { id: 'pembrolizumab', nome: 'Pembrolizumab', dci: 'Pembrolizumab', apresentacao: '100mg/4mL', precoUnidade: 4250, escalao: 'A', fabricante: 'MSD' },
  { id: 'nivolumab', nome: 'Nivolumab', dci: 'Nivolumab', apresentacao: '100mg/10mL', precoUnidade: 2180, escalao: 'A', fabricante: 'BMS' },
  { id: 'trastuzumab', nome: 'Trastuzumab', dci: 'Trastuzumab', apresentacao: '440mg', precoUnidade: 1890, escalao: 'B', fabricante: 'Roche' },
  { id: 'rituximab', nome: 'Rituximab', dci: 'Rituximab', apresentacao: '500mg/50mL', precoUnidade: 1250, escalao: 'B', fabricante: 'Roche' },
  { id: 'bevacizumab', nome: 'Bevacizumab', dci: 'Bevacizumab', apresentacao: '400mg/16mL', precoUnidade: 1120, escalao: 'B', fabricante: 'Roche' },
  { id: 'cetuximab', nome: 'Cetuximab', dci: 'Cetuximab', apresentacao: '100mg/20mL', precoUnidade: 285, escalao: 'C', fabricante: 'Merck' },
  { id: 'ipilimumab', nome: 'Ipilimumab', dci: 'Ipilimumab', apresentacao: '50mg/10mL', precoUnidade: 5200, escalao: 'A', fabricante: 'BMS' },
];

// Serviços Hospitalares
export const servicos = [
  { id: 'oncologia', nome: 'Oncologia', codigo: 'ONC' },
  { id: 'hematologia', nome: 'Hematologia', codigo: 'HEM' },
  { id: 'pneumologia', nome: 'Pneumologia', codigo: 'PNE' },
  { id: 'gastroenterologia', nome: 'Gastroenterologia', codigo: 'GAS' },
  { id: 'neurologia', nome: 'Neurologia', codigo: 'NEU' },
  { id: 'dermatologia', nome: 'Dermatologia', codigo: 'DER' },
  { id: 'urologia', nome: 'Urologia', codigo: 'URO' },
  { id: 'ginecologia', nome: 'Ginecologia', codigo: 'GIN' },
  { id: 'medicina-interna', nome: 'Medicina Interna', codigo: 'MIN' },
  { id: 'reumatologia', nome: 'Reumatologia', codigo: 'REU' },
  { id: 'nefrologia', nome: 'Nefrologia', codigo: 'NEF' },
  { id: 'cardiologia', nome: 'Cardiologia', codigo: 'CAR' },
];

// Tipos de Pedido
export const tiposPedido = [
  { id: 'casuistico-on', nome: 'Casuístico On-label', descricao: 'Uso aprovado do medicamento', requerCES: false },
  { id: 'casuistico-off', nome: 'Casuístico Off-label', descricao: 'Uso fora das indicações aprovadas', requerCES: true },
  { id: 'formulario', nome: 'Introdução no Formulário', descricao: 'Novo medicamento no formulário hospitalar', requerCES: false },
  { id: 'protocolo', nome: 'Protocolo/NOC', descricao: 'Protocolo clínico ou norma de orientação', requerCES: false },
];

// Circuitos de Dispensa
export const circuitos = [
  { id: 'hdia', nome: 'Hospital de Dia' },
  { id: 'internamento', nome: 'Internamento' },
  { id: 'ambulatorio', nome: 'Ambulatório' },
];

// Estados do Workflow
export type EstadoPedido = 
  | 'submetido' 
  | 'em-triagem' 
  | 'parecer-farmacia'
  | 'agenda-cft' 
  | 'aprovado' 
  | 'rejeitado' 
  | 'pendente-info'
  | 'encaminhado-dc';

export const estados: Record<EstadoPedido, { nome: string; cor: string; descricao: string }> = {
  'submetido': { nome: 'Submetido', cor: 'bg-blue-500', descricao: 'Aguarda triagem farmacêutica' },
  'em-triagem': { nome: 'Em Triagem', cor: 'bg-amber-500', descricao: 'Em análise pela farmácia' },
  'parecer-farmacia': { nome: 'Parecer Farmácia', cor: 'bg-cyan-500', descricao: 'Parecer técnico da farmácia emitido' },
  'agenda-cft': { nome: 'Agenda CFT', cor: 'bg-purple-500', descricao: 'Agendado para reunião CFT' },
  'aprovado': { nome: 'Aprovado', cor: 'bg-green-500', descricao: 'Pedido aprovado pelo CA' },
  'rejeitado': { nome: 'Rejeitado', cor: 'bg-red-500', descricao: 'Pedido não aprovado' },
  'pendente-info': { nome: 'Pendente Info', cor: 'bg-orange-500', descricao: 'Aguarda informação adicional' },
  'encaminhado-dc': { nome: 'Direção Clínica', cor: 'bg-indigo-500', descricao: 'Encaminhado para direção clínica' },
};

// Reuniões CFT
export interface ReuniaoCFT {
  id: string;
  data: Date;
  hora: string;
  numeroAta?: string;
  estado: 'agendada' | 'realizada' | 'cancelada';
}

export const reunioesCFT: ReuniaoCFT[] = [
  { id: 'cft-1', data: new Date(2026, 1, 3), hora: '14:00', estado: 'agendada' },
  { id: 'cft-2', data: new Date(2026, 1, 17), hora: '14:00', estado: 'agendada' },
  { id: 'cft-3', data: new Date(2026, 2, 3), hora: '14:00', estado: 'agendada' },
  { id: 'cft-4', data: new Date(2026, 2, 17), hora: '14:00', estado: 'agendada' },
];

// Interface do Pedido
export interface Pedido {
  id: string;
  codigo: string;
  tipo: string;
  estado: EstadoPedido;
  dataSubmissao: Date;
  dataUltimaAtualizacao: Date;
  
  // Identificação do Médico (preenchido pelo médico)
  medicoNomeCompleto: string;
  medicoTelemovel: string;
  emailDiretor: string;
  
  // Dados do doente (preenchido pelo médico)
  doente: {
    ndDoente?: string;
    iniciais?: string;
    idade?: number;
    peso: number;
    altura?: number;
    ecog: number | string;
    diagnostico?: string;
    indicacaoTerapeutica?: string;
  };
  
  // Dados clínicos (preenchido pelo médico)
  terapeuticaProposta: string;
  linhaTratamento?: string;
  historiaTerapeuticaPrevia?: string;
  resumoClinico?: string;
  aprovadoDiretor: string;
  
  // Serviço
  servicoId: string;
  medico?: string; // deprecated, usar medicoNomeCompleto
  
  // Dados técnicos (preenchidos pela Farmácia/Secretariado CFT)
  farmacoId?: string;
  dosagem?: string;
  posologia?: string;
  duracaoMeses?: number;
  circuito?: string;
  
  // Impacto financeiro (calculado pela Farmácia/Secretariado CFT)
  impacto?: {
    custoMensal: number;
    custoTotal: number;
    custoAteAno: number;
  };
  
  // Justificação (usado pelo médico no formulário antigo, agora é resumoClinico)
  justificacao?: string;
  
  // Triagem e Deliberação
  reuniaoCFTId?: string;
  parecerFarmacia?: string;
  decisaoCFT?: 'favoravel' | 'desfavoravel' | 'adiado';
  fundamentacaoCFT?: string;
  
  // Histórico
  historico: {
    data: Date;
    estado: EstadoPedido;
    observacao?: string;
  }[];
  
  // Dados específicos para Introdução no Formulário
  introducaoFormulario?: {
    substanciaAtiva: string;
    marcaComercial?: string;
    dosagem: string;
    formaFarmaceutica: string;
    viaAdministracao: string;
    indicacoesTerapeuticas: string;
    indicacoesConstamRCM: string;
    criteriosPrescricao: string;
    posologiaDuracao?: string;
    previsaoTratamentosAnuais: string;
    terapeuticaAtual?: string;
    justificacaoIntroducao: string;
  };
  
  // Dados específicos para Protocolo/NOC
  protocoloNOC?: {
    nomeProtocolo: string;
  };
}

// Dados iniciais de demonstração
export const pedidosIniciais: Pedido[] = [
  {
    id: '1',
    codigo: 'CFT-2025-0001',
    tipo: 'casuistico-on',
    estado: 'submetido',
    dataSubmissao: new Date(2025, 0, 20),
    dataUltimaAtualizacao: new Date(2025, 0, 20),
    medicoNomeCompleto: 'Dr. António Silva',
    medicoTelemovel: '912345678',
    emailDiretor: 'diretor.oncologia@ulssjoao.min-saude.pt',
    doente: { 
      ndDoente: '123456',
      iniciais: 'JMS', 
      peso: 75, 
      altura: 175,
      ecog: 1, 
      indicacaoTerapeutica: 'Carcinoma pulmonar de não pequenas células (CPNPC) - Estadio IV',
      diagnostico: 'Carcinoma pulmonar de não pequenas células (CPNPC) - Estadio IV'
    },
    terapeuticaProposta: 'Pembrolizumab',
    linhaTratamento: '1',
    historiaTerapeuticaPrevia: 'Sem tratamento prévio para doença metastática',
    resumoClinico: 'Doente com CPNPC estadio IV, PD-L1 ≥50%, sem mutações EGFR/ALK. Indicação aprovada em 1ª linha. Performance status adequado (ECOG 1).',
    aprovadoDiretor: 'sim',
    farmacoId: 'pembrolizumab',
    dosagem: '200mg',
    posologia: 'q3w',
    duracaoMeses: 12,
    servicoId: 'oncologia',
    circuito: 'hdia',
    medico: 'Dr. António Silva',
    impacto: { custoMensal: 5667, custoTotal: 68004, custoAteAno: 62337 },
    justificacao: 'Doente com CPNPC estadio IV, PD-L1 ≥50%, sem mutações EGFR/ALK. Indicação aprovada em 1ª linha. Performance status adequado (ECOG 1).',
    historico: [{ data: new Date(2025, 0, 20), estado: 'submetido', observacao: 'Pedido submetido pelo serviço de Oncologia' }]
  },
  {
    id: '2',
    codigo: 'CFT-2025-0002',
    tipo: 'casuistico-off',
    estado: 'em-triagem',
    dataSubmissao: new Date(2025, 0, 18),
    dataUltimaAtualizacao: new Date(2025, 0, 22),
    medicoNomeCompleto: 'Dra. Maria Costa',
    medicoTelemovel: '913456789',
    emailDiretor: 'diretor.hematologia@ulssjoao.min-saude.pt',
    doente: { 
      ndDoente: '234567',
      iniciais: 'MFC', 
      peso: 68, 
      altura: 165,
      ecog: 0, 
      indicacaoTerapeutica: 'Linfoma Não-Hodgkin Folicular - Recidiva - Manutenção',
      diagnostico: 'Linfoma Não-Hodgkin Folicular - Recidiva'
    },
    terapeuticaProposta: 'Rituximab (manutenção)',
    linhaTratamento: '2',
    historiaTerapeuticaPrevia: 'R-CHOP x6 ciclos com remissão completa. Recidiva após 18 meses.',
    resumoClinico: 'Recidiva após 18 meses de remissão completa. Manutenção com Rituximab demonstrou benefício em estudos fase III.',
    aprovadoDiretor: 'sim',
    farmacoId: 'rituximab',
    dosagem: '375mg/m²',
    posologia: 'q4w x 8',
    duracaoMeses: 8,
    servicoId: 'hematologia',
    circuito: 'hdia',
    medico: 'Dra. Maria Costa',
    impacto: { custoMensal: 1875, custoTotal: 15000, custoAteAno: 13750 },
    justificacao: 'Recidiva após 18 meses de remissão completa. Manutenção com Rituximab demonstrou benefício em estudos fase III.',
    historico: [
      { data: new Date(2025, 0, 18), estado: 'submetido', observacao: 'Pedido submetido' },
      { data: new Date(2025, 0, 22), estado: 'em-triagem', observacao: 'Triagem iniciada pela farmácia' }
    ]
  },
  {
    id: '3',
    codigo: 'CFT-2025-0003',
    tipo: 'protocolo',
    estado: 'agenda-cft',
    dataSubmissao: new Date(2025, 0, 15),
    dataUltimaAtualizacao: new Date(2025, 0, 25),
    medicoNomeCompleto: 'Dr. Pedro Santos',
    medicoTelemovel: '914567890',
    emailDiretor: 'diretor.oncologia@ulssjoao.min-saude.pt',
    doente: { 
      ndDoente: '345678',
      iniciais: 'APS', 
      peso: 82, 
      altura: 168,
      ecog: 0, 
      indicacaoTerapeutica: 'Cancro da mama HER2+ metastático - 1ª linha',
      diagnostico: 'Cancro da mama HER2+ metastático'
    },
    terapeuticaProposta: 'Protocolo CLEOPATRA (Trastuzumab + Pertuzumab + Docetaxel)',
    linhaTratamento: '1',
    historiaTerapeuticaPrevia: 'Sem tratamento prévio para doença metastática',
    resumoClinico: 'Protocolo CLEOPATRA. Doente HER2+ metastático, 1ª linha. Combinação com Pertuzumab e Docetaxel.',
    aprovadoDiretor: 'sim',
    protocoloNOC: {
      nomeProtocolo: 'Protocolo CLEOPATRA - Cancro da mama HER2+ metastático'
    },
    farmacoId: 'trastuzumab',
    dosagem: '6mg/kg',
    posologia: 'q3w',
    duracaoMeses: 18,
    servicoId: 'oncologia',
    circuito: 'hdia',
    medico: 'Dr. Pedro Santos',
    impacto: { custoMensal: 2520, custoTotal: 45360, custoAteAno: 27720 },
    justificacao: 'Protocolo CLEOPATRA. Doente HER2+ metastático, 1ª linha. Combinação com Pertuzumab e Docetaxel.',
    reuniaoCFTId: 'cft-1',
    historico: [
      { data: new Date(2025, 0, 15), estado: 'submetido', observacao: 'Pedido submetido' },
      { data: new Date(2025, 0, 17), estado: 'em-triagem', observacao: 'Triagem iniciada' },
      { data: new Date(2025, 0, 25), estado: 'agenda-cft', observacao: 'Agendado para reunião CFT de 03/02/2026' }
    ]
  },
  {
    id: '4',
    codigo: 'CFT-2025-0004',
    tipo: 'casuistico-on',
    estado: 'aprovado',
    dataSubmissao: new Date(2025, 0, 5),
    dataUltimaAtualizacao: new Date(2025, 0, 20),
    medicoNomeCompleto: 'Dra. Ana Ferreira',
    medicoTelemovel: '915678901',
    emailDiretor: 'diretor.dermatologia@ulssjoao.min-saude.pt',
    doente: { 
      ndDoente: '456789',
      iniciais: 'RSL', 
      peso: 65, 
      altura: 170,
      ecog: 1, 
      indicacaoTerapeutica: 'Melanoma maligno metastático - BRAF wild-type - 1ª linha',
      diagnostico: 'Melanoma maligno metastático - BRAF wild-type'
    },
    terapeuticaProposta: 'Nivolumab',
    linhaTratamento: '1',
    historiaTerapeuticaPrevia: 'Sem tratamento prévio para doença metastática',
    resumoClinico: 'Melanoma metastático irressecável, 1ª linha. Sem mutação BRAF. Indicação aprovada.',
    aprovadoDiretor: 'sim',
    farmacoId: 'nivolumab',
    dosagem: '240mg',
    posologia: 'q2w',
    duracaoMeses: 24,
    servicoId: 'dermatologia',
    circuito: 'hdia',
    medico: 'Dra. Ana Ferreira',
    impacto: { custoMensal: 4360, custoTotal: 104640, custoAteAno: 50680 },
    justificacao: 'Melanoma metastático irressecável, 1ª linha. Sem mutação BRAF. Indicação aprovada.',
    decisaoCFT: 'favoravel',
    fundamentacaoCFT: 'Pedido em conformidade com as indicações aprovadas. Parecer favorável unânime.',
    historico: [
      { data: new Date(2025, 0, 5), estado: 'submetido', observacao: 'Pedido submetido' },
      { data: new Date(2025, 0, 8), estado: 'em-triagem', observacao: 'Triagem iniciada' },
      { data: new Date(2025, 0, 10), estado: 'agenda-cft', observacao: 'Agendado para CFT' },
      { data: new Date(2025, 0, 20), estado: 'aprovado', observacao: 'Parecer favorável da CFT. Aprovado pelo CA.' }
    ]
  },
  {
    id: '5',
    codigo: 'CFT-2025-0005',
    tipo: 'casuistico-on',
    estado: 'pendente-info',
    dataSubmissao: new Date(2025, 0, 22),
    dataUltimaAtualizacao: new Date(2025, 0, 26),
    medicoNomeCompleto: 'Dr. Carlos Mendes',
    medicoTelemovel: '916789012',
    emailDiretor: 'diretor.gastroenterologia@ulssjoao.min-saude.pt',
    doente: { 
      ndDoente: '567890',
      iniciais: 'CMB', 
      peso: 72, 
      altura: 178,
      ecog: 2, 
      indicacaoTerapeutica: 'Carcinoma colorrectal metastático - RAS wild-type - 2ª linha',
      diagnostico: 'Carcinoma colorrectal metastático - RAS wild-type'
    },
    terapeuticaProposta: 'Cetuximab',
    linhaTratamento: '2',
    historiaTerapeuticaPrevia: 'FOLFOX x8 ciclos com progressão',
    resumoClinico: 'CCR metastático RAS wt, 2ª linha após progressão com FOLFOX.',
    aprovadoDiretor: 'sim',
    farmacoId: 'cetuximab',
    dosagem: '500mg/m²',
    posologia: 'q2w',
    duracaoMeses: 6,
    servicoId: 'gastroenterologia',
    circuito: 'hdia',
    medico: 'Dr. Carlos Mendes',
    impacto: { custoMensal: 1140, custoTotal: 6840, custoAteAno: 6840 },
    justificacao: 'CCR metastático RAS wt, 2ª linha após progressão com FOLFOX.',
    historico: [
      { data: new Date(2025, 0, 22), estado: 'submetido', observacao: 'Pedido submetido' },
      { data: new Date(2025, 0, 24), estado: 'em-triagem', observacao: 'Triagem iniciada' },
      { data: new Date(2025, 0, 26), estado: 'pendente-info', observacao: 'Solicitada confirmação do status RAS por laboratório externo' }
    ]
  },
];
