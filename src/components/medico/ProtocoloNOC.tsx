import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FileText } from 'lucide-react';

export interface ProtocoloNOCData {
  nomeProtocolo: string;
  aprovadoDiretor: string;
  emailDiretor: string;
}

interface ProtocoloNOCProps {
  data: ProtocoloNOCData;
  onChange: (data: ProtocoloNOCData) => void;
}

export function ProtocoloNOC({ data, onChange }: ProtocoloNOCProps) {
  const handleChange = (field: keyof ProtocoloNOCData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Protocolo / Norma de Orientação Clínica
        </CardTitle>
        <CardDescription>
          Identificação do protocolo ou norma a submeter
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="nomeProtocolo">Identificação do Protocolo/Norma *</Label>
          <Input 
            id="nomeProtocolo"
            placeholder="Ex: Protocolo CLEOPATRA - Cancro da mama HER2+"
            value={data.nomeProtocolo}
            onChange={e => handleChange('nomeProtocolo', e.target.value)}
            required
          />
        </div>

        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            📎 O ficheiro do Protocolo/Norma deverá ser anexado após submissão do pedido, 
            através do portal ou enviado por email para cft@hospital.pt
          </p>
        </div>

        {/* Aprovação do Diretor */}
        <div className="p-4 rounded-lg bg-muted/50 space-y-3">
          <Label>O Protocolo proposto teve aprovação do(s) Diretor(es) de Serviço? *</Label>
          <RadioGroup 
            value={data.aprovadoDiretor} 
            onValueChange={v => handleChange('aprovadoDiretor', v)}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim" id="protocolo-aprovado-sim" />
              <Label htmlFor="protocolo-aprovado-sim" className="font-normal">Sim</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id="protocolo-aprovado-nao" />
              <Label htmlFor="protocolo-aprovado-nao" className="font-normal">Não</Label>
            </div>
          </RadioGroup>
          {data.aprovadoDiretor === 'nao' && (
            <p className="text-sm text-orange-600">
              ⚠️ Por favor obtenha a aprovação necessária antes de submeter o pedido.
            </p>
          )}
        </div>

        {data.aprovadoDiretor === 'sim' && (
          <div>
            <Label htmlFor="emailDiretorProtocolo">Email institucional do Diretor de Serviço *</Label>
            <Input 
              id="emailDiretorProtocolo"
              type="email"
              placeholder="diretor@ulssjoao.min-saude.pt"
              value={data.emailDiretor}
              onChange={e => handleChange('emailDiretor', e.target.value)}
              required
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
