import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { User, UserCheck, Check, AlertCircle } from 'lucide-react';
import { WizardState } from './types';
import { servicos } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Passo1Props {
  data: WizardState;
  onChange: (data: WizardState) => void;
}

export function Passo1Identificacao({ data, onChange }: Passo1Props) {
  const isFarmacia = data.identificacao.perfil === 'farmacia' || data.identificacao.perfil === 'secretariado';

  const updateIdentificacao = (field: string, value: string) => {
    onChange({
      ...data,
      identificacao: { ...data.identificacao, [field]: value },
    });
  };

  const updateDoente = (field: string, value: string | boolean) => {
    onChange({
      ...data,
      doente: { ...data.doente, [field]: value },
    });
  };

  // Mock SONHO validation
  const validarND = (nd: string) => {
    updateDoente('ndDoente', nd);
    if (nd.length >= 4) {
      updateDoente('validado', true);
    } else {
      updateDoente('validado', false);
    }
  };

  return (
    <div className="space-y-6">
      {/* SSO - Dados pré-carregados */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Identificação do Utilizador
            <Badge variant="secondary" className="ml-2 text-xs">SSO</Badge>
          </CardTitle>
          <CardDescription>Dados carregados automaticamente via autenticação institucional</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Nome Completo</Label>
              <Input value={data.identificacao.nomeCompleto} disabled className="bg-muted/50" />
            </div>
            <div>
              <Label>Serviço</Label>
              <Select value={data.identificacao.servico} onValueChange={v => updateIdentificacao('servico', v)}>
                <SelectTrigger className="bg-muted/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {servicos.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Email institucional</Label>
              <Input value={data.identificacao.emailInstitucional} disabled className="bg-muted/50" />
            </div>
            <div>
              <Label htmlFor="telemovel">Telemóvel *</Label>
              <Input
                id="telemovel"
                type="tel"
                placeholder="912 345 678"
                value={data.identificacao.telemovel}
                onChange={e => updateIdentificacao('telemovel', e.target.value.replace(/[^0-9\s]/g, ''))}
                required
              />
              {!data.identificacao.telemovel && (
                <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Campo obrigatório e bloqueante
                </p>
              )}
            </div>
          </div>
          {/* Perfil selector (para demo) */}
          <div className="p-3 rounded-lg bg-muted/30 border border-dashed border-border">
            <Label className="text-xs text-muted-foreground">Perfil (simulação demo)</Label>
            <Select
              value={data.identificacao.perfil}
              onValueChange={v => updateIdentificacao('perfil', v)}
            >
              <SelectTrigger className="mt-1 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="medico">Médico</SelectItem>
                <SelectItem value="farmacia">Farmácia</SelectItem>
                <SelectItem value="secretariado">Secretariado</SelectItem>
                <SelectItem value="nutricionista">Nutricionista</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vínculo ao Doente */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Vínculo ao Doente
          </CardTitle>
          <CardDescription>Este pedido associa-se a um doente específico?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            value={data.vinculoDoente}
            onValueChange={v => {
              onChange({
                ...data,
                vinculoDoente: v as 'sim' | 'nao',
                // Reset downstream choices
                tipoSemDoente: '',
                objetivoSubmissao: '',
                classificacaoNova: '',
                doente: { ...data.doente, ndDoente: '', validado: false, doenteExterno: false, nomeManual: '', snsManual: '', dataNascManual: '' },
              });
            }}
          >
            <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${data.vinculoDoente === 'nao' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="nao" id="vinculo-nao" />
                <div>
                  <Label htmlFor="vinculo-nao" className="font-medium cursor-pointer">Não — Processo Documental</Label>
                  <p className="text-sm text-muted-foreground">Introdução no Formulário ou Protocolo/NOC (sem doente associado)</p>
                </div>
              </div>
            </div>
            <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${data.vinculoDoente === 'sim' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="sim" id="vinculo-sim" />
                <div>
                  <Label htmlFor="vinculo-sim" className="font-medium cursor-pointer">Sim — Processo Clínico</Label>
                  <p className="text-sm text-muted-foreground">Pedido associado a um doente identificado</p>
                </div>
              </div>
            </div>
          </RadioGroup>

          {/* Se SIM: ND do Doente */}
          {data.vinculoDoente === 'sim' && (
            <div className="space-y-4 pt-2">
              {/* Exceção Farmácia: Doente Externo */}
              {isFarmacia && (
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                  <Checkbox
                    id="doente-externo"
                    checked={data.doente.doenteExterno}
                    onCheckedChange={(checked) => {
                      updateDoente('doenteExterno', !!checked);
                      if (checked) {
                        updateDoente('validado', true);
                        updateDoente('ndDoente', '');
                      } else {
                        updateDoente('validado', false);
                      }
                    }}
                  />
                  <div>
                    <Label htmlFor="doente-externo" className="font-medium cursor-pointer">Doente Externo / Sem Processo</Label>
                    <p className="text-xs text-muted-foreground">Ignora validação SONHO. Preencha os dados manualmente.</p>
                  </div>
                </div>
              )}

              {!data.doente.doenteExterno ? (
                <div>
                  <Label htmlFor="nd-doente">ND do Doente *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="nd-doente"
                      placeholder="Ex: 123456"
                      value={data.doente.ndDoente}
                      onChange={e => validarND(e.target.value.replace(/\D/g, ''))}
                      className="max-w-[200px]"
                    />
                    {data.doente.validado && (
                      <Badge variant="outline" className="text-green-600 border-green-300 flex items-center gap-1">
                        <Check className="h-3 w-3" /> Validado SONHO
                      </Badge>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="nome-manual">Nome do Doente *</Label>
                    <Input
                      id="nome-manual"
                      placeholder="Nome completo"
                      value={data.doente.nomeManual}
                      onChange={e => updateDoente('nomeManual', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sns-manual">Nº SNS *</Label>
                    <Input
                      id="sns-manual"
                      placeholder="123456789"
                      value={data.doente.snsManual}
                      onChange={e => updateDoente('snsManual', e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="datanasc-manual">Data de Nascimento *</Label>
                    <Input
                      id="datanasc-manual"
                      type="date"
                      value={data.doente.dataNascManual}
                      onChange={e => updateDoente('dataNascManual', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
