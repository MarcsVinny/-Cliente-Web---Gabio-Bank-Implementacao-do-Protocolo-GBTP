# 🧠 Os Últimos Três Neurônios — Gabio Client

Este projeto é a implementação do **Cliente Web** para o protocolo **GBTP** (Gabio Bank Transaction Protocol), desenvolvido para a disciplina de **Redes de Computadores**.

## 👥 Equipe (Os Últimos Três Neurônios)
- Gisele Dias Plácido
- Josiane Amorim Mendes
- Marcos Vinícius de Oliveira Teixeira

## 📑 Protocolo GBTP
O GBTP é um protocolo textual inspirado no CNET, estruturado em pares `CHAVE:VALOR` separados por nova linha (`\n`).

### 1. Formato de Requisição
| Campo | Descrição |
|---|---|
| **OPERATION** | Tipo de operação: `BALANCE`, `DEPOSIT`, `WITHDRAW`, `TRANSFER` |
| **ACCOUNT_ID** | Identificador da conta principal |
| **TO_ACCOUNT_ID** | Identificador da conta de destino (apenas para `TRANSFER`) |
| **VALUE** | Valor numérico da transação (pode ser `0` para `BALANCE`) |

### 2. Formato de Resposta
| Campo | Descrição |
|---|---|
| **STATUS** | Resultado da operação: `OK` ou `ERROR` |
| **MESSAGE** | Mensagem descritiva sobre o processamento |
| **BALANCE** | Saldo atual da conta principal |

## 🚀 Como Executar

1. **Instalar Dependências:**
   ```bash
   npm install
   ```

2. **Iniciar o Cliente:**
   ```bash
   npm start
   ```
   Acesse: `http://localhost:1234`

## 🛠️ Requisitos de Implementação Atendidos
- [x] Cliente Web em HTML + TypeScript.
- [x] Interface para enviar mensagens GBTP via WebSocket.
- [x] Exibição de respostas do servidor em tempo real.
- [x] Validações de campos obrigatórios e valores não-negativos.
- [x] Documentação completa do protocolo.

---
**Data Limite:** 20 de maio de 2026  
**Disciplina:** Redes de Computadores  
**Instituição:** ADS
