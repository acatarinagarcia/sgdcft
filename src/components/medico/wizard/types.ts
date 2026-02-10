export type VinculoDoente = 'sim' | 'nao' | '';
export type ObjetivoSubmissao = 'reavaliacao' | 'recurso' | 'nova-terapeutica' | '';
export type ClassificacaoNova = 'casuistico-on' | 'casuistico-off' | 'doente-externo' | '';
export type TipoSemDoente = 'introducao-fh' | 'protocolo-noc' | '';
export type PerfilUtilizador = 'medico' | 'farmacia' | 'secretariado' | 'nutricionista';

export type WizardStep = 1 | 2 | 3;

export type FormDestino =
  | 'on-label'
  | 'off-label'
  | 'reavaliacao'
  | 'recurso'
  | 'introducao-fh'
  | 'protocolo-noc'
  | '';

export interface FarmacoLinha {
  id: string;
  medicamentoId: string;
  medicamentoNome: string;
  modoManual: boolean;
  nomeManual: string;
  formaManual: string;
  dose: string;
  frequencia: string;
  contabilizarCusto: boolean;
}

export interface WizardState {
  // Passo 1
  identificacao: {
    nomeCompleto: string;
    servico: string;
    emailInstitucional: string;
    telemovel: string;
    perfil: PerfilUtilizador;
  };
  vinculoDoente: VinculoDoente;
  doente: {
    ndDoente: string;
    validado: boolean;
    doenteExterno: boolean;
    nomeManual: string;
    snsManual: string;
    dataNascManual: string;
  };

  // Passo 2
  tipoSemDoente: TipoSemDoente;
  objetivoSubmissao: ObjetivoSubmissao;
  classificacaoNova: ClassificacaoNova;
  pedidoAnteriorId: string;

  // Passo 3 On-label / Off-label
  clinico: {
    peso: string;
    altura: string;
    ecog: string;
    indicacaoTerapeutica: string;
    farmacos: FarmacoLinha[];
    linhaTratamento: string;
    historiaTerapeuticaPrevia: string;
    resumoClinico: string;
    aprovadoDiretor: string;
    emailDiretor: string;
    // Off-label extras
    bibliografiaPDF: string;
    justificacaoEvidencia: string;
  };

  // Reavaliação
  reavaliacao: {
    resultadoClinico: string;
    observacoesMedico: string;
    decisaoRenovacao: string;
  };

  // Recurso
  recurso: {
    fundamentacao: string;
  };

  // Introdução FH
  introducaoFH: {
    substanciaAtiva: string;
    marcaComercial: string;
    dosagem: string;
    formaFarmaceutica: string;
    viaAdministracao: string;
    indicacoesTerapeuticas: string;
    indicacoesConstamRCM: string;
    terapeuticaAtual: string;
    criteriosUtilizacao: string;
    protocoloIdentificacao: string;
    posologiaDuracao: string;
    previsaoTratamentosAnuais: string;
    justificacaoIntroducao: string;
    referenciasPDF: string;
    aprovadoDiretor: string;
    emailDiretor: string;
  };

  // Protocolo/NOC
  protocoloNOC: {
    nomeProtocolo: string;
    aprovadoDiretor: string;
    emailDiretor: string;
    ficheiroDraft: string;
  };
}

export const initialWizardState: WizardState = {
  identificacao: {
    nomeCompleto: 'Dr. António Silva',
    servico: 'oncologia',
    emailInstitucional: 'antonio.silva@ulssjoao.min-saude.pt',
    telemovel: '',
    perfil: 'medico',
  },
  vinculoDoente: '',
  doente: {
    ndDoente: '',
    validado: false,
    doenteExterno: false,
    nomeManual: '',
    snsManual: '',
    dataNascManual: '',
  },
  tipoSemDoente: '',
  objetivoSubmissao: '',
  classificacaoNova: '',
  pedidoAnteriorId: '',
  clinico: {
    peso: '',
    altura: '',
    ecog: '',
    indicacaoTerapeutica: '',
    farmacos: [
      {
        id: '1',
        medicamentoId: '',
        medicamentoNome: '',
        modoManual: false,
        nomeManual: '',
        formaManual: '',
        dose: '',
        frequencia: '',
        contabilizarCusto: true,
      },
    ],
    linhaTratamento: '',
    historiaTerapeuticaPrevia: '',
    resumoClinico: '',
    aprovadoDiretor: '',
    emailDiretor: '',
    bibliografiaPDF: '',
    justificacaoEvidencia: '',
  },
  reavaliacao: {
    resultadoClinico: '',
    observacoesMedico: '',
    decisaoRenovacao: '',
  },
  recurso: {
    fundamentacao: '',
  },
  introducaoFH: {
    substanciaAtiva: '',
    marcaComercial: '',
    dosagem: '',
    formaFarmaceutica: '',
    viaAdministracao: '',
    indicacoesTerapeuticas: '',
    indicacoesConstamRCM: '',
    terapeuticaAtual: '',
    criteriosUtilizacao: '',
    protocoloIdentificacao: '',
    posologiaDuracao: '',
    previsaoTratamentosAnuais: '',
    justificacaoIntroducao: '',
    referenciasPDF: '',
    aprovadoDiretor: '',
    emailDiretor: '',
  },
  protocoloNOC: {
    nomeProtocolo: '',
    aprovadoDiretor: '',
    emailDiretor: '',
    ficheiroDraft: '',
  },
};

export function getFormDestino(state: WizardState): FormDestino {
  if (state.vinculoDoente === 'nao') {
    return state.tipoSemDoente === 'introducao-fh'
      ? 'introducao-fh'
      : state.tipoSemDoente === 'protocolo-noc'
      ? 'protocolo-noc'
      : '';
  }
  if (state.vinculoDoente === 'sim') {
    if (state.objetivoSubmissao === 'reavaliacao') return 'reavaliacao';
    if (state.objetivoSubmissao === 'recurso') return 'recurso';
    if (state.objetivoSubmissao === 'nova-terapeutica') {
      if (state.classificacaoNova === 'casuistico-on' || state.classificacaoNova === 'doente-externo')
        return 'on-label';
      if (state.classificacaoNova === 'casuistico-off') return 'off-label';
    }
  }
  return '';
}

export function getStepLabels(destino: FormDestino): string[] {
  const base = ['Identificação', 'Objetivo'];
  switch (destino) {
    case 'on-label':
      return [...base, 'Informação Clínica'];
    case 'off-label':
      return [...base, 'Informação Clínica Off-label'];
    case 'reavaliacao':
      return [...base, 'Reavaliação'];
    case 'recurso':
      return [...base, 'Recurso'];
    case 'introducao-fh':
      return [...base, 'Novo Medicamento'];
    case 'protocolo-noc':
      return [...base, 'Protocolo/NOC'];
    default:
      return [...base, 'Formulário'];
  }
}

const DRAFT_KEY = 'sgt-cft-rascunho';

export function saveDraft(state: WizardState) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
  } catch {}
}

export function loadDraft(): WizardState | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}
