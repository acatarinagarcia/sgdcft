import { ArrowRight, FileText, Search, Calendar, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EstadoPedido } from '@/lib/data';

interface WorkflowIndicatorProps {
  estadoAtual: EstadoPedido;
  className?: string;
}

const etapas = [
  { id: 'submetido', label: 'Submissão', icon: FileText },
  { id: 'em-triagem', label: 'Triagem', icon: Search },
  { id: 'agenda-cft', label: 'Agenda CFT', icon: Calendar },
  { id: 'aprovado', label: 'Deliberação', icon: CheckCircle },
];

export function WorkflowIndicator({ estadoAtual, className }: WorkflowIndicatorProps) {
  const getEtapaIndex = (estado: EstadoPedido): number => {
    if (estado === 'rejeitado') return 3;
    if (estado === 'pendente-info' || estado === 'encaminhado-dc') return 1;
    return etapas.findIndex(e => e.id === estado);
  };

  const etapaAtual = getEtapaIndex(estadoAtual);

  return (
    <div className={cn('flex items-center justify-between', className)}>
      {etapas.map((etapa, index) => {
        const Icon = etapa.icon;
        const isCompleted = index < etapaAtual;
        const isCurrent = index === etapaAtual;
        const isRejected = estadoAtual === 'rejeitado' && index === 3;

        return (
          <div key={etapa.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'h-10 w-10 rounded-full flex items-center justify-center transition-colors',
                  isCompleted && 'bg-green-500 text-white',
                  isCurrent && !isRejected && 'bg-primary text-primary-foreground ring-4 ring-primary/20',
                  isRejected && 'bg-red-500 text-white',
                  !isCompleted && !isCurrent && 'bg-background text-muted-foreground border border-border'
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className={cn(
                'mt-2 text-xs font-medium',
                (isCompleted || isCurrent) ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {etapa.label}
              </span>
            </div>
            
            {index < etapas.length - 1 && (
              <ArrowRight className={cn(
                'h-5 w-5 mx-2 mt-[-1rem]',
                index < etapaAtual ? 'text-green-500' : 'text-muted-foreground/50'
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}
