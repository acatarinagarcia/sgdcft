import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BookOpen } from 'lucide-react';
import { WizardState } from './types';

interface Passo6Props {
  data: WizardState;
  onChange: (data: WizardState) => void;
}

export function Passo6ProtocoloNOC({ data, onChange }: Passo6Props) {
  const p = data.protocoloNOC;

  const update = (field: string, value: string) => {
    onChange({ ...data, protocoloNOC: { ...p, [field]: value } });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Protocolo / Norma de Orientação Clínica
        </CardTitle>
        <CardDescription>Submissão de protocolo clínico para aprovação da CFT</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <Label>Identificação do Protocolo/Norma *</Label>
          <Input
            placeholder="Título oficial do documento"
            value={p.nomeProtocolo}
            onChange={e => update('nomeProtocolo', e.target.value)}
          />
        </div>

        {/* Aprovação Diretor */}
        <div className="p-4 rounded-lg bg-muted/50 space-y-3">
          <Label>O Protocolo teve aprovação do(s) Diretor(es) de Serviço? *</Label>
          <RadioGroup value={p.aprovadoDiretor} onValueChange={v => update('aprovadoDiretor', v)} className="flex gap-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim" id="prot-ap-s" /><Label htmlFor="prot-ap-s" className="font-normal">Sim</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id="prot-ap-n" /><Label htmlFor="prot-ap-n" className="font-normal">Não</Label>
            </div>
          </RadioGroup>
          {p.aprovadoDiretor === 'nao' && (
            <div className="space-y-2">
              <p className="text-sm text-orange-600">⚠️ Será enviado pedido de validação ao Diretor.</p>
              <div>
                <Label>Email institucional do Diretor de Serviço *</Label>
                <Input type="email" placeholder="diretor@ulssjoao.min-saude.pt" value={p.emailDiretor} onChange={e => update('emailDiretor', e.target.value)} />
              </div>
            </div>
          )}
        </div>

        {/* Upload do draft */}
        <div>
          <Label>Carregamento do primeiro draft do Protocolo * (PDF ou Word)</Label>
          <Input
            type="file"
            accept=".pdf,.docx,.doc"
            onChange={e => update('ficheiroDraft', e.target.files?.[0]?.name || '')}
            className="mt-1"
          />
          {p.ficheiroDraft && <p className="text-xs text-muted-foreground mt-1">📎 {p.ficheiroDraft}</p>}
          {!p.ficheiroDraft && <p className="text-xs text-destructive mt-1">⚠️ O sistema aceita formatos PDF e Word (.docx) para revisão.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
