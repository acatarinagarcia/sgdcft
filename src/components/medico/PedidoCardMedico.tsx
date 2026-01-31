import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { WorkflowIndicator } from '@/components/WorkflowIndicator';
import { Pedido, servicos, tiposPedido } from '@/lib/data';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface PedidoCardMedicoProps {
  pedido: Pedido;
}

export function PedidoCardMedico({ pedido }: PedidoCardMedicoProps) {
  const servico = servicos.find(s => s.id === pedido.servicoId);
  const tipoPedido = tiposPedido.find(t => t.id === pedido.tipo);

  // No portal médico, o médico vê apenas estado e decisão final, não custos nem dosagens técnicas
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg font-mono">{pedido.codigo}</CardTitle>
              <StatusBadge estado={pedido.estado} />
            </div>
            <CardDescription>
              {tipoPedido?.nome} • Submetido em {format(pedido.dataSubmissao, "d 'de' MMMM 'de' yyyy", { locale: pt })}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Doente</p>
            <p className="font-medium">ND: {pedido.doente.ndDoente || pedido.doente.iniciais}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Indicação</p>
            <p className="font-medium">{pedido.doente.indicacaoTerapeutica || pedido.doente.diagnostico}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Terapêutica Proposta</p>
            <p className="font-medium">{pedido.terapeuticaProposta || '-'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Serviço</p>
            <p className="font-medium">{servico?.nome}</p>
          </div>
        </div>

        <WorkflowIndicator estadoAtual={pedido.estado} />

        {/* Decisão Final (se existir) */}
        {pedido.decisaoCFT && (
          <div className={`p-4 rounded-lg ${
            pedido.decisaoCFT === 'favoravel' 
              ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800' 
              : pedido.decisaoCFT === 'desfavoravel'
              ? 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800'
              : 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800'
          }`}>
            <p className={`font-medium ${
              pedido.decisaoCFT === 'favoravel' 
                ? 'text-green-800 dark:text-green-200' 
                : pedido.decisaoCFT === 'desfavoravel'
                ? 'text-red-800 dark:text-red-200'
                : 'text-amber-800 dark:text-amber-200'
            }`}>
              {pedido.decisaoCFT === 'favoravel' && '✓ Parecer Favorável'}
              {pedido.decisaoCFT === 'desfavoravel' && '✗ Parecer Desfavorável'}
              {pedido.decisaoCFT === 'adiado' && '○ Decisão Adiada'}
            </p>
            {pedido.fundamentacaoCFT && (
              <p className="text-sm mt-1 text-muted-foreground">{pedido.fundamentacaoCFT}</p>
            )}
          </div>
        )}

        {/* Timeline do histórico */}
        <div className="pt-4 border-t">
          <p className="text-sm font-medium mb-3">Histórico</p>
          <div className="space-y-2">
            {pedido.historico.slice(-3).map((h, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-muted-foreground">
                    {format(h.data, "d MMM yyyy, HH:mm", { locale: pt })}
                  </p>
                  <p>{h.observacao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
