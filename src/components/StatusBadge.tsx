import { Badge } from '@/components/ui/badge';
import { estados, EstadoPedido } from '@/lib/data';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  estado: EstadoPedido;
  className?: string;
}

export function StatusBadge({ estado, className }: StatusBadgeProps) {
  const config = estados[estado];
  
  return (
    <Badge 
      className={cn(
        'font-medium',
        config.cor,
        'text-white border-0',
        className
      )}
    >
      {config.nome}
    </Badge>
  );
}
