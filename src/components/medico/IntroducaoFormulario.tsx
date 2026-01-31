import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Pill } from 'lucide-react';

export interface IntroducaoFormularioData {
  substanciaAtiva: string;
  marcaComercial: string;
  dosagem: string;
  formaFarmaceutica: string;
  viaAdministracao: string;
  indicacoesTerapeuticas: string;
  indicacoesConstamRCM: string;
  criteriosPrescricao: string;
  posologiaDuracao: string;
  previsaoTratamentosAnuais: string;
  terapeuticaAtual: string;
  justificacaoIntroducao: string;
  aprovadoDiretor: string;
  emailDiretor: string;
}

interface IntroducaoFormularioProps {
  data: IntroducaoFormularioData;
  onChange: (data: IntroducaoFormularioData) => void;
}

export function IntroducaoFormulario({ data, onChange }: IntroducaoFormularioProps) {
  const handleChange = (field: keyof IntroducaoFormularioData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Pill className="h-5 w-5" />
          Introdução de Novo Medicamento no Formulário Hospitalar
        </CardTitle>
        <CardDescription>
          Preencha os dados do medicamento a introduzir
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Identificação do Medicamento */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="substancia">Substância(s) ativa(s) *</Label>
            <Input 
              id="substancia"
              placeholder="Ex: Pembrolizumab"
              value={data.substanciaAtiva}
              onChange={e => handleChange('substanciaAtiva', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="marca">Marca Comercial</Label>
            <Input 
              id="marca"
              placeholder="Ex: Keytruda"
              value={data.marcaComercial}
              onChange={e => handleChange('marcaComercial', e.target.value)}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="dosagem-intro">Dosagem *</Label>
            <Input 
              id="dosagem-intro"
              placeholder="Ex: 100mg/4mL"
              value={data.dosagem}
              onChange={e => handleChange('dosagem', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="forma">Forma farmacêutica *</Label>
            <Input 
              id="forma"
              placeholder="Ex: Concentrado para solução para perfusão"
              value={data.formaFarmaceutica}
              onChange={e => handleChange('formaFarmaceutica', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="via">Via de administração *</Label>
            <Select value={data.viaAdministracao} onValueChange={v => handleChange('viaAdministracao', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="iv">Intravenosa</SelectItem>
                <SelectItem value="sc">Subcutânea</SelectItem>
                <SelectItem value="im">Intramuscular</SelectItem>
                <SelectItem value="oral">Oral</SelectItem>
                <SelectItem value="topica">Tópica</SelectItem>
                <SelectItem value="outra">Outra</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Indicações */}
        <div>
          <Label htmlFor="indicacoes">Indicações terapêuticas propostas *</Label>
          <Textarea 
            id="indicacoes"
            placeholder="Descreva as indicações terapêuticas..."
            value={data.indicacoesTerapeuticas}
            onChange={e => handleChange('indicacoesTerapeuticas', e.target.value)}
            className="min-h-[80px]"
            required
          />
        </div>

        <div className="p-4 rounded-lg bg-muted/50 space-y-3">
          <Label>As indicações constam do Resumo das Características do Medicamento (RCM)? *</Label>
          <RadioGroup 
            value={data.indicacoesConstamRCM} 
            onValueChange={v => handleChange('indicacoesConstamRCM', v)}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim" id="rcm-sim" />
              <Label htmlFor="rcm-sim" className="font-normal">Sim</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id="rcm-nao" />
              <Label htmlFor="rcm-nao" className="font-normal">Não</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Critérios de prescrição */}
        <div>
          <Label>Critérios de prescrição *</Label>
          <RadioGroup 
            value={data.criteriosPrescricao} 
            onValueChange={v => handleChange('criteriosPrescricao', v)}
            className="flex flex-wrap gap-6 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="uso-geral" id="uso-geral" />
              <Label htmlFor="uso-geral" className="font-normal">Uso geral</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="uso-protocolo" id="uso-protocolo" />
              <Label htmlFor="uso-protocolo" className="font-normal">Uso conforme protocolo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="uso-justificacao" id="uso-justificacao" />
              <Label htmlFor="uso-justificacao" className="font-normal">Uso mediante justificação clínica</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Posologia e previsão */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="posologia">Posologia e duração do tratamento</Label>
            <Input 
              id="posologia"
              placeholder="Ex: 200mg q3w durante 24 meses"
              value={data.posologiaDuracao}
              onChange={e => handleChange('posologiaDuracao', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="previsao">Previsão do número de tratamentos anuais *</Label>
            <Input 
              id="previsao"
              type="number"
              placeholder="Ex: 50"
              value={data.previsaoTratamentosAnuais}
              onChange={e => handleChange('previsaoTratamentosAnuais', e.target.value)}
              required
            />
          </div>
        </div>

        {/* Terapêutica atual e justificação */}
        <div>
          <Label htmlFor="terapeutica-atual">Terapêutica atualmente utilizada com a mesma indicação</Label>
          <Textarea 
            id="terapeutica-atual"
            placeholder="Descreva as alternativas terapêuticas atualmente disponíveis..."
            value={data.terapeuticaAtual}
            onChange={e => handleChange('terapeuticaAtual', e.target.value)}
            className="min-h-[60px]"
          />
        </div>

        <div>
          <Label htmlFor="justificacao-intro">Justificação para a sua introdução *</Label>
          <Textarea 
            id="justificacao-intro"
            placeholder="Referir qual a mais valia terapêutica relativamente aos fármacos existentes, nomeadamente em termos de eficácia, segurança, aspetos económicos, etc."
            value={data.justificacaoIntroducao}
            onChange={e => handleChange('justificacaoIntroducao', e.target.value)}
            className="min-h-[100px]"
            required
          />
        </div>

        {/* Aprovação do Diretor */}
        <div className="p-4 rounded-lg bg-muted/50 space-y-3">
          <Label>Esta proposta de introdução de novo medicamento teve aprovação pelo(s) Diretor(es) do(s) Serviço(s)? *</Label>
          <RadioGroup 
            value={data.aprovadoDiretor} 
            onValueChange={v => handleChange('aprovadoDiretor', v)}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim" id="intro-aprovado-sim" />
              <Label htmlFor="intro-aprovado-sim" className="font-normal">Sim</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id="intro-aprovado-nao" />
              <Label htmlFor="intro-aprovado-nao" className="font-normal">Não</Label>
            </div>
          </RadioGroup>
          {data.aprovadoDiretor === 'nao' && (
            <p className="text-sm text-orange-600">
              ⚠️ Por favor obtenha a aprovação necessária antes de submeter o pedido.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
