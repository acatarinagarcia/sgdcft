import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { servicos } from '@/lib/data';

interface IdentificacaoMedicoData {
  nomeCompleto: string;
  servicoId: string;
  telemovel: string;
  emailDiretor: string;
}

interface IdentificacaoMedicoProps {
  data: IdentificacaoMedicoData;
  onChange: (data: IdentificacaoMedicoData) => void;
}

export function IdentificacaoMedico({ data, onChange }: IdentificacaoMedicoProps) {
  const handleChange = (field: keyof IdentificacaoMedicoData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-5 w-5" />
          Identificação do Médico Assistente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nomeCompleto">Nome Completo *</Label>
            <Input 
              id="nomeCompleto"
              placeholder="Dr. Nome Apelido"
              value={data.nomeCompleto}
              onChange={e => handleChange('nomeCompleto', e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Serviço a que pertence *</Label>
            <Select value={data.servicoId} onValueChange={v => handleChange('servicoId', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o serviço" />
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
            <Label htmlFor="telemovel">Telemóvel *</Label>
            <Input 
              id="telemovel"
              type="tel"
              placeholder="912 345 678"
              value={data.telemovel}
              onChange={e => handleChange('telemovel', e.target.value.replace(/[^0-9\s]/g, ''))}
              required
            />
          </div>
          <div>
            <Label htmlFor="emailDiretor">Email institucional do Diretor de Serviço *</Label>
            <Input 
              id="emailDiretor"
              type="email"
              placeholder="diretor@ulssjoao.min-saude.pt"
              value={data.emailDiretor}
              onChange={e => handleChange('emailDiretor', e.target.value)}
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
