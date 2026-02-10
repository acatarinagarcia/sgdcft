import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, RefreshCw, Gavel, PlusCircle, Pill, BookOpen } from 'lucide-react';
import { WizardState, ObjetivoSubmissao, TipoSemDoente, ClassificacaoNova } from './types';

interface Passo2Props {
  data: WizardState;
  onChange: (data: WizardState) => void;
}

export function Passo2Natureza({ data, onChange }: Passo2Props) {
  const semDoente = data.vinculoDoente === 'nao';
  const comDoente = data.vinculoDoente === 'sim';

  // Mock: pedidos ativos e recusados para reavaliação/recurso
  const pedidosAtivos = [
    { id: 'mock-1', label: 'CFT-2025-0004 — Nivolumab (Melanoma) — Em Tratamento' },
  ];
  const pedidosRecusados = [
    { id: 'mock-r1', label: 'CFT-2025-0010 — Ipilimumab (Melanoma) — Recusado' },
  ];

  if (semDoente) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Tipo de Pedido Documental
          </CardTitle>
          <CardDescription>Selecione o tipo de processo documental a submeter</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={data.tipoSemDoente}
            onValueChange={v => onChange({ ...data, tipoSemDoente: v as TipoSemDoente })}
            className="space-y-3"
          >
            <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${data.tipoSemDoente === 'introducao-fh' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="introducao-fh" id="tipo-intro-fh" />
                <div className="flex-1">
                  <Label htmlFor="tipo-intro-fh" className="font-medium cursor-pointer flex items-center gap-2">
                    <Pill className="h-4 w-4" />
                    Introdução de Novo Fármaco no FH
                  </Label>
                  <p className="text-sm text-muted-foreground">Proposta de introdução de novo medicamento no formulário hospitalar</p>
                </div>
              </div>
            </div>
            <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${data.tipoSemDoente === 'protocolo-noc' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="protocolo-noc" id="tipo-protocolo" />
                <div className="flex-1">
                  <Label htmlFor="tipo-protocolo" className="font-medium cursor-pointer flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Protocolo / Norma de Orientação Clínica
                  </Label>
                  <p className="text-sm text-muted-foreground">Submissão de protocolo clínico ou norma para aprovação</p>
                </div>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    );
  }

  if (comDoente) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Objetivo da Submissão
            </CardTitle>
            <CardDescription>
              Doente ND: <strong>{data.doente.doenteExterno ? data.doente.nomeManual : data.doente.ndDoente}</strong>
              {data.doente.doenteExterno && <Badge variant="outline" className="ml-2 text-xs">Externo</Badge>}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={data.objetivoSubmissao}
              onValueChange={v =>
                onChange({
                  ...data,
                  objetivoSubmissao: v as ObjetivoSubmissao,
                  classificacaoNova: v === 'nova-terapeutica' && data.doente.doenteExterno ? 'doente-externo' : '',
                  pedidoAnteriorId: '',
                })
              }
              className="space-y-3"
            >
              <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${data.objetivoSubmissao === 'reavaliacao' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="reavaliacao" id="obj-reav" />
                  <div className="flex-1">
                    <Label htmlFor="obj-reav" className="font-medium cursor-pointer flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" /> Continuação / Reavaliação
                    </Label>
                    <p className="text-sm text-muted-foreground">Reavaliação de tratamento ativo existente</p>
                  </div>
                </div>
              </div>
              <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${data.objetivoSubmissao === 'recurso' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="recurso" id="obj-recurso" />
                  <div className="flex-1">
                    <Label htmlFor="obj-recurso" className="font-medium cursor-pointer flex items-center gap-2">
                      <Gavel className="h-4 w-4" /> Recurso (Appeal)
                    </Label>
                    <p className="text-sm text-muted-foreground">Contestar decisão de recusa anterior</p>
                  </div>
                </div>
              </div>
              <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${data.objetivoSubmissao === 'nova-terapeutica' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="nova-terapeutica" id="obj-nova" />
                  <div className="flex-1">
                    <Label htmlFor="obj-nova" className="font-medium cursor-pointer flex items-center gap-2">
                      <PlusCircle className="h-4 w-4" /> Iniciar Nova Terapêutica
                    </Label>
                    <p className="text-sm text-muted-foreground">Novo processo terapêutico para este doente</p>
                  </div>
                </div>
              </div>
            </RadioGroup>

            {/* Sub-options */}
            {data.objetivoSubmissao === 'reavaliacao' && (
              <div className="pt-2">
                <Label>Selecionar tratamento ativo para reavaliação *</Label>
                <Select value={data.pedidoAnteriorId} onValueChange={v => onChange({ ...data, pedidoAnteriorId: v })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione um pedido ativo" />
                  </SelectTrigger>
                  <SelectContent>
                    {pedidosAtivos.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">Dados anteriores serão herdados (texto mantido, biometria limpa).</p>
              </div>
            )}

            {data.objetivoSubmissao === 'recurso' && (
              <div className="pt-2">
                <Label>Selecionar pedido recusado *</Label>
                <Select value={data.pedidoAnteriorId} onValueChange={v => onChange({ ...data, pedidoAnteriorId: v })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione um pedido recusado" />
                  </SelectTrigger>
                  <SelectContent>
                    {pedidosRecusados.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {data.objetivoSubmissao === 'nova-terapeutica' && (
              <div className="pt-2">
                <Label>Classificação *</Label>
                <Select
                  value={data.classificacaoNova}
                  onValueChange={v => onChange({ ...data, classificacaoNova: v as ClassificacaoNova })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione a classificação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casuistico-on">Casuístico On-label</SelectItem>
                    <SelectItem value="casuistico-off">Casuístico Off-label</SelectItem>
                    {data.doente.doenteExterno && (
                      <SelectItem value="doente-externo">Doente Externo</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
