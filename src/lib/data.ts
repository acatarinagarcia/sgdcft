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
  | 'agenda-cft' 
  | 'aprovado' 
  | 'rejeitado' 
  | 'pendente-info'
  | 'encaminhado-dc';

export const estados: Record<EstadoPedido, { nome: string; cor: string; descricao: string }> = {
  'submetido': { nome: 'Submetido', cor: 'bg-blue-500', descricao: 'Aguarda triagem farmacêutica' },
  'em-triagem': { nome: 'Em Triagem', cor: 'bg-amber-500', descricao: 'Em análise pela farmácia' },
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
  
  // Dados do doente
  doente: {
    iniciais: string;
    idade: number;
    peso: number;
    ecog: number;
    diagnostico: string;
  };
  
  // Medicamento
  farmacoId: string;
  dosagem: string;
  posologia: string;
  duracaoMeses: number;
  
  // Serviço
  servicoId: string;
  circuito: string;
  medico: string;
  
  // Impacto
  impacto: {
    custoMensal: number;
    custoTotal: number;
    custoAteAno: number;
  };
  
  // Justificação
  justificacao: string;
  
  // Triagem
  reuniaoCFTId?: string;
  parecerFarmacia?: string;
  decisaoCFT?: 'favoravel' | 'desfavoravel' | 'adiado';
  
  // Histórico
  historico: {
    data: Date;
    estado: EstadoPedido;
    observacao?: string;
  }[];
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
    doente: { iniciais: 'JMS', idade: 62, peso: 75, ecog: 1, diagnostico: 'Carcinoma pulmonar de não pequenas células (CPNPC) - Estadio IV' },
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
    doente: { iniciais: 'MFC', idade: 55, peso: 68, ecog: 0, diagnostico: 'Linfoma Não-Hodgkin Folicular - Recidiva' },
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
    doente: { iniciais: 'APS', idade: 48, peso: 82, ecog: 0, diagnostico: 'Cancro da mama HER2+ metastático' },
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
      { data: new Date(2025, 0, 25), estado: 'agenda-cft', observacao: 'Agendado para reunião CFT de 05/02/2025' }
    ]
  },
  {
    id: '4',
    codigo: 'CFT-2025-0004',
    tipo: 'casuistico-on',
    estado: 'aprovado',
    dataSubmissao: new Date(2025, 0, 5),
    dataUltimaAtualizacao: new Date(2025, 0, 20),
    doente: { iniciais: 'RSL', idade: 70, peso: 65, ecog: 1, diagnostico: 'Melanoma maligno metastático - BRAF wild-type' },
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
    doente: { iniciais: 'CMB', idade: 58, peso: 72, ecog: 2, diagnostico: 'Carcinoma colorrectal metastático - RAS wild-type' },
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
