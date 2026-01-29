
# 🏥 SGT-CFT - Sistema de Gestão Terapêutica

Sistema de demonstração para gestão de pedidos de medicamentos especiais em ambiente hospitalar, com workflow completo desde a submissão até à deliberação.

---

## 📊 Dashboard Principal

Página inicial com visão geral do sistema:
- **Estatísticas em tempo real**: total de pedidos, em triagem, em agenda, aprovados e taxa de aprovação
- **Impacto financeiro**: cálculo automático do custo dos tratamentos
- **Cards de acesso rápido** aos portais: Médico, Farmácia, CFT
- **Próxima reunião CFT**: data, hora e número de pedidos agendados
- **Visualização do workflow**: fluxo Submissão → Triagem → Agenda CFT → Deliberação

---

## 🩺 Portal Médico

Interface para submissão de pedidos terapêuticos:

**Tipos de Pedido:**
- Casuístico On-label
- Casuístico Off-label (requer CES)
- Introdução no Formulário Hospitalar
- Protocolo/NOC

**Formulário de Submissão:**
- Dados do doente (iniciais, idade, peso, ECOG, diagnóstico)
- Seleção de medicamento com catálogo pré-definido
- Serviço e circuito de dispensa
- Duração prevista do tratamento
- **Cálculo automático de impacto** (custo mensal, total, até fim do ano)
- Justificação clínica com limite de caracteres

**Gestão de Pedidos:**
- Lista "Meus Pedidos" com estado atual
- Visualização do progresso no workflow

---

## 💊 Portal Farmácia

Triagem técnica e encaminhamento de pedidos:

**Funcionalidades:**
- **Filtros por estado**: Todos, Aguardam, Em Triagem, Pendente Info
- **Contadores visuais** de pedidos por estado
- Vista detalhada de cada pedido com informações clínicas e impacto financeiro

**Ações disponíveis:**
- Iniciar triagem
- Validação NOC (para medicamentos em protocolo)
- Encaminhar para Direção Clínica
- **Agendar para reunião CFT** (com seleção de data)
- Pedir informação adicional ao médico

---

## 📋 Portal CFT

Gestão das reuniões da Comissão de Farmácia e Terapêutica:

**Gestão de Reuniões:**
- Calendário de reuniões com datas pré-definidas
- Registo de número de ata
- Impacto financeiro total da agenda

**Deliberação:**
- Lista numerada de pedidos em agenda
- Informações completas: diagnóstico, justificação, impacto
- **Decisões**: Favorável → CA | Desfavorável → Rejeitado | Adiado

**Histórico:**
- Lista de pedidos deliberados
- Estado final e decisão registada

---

## ⚙️ Características Técnicas

**Dados em Memória:**
- Catálogo de 7 fármacos com preços e escalões
- 12 serviços hospitalares
- 4 reuniões CFT pré-agendadas
- Estados de workflow configurados

**Componentes Reutilizáveis:**
- Badges coloridos por estado
- Cards informativos
- Inputs com validação
- Timeline de histórico do pedido
- Indicador visual do progresso no workflow

**Experiência do Utilizador:**
- Animações suaves de transição
- Notificações toast para feedback
- Design responsivo mobile-friendly
- Cores consistentes por estado/tipo

---

## 🎨 Design

- **Tema escuro** na homepage com gradiente profissional
- **Tema claro** nos portais para fácil leitura
- **Header fixo** com navegação e contadores
- **Cores por contexto**: azul (médico), verde (farmácia), roxo (CFT)
- Tipografia Inter para texto, JetBrains Mono para códigos

