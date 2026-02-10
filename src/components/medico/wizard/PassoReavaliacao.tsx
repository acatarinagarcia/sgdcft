import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw } from 'lucide-react';
import { WizardState } from './types';

interface PassoReavaliacaoProps {
  data: WizardState;
  onChange: (data: WizardState) => void;
}

export function PassoReavaliacao({ data, onChange }: PassoReavaliacaoProps) {
  const r = data.reavaliacao;

  const update = (field: string, value: string) => {
    onChange({ ...data, reavaliacao: { ...r, [field]: value } });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Reavaliação Terapêutica
        </CardTitle>
        <CardDescription>
          Registe a evolução clínica e a proposta de continuidade
          <Badge variant="outline" className="ml-2 text-xs">Herança Inteligente</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Info herdada (mock) */}
        <div className="p-4 rounded-lg bg-muted/50 space-y-2">
          <p className="text-sm font-medium">Dados herdados do pedido anterior:</p>
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <span>Fármaco: <strong>Nivolumab 240mg Q2W</strong></span>
            <span>Indicação: <strong>Melanoma maligno metastático</strong></span>
          </div>
          <p className="text-xs text-muted-foreground italic">
            ℹ️ Dados biométricos (Peso, Altura, ECOG PS) foram limpos para reavaliação.
          </p>
        </div>

        {/* Resultado Clínico */}
        <div>
          <Label>Resultado Clínico Atual *</Label>
          <Select value={r.resultadoClinico} onValueChange={v => update('resultadoClinico', v)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecione o resultado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MELHORIA">Melhoria</SelectItem>
              <SelectItem value="ESTABILIZACAO">Estabilização</SelectItem>
              <SelectItem value="PROGRESSAO">Progressão</SelectItem>
              <SelectItem value="TOXICIDADE">Toxicidade</SelectItem>
              <SelectItem value="RESPOSTA_COMPLETA">Resposta Completa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Observações */}
        <div>
          <Label>Comentários / Avaliação *</Label>
          <Textarea
            placeholder="Justificação narrativa da evolução clínica..."
            value={r.observacoesMedico}
            onChange={e => update('observacoesMedico', e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        {/* Proposta de Decisão */}
        <div>
          <Label>Proposta de Decisão *</Label>
          <Select value={r.decisaoRenovacao} onValueChange={v => update('decisaoRenovacao', v)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecione a proposta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CONTINUAR">Continuar tratamento</SelectItem>
              <SelectItem value="SUSPENDER">Suspender tratamento</SelectItem>
              <SelectItem value="ALTERAR_DOSE">Alterar dose</SelectItem>
              <SelectItem value="DESCONTINUAR">Descontinuar</SelectItem>
            </SelectContent>
          </Select>
          {r.decisaoRenovacao === 'DESCONTINUAR' && (
            <p className="text-xs text-muted-foreground mt-1">
              ℹ️ A data de suspensão será registada automaticamente pelo sistema.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
