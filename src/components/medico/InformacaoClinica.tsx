import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ClipboardList } from 'lucide-react';

export interface InformacaoClinicaData {
  ndDoente: string;
  peso: string;
  altura: string;
  ecog: string;
  indicacaoTerapeutica: string;
  terapeuticaProposta: string;
  linhaTratamento: string;
  historiaTerapeuticaPrevia: string;
  resumoClinico: string;
  aprovadoDiretor: string;
}

interface InformacaoClinicaProps {
  data: InformacaoClinicaData;
  onChange: (data: InformacaoClinicaData) => void;
  tipoPedido: string;
}

export function InformacaoClinica({ data, onChange, tipoPedido }: InformacaoClinicaProps) {
  const handleChange = (field: keyof InformacaoClinicaData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const isOffLabel = tipoPedido === 'casuistico-off';
  const maxResumo = isOffLabel ? 2500 : 1500;

  // Para Introdução no Formulário ou Protocolo, os campos são diferentes
  const isIntroducaoOuProtocolo = tipoPedido === 'formulario' || tipoPedido === 'protocolo';

  if (isIntroducaoOuProtocolo) {
    return null; // Estes tipos têm formulário diferente, tratado separadamente
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          Informação Clínica {isOffLabel ? 'Off-label' : 'On-label'}
        </CardTitle>
        <CardDescription>
          Dados clínicos do doente para avaliação do pedido
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dados do Doente */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="ndDoente">ND do Doente *</Label>
            <Input 
              id="ndDoente"
              type="number"
              placeholder="123456"
              value={data.ndDoente}
              onChange={e => handleChange('ndDoente', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="peso">Peso (kg) *</Label>
            <Input 
              id="peso"
              type="number"
              placeholder="70"
              value={data.peso}
              onChange={e => handleChange('peso', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="altura">Altura (cm) *</Label>
            <Input 
              id="altura"
              type="number"
              placeholder="170"
              value={data.altura}
              onChange={e => handleChange('altura', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="ecog">ECOG PS *</Label>
            <Select value={data.ecog} onValueChange={v => handleChange('ecog', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {[0, 1, 2, 3, 4].map(n => (
                  <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                ))}
                <SelectItem value="na">Não aplicável</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Indicação e Terapêutica */}
        <div>
          <Label htmlFor="indicacao">Indicação de terapêutica proposta *</Label>
          <Input 
            id="indicacao"
            placeholder="Ex: Carcinoma pulmonar de não pequenas células - Estadio IV"
            value={data.indicacaoTerapeutica}
            onChange={e => handleChange('indicacaoTerapeutica', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="terapeutica">Terapêutica proposta *</Label>
          <Input 
            id="terapeutica"
            placeholder="Ex: Pembrolizumab"
            value={data.terapeuticaProposta}
            onChange={e => handleChange('terapeuticaProposta', e.target.value)}
            required
          />
        </div>

        {/* Linha de Tratamento */}
        <div>
          <Label>Linha de tratamento *</Label>
          <RadioGroup 
            value={data.linhaTratamento} 
            onValueChange={v => handleChange('linhaTratamento', v)}
            className="flex gap-6 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="linha1" />
              <Label htmlFor="linha1" className="font-normal">1ª linha</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="linha2" />
              <Label htmlFor="linha2" className="font-normal">2ª linha</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3+" id="linha3" />
              <Label htmlFor="linha3" className="font-normal">3ª ou mais linhas</Label>
            </div>
          </RadioGroup>
        </div>

        {/* História Terapêutica */}
        <div>
          <Label htmlFor="historia">
            História de terapêutica prévia {data.linhaTratamento === '2' || data.linhaTratamento === '3+' ? '(1ª e 2ª linha)' : '(1ª linha)'} *
          </Label>
          <Textarea 
            id="historia"
            placeholder="Descreva as terapêuticas prévias realizadas..."
            value={data.historiaTerapeuticaPrevia}
            onChange={e => handleChange('historiaTerapeuticaPrevia', e.target.value)}
            className="min-h-[80px]"
            required
          />
        </div>

        {/* Resumo Clínico */}
        <div>
          <Label htmlFor="resumo">Resumo Clínico (máximo {maxResumo} caracteres) *</Label>
          <Textarea 
            id="resumo"
            placeholder="Descreva o contexto clínico, comorbilidades relevantes, justificação para a terapêutica proposta..."
            value={data.resumoClinico}
            onChange={e => handleChange('resumoClinico', e.target.value.slice(0, maxResumo))}
            className="min-h-[120px]"
            maxLength={maxResumo}
            required
          />
          <p className="text-sm text-muted-foreground mt-1 text-right">
            {data.resumoClinico.length}/{maxResumo} caracteres
          </p>
        </div>

        {/* Aprovação do Diretor */}
        <div className="p-4 rounded-lg bg-muted/50 space-y-3">
          <Label>A terapêutica proposta foi aprovada em reunião de Grupo e/ou pelo Diretor de Serviço? *</Label>
          <RadioGroup 
            value={data.aprovadoDiretor} 
            onValueChange={v => handleChange('aprovadoDiretor', v)}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim" id="aprovado-sim" />
              <Label htmlFor="aprovado-sim" className="font-normal">Sim</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id="aprovado-nao" />
              <Label htmlFor="aprovado-nao" className="font-normal">Não</Label>
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
