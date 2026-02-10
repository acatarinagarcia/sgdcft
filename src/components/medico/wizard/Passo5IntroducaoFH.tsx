import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Pill } from 'lucide-react';
import { WizardState } from './types';

interface Passo5Props {
  data: WizardState;
  onChange: (data: WizardState) => void;
}

export function Passo5IntroducaoFH({ data, onChange }: Passo5Props) {
  const f = data.introducaoFH;

  const update = (field: string, value: string) => {
    onChange({ ...data, introducaoFH: { ...f, [field]: value } });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Pill className="h-5 w-5" />
          Introdução de Novo Medicamento no FH
        </CardTitle>
        <CardDescription>Proposta de introdução de novo fármaco no formulário hospitalar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* 1. Identificação do Medicamento */}
        <div className="space-y-3">
          <p className="text-sm font-semibold">1. Identificação do Medicamento</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Substância(s) ativa(s) *</Label>
              <Input placeholder="Ex: Pembrolizumab" value={f.substanciaAtiva} onChange={e => update('substanciaAtiva', e.target.value)} />
            </div>
            <div>
              <Label>Marca Comercial</Label>
              <Input placeholder="Ex: Keytruda" value={f.marcaComercial} onChange={e => update('marcaComercial', e.target.value)} />
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label>Dosagem *</Label>
              <Input placeholder="100mg/4mL" value={f.dosagem} onChange={e => update('dosagem', e.target.value)} />
            </div>
            <div>
              <Label>Forma farmacêutica *</Label>
              <Input placeholder="Concentrado para perfusão" value={f.formaFarmaceutica} onChange={e => update('formaFarmaceutica', e.target.value)} />
            </div>
            <div>
              <Label>Via de administração *</Label>
              <Select value={f.viaAdministracao} onValueChange={v => update('viaAdministracao', v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
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
        </div>

        {/* 2. Enquadramento Terapêutico */}
        <div className="space-y-3">
          <p className="text-sm font-semibold">2. Enquadramento Terapêutico</p>
          <div>
            <Label>Indicações terapêuticas propostas *</Label>
            <Textarea placeholder="Descreva as indicações..." value={f.indicacoesTerapeuticas} onChange={e => update('indicacoesTerapeuticas', e.target.value)} className="min-h-[60px]" />
          </div>
          <div className="p-3 rounded-lg bg-muted/50 space-y-2">
            <Label>As indicações constam do RCM? *</Label>
            <RadioGroup value={f.indicacoesConstamRCM} onValueChange={v => update('indicacoesConstamRCM', v)} className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="rcm-s" /><Label htmlFor="rcm-s" className="font-normal">Sim (On-label)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao" id="rcm-n" /><Label htmlFor="rcm-n" className="font-normal">Não (Off-label)</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label>Terapêutica atualmente utilizada com a mesma indicação</Label>
            <Textarea placeholder="Alternativas terapêuticas atualmente disponíveis..." value={f.terapeuticaAtual} onChange={e => update('terapeuticaAtual', e.target.value)} className="min-h-[60px]" />
          </div>
        </div>

        {/* 3. Critérios de Utilização */}
        <div className="space-y-3">
          <p className="text-sm font-semibold">3. Critérios de Utilização</p>
          <RadioGroup value={f.criteriosUtilizacao} onValueChange={v => update('criteriosUtilizacao', v)} className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="uso-geral" id="cu1" /><Label htmlFor="cu1" className="font-normal">Uso geral</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="uso-protocolo" id="cu2" /><Label htmlFor="cu2" className="font-normal">Uso conforme protocolo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="uso-justificacao" id="cu3" /><Label htmlFor="cu3" className="font-normal">Uso mediante justificação clínica</Label>
            </div>
          </RadioGroup>
          {f.criteriosUtilizacao === 'uso-protocolo' && (
            <div>
              <Label>Identificação do Protocolo/NOC *</Label>
              <Input placeholder="Nome do protocolo" value={f.protocoloIdentificacao} onChange={e => update('protocoloIdentificacao', e.target.value)} />
            </div>
          )}
        </div>

        {/* 4. Estimativa de Consumo */}
        <div className="space-y-3">
          <p className="text-sm font-semibold">4. Estimativa de Consumo</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Posologia e duração do tratamento</Label>
              <Input placeholder="200mg q3w, 24 meses" value={f.posologiaDuracao} onChange={e => update('posologiaDuracao', e.target.value)} />
            </div>
            <div>
              <Label>Previsão nº tratamentos anuais * (inteiro)</Label>
              <Input type="number" placeholder="50" value={f.previsaoTratamentosAnuais} onChange={e => update('previsaoTratamentosAnuais', e.target.value.replace(/\D/g, ''))} />
            </div>
          </div>
        </div>

        {/* 5. Justificação e Evidência */}
        <div className="space-y-3">
          <p className="text-sm font-semibold">5. Justificação e Evidência</p>
          <div>
            <Label>Justificação para a introdução *</Label>
            <Textarea placeholder="Eficácia, segurança, aspetos económicos..." value={f.justificacaoIntroducao} onChange={e => update('justificacaoIntroducao', e.target.value)} className="min-h-[80px]" />
          </div>
          <div>
            <Label>Referências bibliográficas (PDF) *</Label>
            <Input type="file" accept=".pdf" onChange={e => update('referenciasPDF', e.target.files?.[0]?.name || '')} className="mt-1" />
            {f.referenciasPDF && <p className="text-xs text-muted-foreground mt-1">📎 {f.referenciasPDF}</p>}
            {!f.referenciasPDF && <p className="text-xs text-destructive mt-1">⚠️ Anexo obrigatório para submissão</p>}
          </div>
        </div>

        {/* 6. Validação Hierárquica */}
        <div className="p-4 rounded-lg bg-muted/50 space-y-3">
          <Label>Esta proposta teve aprovação pelo(s) Diretor(es)? *</Label>
          <RadioGroup value={f.aprovadoDiretor} onValueChange={v => update('aprovadoDiretor', v)} className="flex gap-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim" id="fh-ap-s" /><Label htmlFor="fh-ap-s" className="font-normal">Sim</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id="fh-ap-n" /><Label htmlFor="fh-ap-n" className="font-normal">Não</Label>
            </div>
          </RadioGroup>
          {f.aprovadoDiretor === 'nao' && (
            <div className="space-y-2">
              <p className="text-sm text-orange-600">⚠️ Será enviado pedido de validação ao Diretor.</p>
              <div>
                <Label>Email institucional do(s) Diretor(es) *</Label>
                <Input type="email" placeholder="diretor@ulssjoao.min-saude.pt" value={f.emailDiretor} onChange={e => update('emailDiretor', e.target.value)} />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
