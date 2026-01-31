import React, { createContext, useContext, useState, useCallback } from 'react';
import { Pedido, pedidosIniciais, EstadoPedido } from '@/lib/data';

interface PedidosContextType {
  pedidos: Pedido[];
  adicionarPedido: (pedido: Omit<Pedido, 'id' | 'codigo' | 'historico'>) => void;
  atualizarEstado: (id: string, novoEstado: EstadoPedido, observacao?: string) => void;
  agendarCFT: (id: string, reuniaoId: string) => void;
  deliberar: (id: string, decisao: 'favoravel' | 'desfavoravel' | 'adiado', observacao?: string) => void;
  getPedidosByEstado: (estado: EstadoPedido | 'todos') => Pedido[];
  getPedidosByReuniao: (reuniaoId: string) => Pedido[];
  getEstatisticas: () => {
    total: number;
    emTriagem: number;
    emAgenda: number;
    aprovados: number;
    taxaAprovacao: number;
    impactoTotal: number;
  };
}

const PedidosContext = createContext<PedidosContextType | undefined>(undefined);

export function PedidosProvider({ children }: { children: React.ReactNode }) {
  const [pedidos, setPedidos] = useState<Pedido[]>(pedidosIniciais);

  const gerarCodigo = useCallback(() => {
    const ano = new Date().getFullYear();
    const numero = pedidos.length + 1;
    return `CFT-${ano}-${numero.toString().padStart(4, '0')}`;
  }, [pedidos.length]);

  const adicionarPedido = useCallback((novoPedido: Omit<Pedido, 'id' | 'codigo' | 'historico'>) => {
    const id = Date.now().toString();
    const pedido: Pedido = {
      ...novoPedido,
      id,
      codigo: gerarCodigo(),
      historico: [{
        data: new Date(),
        estado: 'submetido',
        observacao: 'Pedido submetido pelo serviço'
      }]
    };
    setPedidos(prev => [...prev, pedido]);
  }, [gerarCodigo]);

  const atualizarEstado = useCallback((id: string, novoEstado: EstadoPedido, observacao?: string) => {
    setPedidos(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          estado: novoEstado,
          dataUltimaAtualizacao: new Date(),
          historico: [...p.historico, {
            data: new Date(),
            estado: novoEstado,
            observacao
          }]
        };
      }
      return p;
    }));
  }, []);

  const agendarCFT = useCallback((id: string, reuniaoId: string) => {
    setPedidos(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          estado: 'agenda-cft' as EstadoPedido,
          reuniaoCFTId: reuniaoId,
          dataUltimaAtualizacao: new Date(),
          historico: [...p.historico, {
            data: new Date(),
            estado: 'agenda-cft' as EstadoPedido,
            observacao: 'Agendado para reunião CFT'
          }]
        };
      }
      return p;
    }));
  }, []);

  const deliberar = useCallback((id: string, decisao: 'favoravel' | 'desfavoravel' | 'adiado', observacao?: string) => {
    setPedidos(prev => prev.map(p => {
      if (p.id === id) {
        const novoEstado: EstadoPedido = decisao === 'favoravel' ? 'aprovado' : 
                                          decisao === 'desfavoravel' ? 'rejeitado' : 'agenda-cft';
        return {
          ...p,
          estado: novoEstado,
          decisaoCFT: decisao,
          dataUltimaAtualizacao: new Date(),
          historico: [...p.historico, {
            data: new Date(),
            estado: novoEstado,
            observacao: observacao || `Decisão CFT: ${decisao}`
          }]
        };
      }
      return p;
    }));
  }, []);

  const getPedidosByEstado = useCallback((estado: EstadoPedido | 'todos') => {
    if (estado === 'todos') return pedidos;
    return pedidos.filter(p => p.estado === estado);
  }, [pedidos]);

  const getPedidosByReuniao = useCallback((reuniaoId: string) => {
    return pedidos.filter(p => p.reuniaoCFTId === reuniaoId);
  }, [pedidos]);

  const getEstatisticas = useCallback(() => {
    const total = pedidos.length;
    const emTriagem = pedidos.filter(p => p.estado === 'em-triagem').length;
    const emAgenda = pedidos.filter(p => p.estado === 'agenda-cft').length;
    const aprovados = pedidos.filter(p => p.estado === 'aprovado').length;
    const deliberados = pedidos.filter(p => p.estado === 'aprovado' || p.estado === 'rejeitado').length;
    const taxaAprovacao = deliberados > 0 ? (aprovados / deliberados) * 100 : 0;
    const impactoTotal = pedidos
      .filter(p => p.estado === 'aprovado')
      .reduce((acc, p) => acc + (p.impacto?.custoTotal || 0), 0);

    return { total, emTriagem, emAgenda, aprovados, taxaAprovacao, impactoTotal };
  }, [pedidos]);

  return (
    <PedidosContext.Provider value={{
      pedidos,
      adicionarPedido,
      atualizarEstado,
      agendarCFT,
      deliberar,
      getPedidosByEstado,
      getPedidosByReuniao,
      getEstatisticas
    }}>
      {children}
    </PedidosContext.Provider>
  );
}

export function usePedidos() {
  const context = useContext(PedidosContext);
  if (context === undefined) {
    throw new Error('usePedidos must be used within a PedidosProvider');
  }
  return context;
}
