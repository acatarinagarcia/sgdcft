import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ClipboardList, Plus, Trash2, Search } from 'lucide-react';
import { WizardState, FarmacoLinha } from './types';
import { farmacos } from '@/lib/data';

interface Passo3Props {
  data: WizardState;
  onChange: (data: WizardState) => void;
  isOffLabel?: boolean;
  isRecurso?: boolean;
}

export function Passo3OnLabel({ data, onChange, isOffLabel = false, isRecurso = false }: Passo3Props) {
  const c = data.clinico;

  const updateClin = (field: string, value: string) => {
    onChange({ ...data, clinico: { ...c, [field]: value } });
  };

  const updateFarmaco = (id: string, field: keyof FarmacoLinha, value: string | boolean) => {
    const updated = c.farmacos.map(f => (f.id === id ? { ...f, [field]: value } : f));
    onChange({ ...data, clinico: { ...c, farmacos: updated } });
  };

  const addFarmaco = () => {
    const novo: FarmacoLinha = {
      id: Date.now().toString(),
      medicamentoId: '',
      medicamentoNome: '',
      modoManual: false,
      nomeManual: '',
      formaManual: '',
      dose: '',
      frequencia: '',
      contabilizarCusto: false,
    };
    onChange({ ...data, clinico: { ...c, farmacos: [...c.farmacos, novo] } });
  };

  const removeFarmaco = (id: string) => {
    if (c.farmacos.length <= 1) return;
    onChange({ ...data, clinico: { ...c, farmacos: c.farmacos.filter(f => f.id !== id) } });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Informação Clínica {isOffLabel ? 'Off-label' : 'On-label'}
          </CardTitle>
          <CardDescription>Dados clínicos do doente e terapêutica proposta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Dados biométricos */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="peso">Peso (kg) *</Label>
              <Input id="peso" type="number" step="0.1" placeholder="70.5" value={c.peso} onChange={e => updateClin('peso', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="altura">Altura (cm) *</Label>
              <Input id="altura" type="number" placeholder="170" value={c.altura} onChange={e => updateClin('altura', e.target.value)} />
            </div>
            <div>
              <Label>ECOG PS *</Label>
              <Select value={c.ecog} onValueChange={v => updateClin('ecog', v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}
                  <SelectItem value="na">Não aplicável</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Indicação terapêutica */}
          <div>
            <Label htmlFor="indicacao">Indicação de terapêutica proposta * (máx. 200 caracteres)</Label>
            <Input
              id="indicacao"
              placeholder="Ex: Carcinoma pulmonar de não pequenas células - Estadio IV"
              value={c.indicacaoTerapeutica}
              onChange={e => updateClin('indicacaoTerapeutica', e.target.value.slice(0, 200))}
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground text-right mt-1">{c.indicacaoTerapeutica.length}/200</p>
          </div>

          {/* Grelha de Fármacos */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Fármacos</Label>
            {c.farmacos.map((f, idx) => (
              <div key={f.id} className="p-4 rounded-lg border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {idx === 0 ? 'Fármaco Principal (Obrigatório)' : `Fármaco ${idx + 1} (Associação)`}
                  </span>
                  {idx > 0 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeFarmaco(f.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id={`manual-${f.id}`}
                    checked={f.modoManual}
                    onCheckedChange={checked => updateFarmaco(f.id, 'modoManual', !!checked)}
                  />
                  <Label htmlFor={`manual-${f.id}`} className="text-xs font-normal cursor-pointer">
                    Não consta no catálogo (modo manual)
                  </Label>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {!f.modoManual ? (
                    <div className="sm:col-span-2">
                      <Label>Medicamento (Catálogo E3) *</Label>
                      <Select value={f.medicamentoId} onValueChange={v => {
                        const med = farmacos.find(m => m.id === v);
                        updateFarmaco(f.id, 'medicamentoId', v);
                        updateFarmaco(f.id, 'medicamentoNome', med?.nome || '');
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pesquisar medicamento..." />
                        </SelectTrigger>
                        <SelectContent>
                          {farmacos.map(m => (
                            <SelectItem key={m.id} value={m.id}>
                              {m.nome} — {m.apresentacao}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <>
                      <div>
                        <Label>Nome do Fármaco *</Label>
                        <Input placeholder="Nome" value={f.nomeManual} onChange={e => updateFarmaco(f.id, 'nomeManual', e.target.value)} />
                      </div>
                      <div>
                        <Label>Forma Farmacêutica *</Label>
                        <Input placeholder="Forma" value={f.formaManual} onChange={e => updateFarmaco(f.id, 'formaManual', e.target.value)} />
                      </div>
                    </>
                  )}
                  <div>
                    <Label>Dose *</Label>
                    <Input placeholder="Ex: 200mg" value={f.dose} onChange={e => updateFarmaco(f.id, 'dose', e.target.value)} />
                  </div>
                  <div>
                    <Label>Frequência *</Label>
                    <Input placeholder="Ex: Q3W" value={f.frequencia} onChange={e => updateFarmaco(f.id, 'frequencia', e.target.value)} />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`custo-${f.id}`}
                    checked={f.contabilizarCusto}
                    onCheckedChange={checked => updateFarmaco(f.id, 'contabilizarCusto', !!checked)}
                  />
                  <Label htmlFor={`custo-${f.id}`} className="text-sm font-normal cursor-pointer">
                    Contabilizar para custo (Driver)
                  </Label>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addFarmaco}>
              <Plus className="h-4 w-4 mr-2" /> Adicionar Fármaco
            </Button>
          </div>

          {/* Linha de Tratamento com branching */}
          <div>
            <Label>Linha de tratamento *</Label>
            <RadioGroup value={c.linhaTratamento} onValueChange={v => updateClin('linhaTratamento', v)} className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="l1" /><Label htmlFor="l1" className="font-normal">1ª linha</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="l2" /><Label htmlFor="l2" className="font-normal">2ª linha</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3+" id="l3" /><Label htmlFor="l3" className="font-normal">3ª ou mais</Label>
              </div>
            </RadioGroup>
          </div>

          {/* História terapêutica prévia (condicional) */}
          {(c.linhaTratamento === '2' || c.linhaTratamento === '3+') && (
            <div>
              <Label>
                História terapêutica prévia ({c.linhaTratamento === '2' ? '1ª linha' : '1ª e 2ª linha'}) *
              </Label>
              <Textarea
                placeholder="Descreva as terapêuticas prévias..."
                value={c.historiaTerapeuticaPrevia}
                onChange={e => updateClin('historiaTerapeuticaPrevia', e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          )}

          {/* Resumo Clínico */}
          <div>
            <Label>Resumo Clínico (máx. 1000 caracteres) *</Label>
            <Textarea
              placeholder="Descreva o contexto clínico, comorbilidades, justificação..."
              value={c.resumoClinico}
              onChange={e => updateClin('resumoClinico', e.target.value.slice(0, 1000))}
              className="min-h-[100px]"
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground text-right mt-1">{c.resumoClinico.length}/1000</p>
          </div>

          {/* Recurso: campo extra */}
          {isRecurso && (
            <div>
              <Label>Fundamentação do Recurso *</Label>
              <Textarea
                placeholder="Justifique a contestação da decisão anterior..."
                value={data.recurso.fundamentacao}
                onChange={e => onChange({ ...data, recurso: { fundamentacao: e.target.value } })}
                className="min-h-[100px]"
              />
            </div>
          )}

          {/* Off-label extras */}
          {isOffLabel && (
            <div className="space-y-4 p-4 rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800">
              <p className="text-sm font-medium text-orange-800 dark:text-orange-200">📋 Documentação Off-label obrigatória</p>
              <div>
                <Label>Bibliografia de Suporte (PDF) *</Label>
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={e => updateClin('bibliografiaPDF', e.target.files?.[0]?.name || '')}
                  className="mt-1"
                />
                {c.bibliografiaPDF && (
                  <p className="text-xs text-muted-foreground mt-1">📎 {c.bibliografiaPDF}</p>
                )}
              </div>
              <div>
                <Label>Justificação da Evidência</Label>
                <Textarea
                  placeholder="Explique o racional se o PDF não for autoexplicativo..."
                  value={c.justificacaoEvidencia}
                  onChange={e => updateClin('justificacaoEvidencia', e.target.value)}
                  className="min-h-[60px]"
                />
              </div>
            </div>
          )}

          {/* Aprovação Diretor */}
          <div className="p-4 rounded-lg bg-muted/50 space-y-3">
            <Label>A terapêutica foi aprovada em reunião de Grupo e/ou pelo Diretor de Serviço? *</Label>
            <RadioGroup value={c.aprovadoDiretor} onValueChange={v => updateClin('aprovadoDiretor', v)} className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="ap-sim" /><Label htmlFor="ap-sim" className="font-normal">Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao" id="ap-nao" /><Label htmlFor="ap-nao" className="font-normal">Não</Label>
              </div>
            </RadioGroup>
            {c.aprovadoDiretor === 'nao' && (
              <div className="space-y-2">
                <p className="text-sm text-orange-600">⚠️ O pedido será encaminhado para validação do Diretor de Serviço.</p>
                <div>
                  <Label>Email institucional do Diretor de Serviço *</Label>
                  <Input
                    type="email"
                    placeholder="diretor@ulssjoao.min-saude.pt"
                    value={c.emailDiretor}
                    onChange={e => updateClin('emailDiretor', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
