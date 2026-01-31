import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { tiposPedido } from '@/lib/data';
import { FileText } from 'lucide-react';

interface TipoPedidoProps {
  value: string;
  onChange: (value: string) => void;
}

export function TipoPedido({ value, onChange }: TipoPedidoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Tipo de Pedido
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 gap-3">
          {tiposPedido.map(tipo => (
            <div
              key={tipo.id}
              onClick={() => onChange(tipo.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                value === tipo.id 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                  : 'border-border hover:border-blue-300'
              }`}
            >
              <p className="font-medium">{tipo.nome}</p>
              <p className="text-sm text-muted-foreground">{tipo.descricao}</p>
              {tipo.requerCES && (
                <Badge variant="outline" className="mt-2 text-orange-600 border-orange-300">
                  Requer CES
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
