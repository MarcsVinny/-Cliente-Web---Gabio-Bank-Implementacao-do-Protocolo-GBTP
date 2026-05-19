/**
 * @file protocol.ts
 * @description Lógica simplificada para montar e ler mensagens do protocolo GBTP.
 * 
 * O professor quer ver como transformamos um OBJETO em TEXTO e vice-versa.
 */

// Definimos as operações que o banco aceita
export type Operation = 'BALANCE' | 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER';

// Estrutura do que enviamos para o servidor
export interface GBTPRequest {
  operation: Operation;
  accountId: string;
  toAccountId: string; 
  value: number;
}

// Estrutura do que recebemos do servidor
export interface GBTPResponse {
  status: 'OK' | 'ERROR';
  message: string;
  balance: string;
}

/**
 * Pega os dados da tela e transforma em uma string no formato:
 * CHAVE:VALOR\nCHAVE:VALOR...
 */
export function buildRequest(req: GBTPRequest): string {
  // Criamos as linhas uma por uma de forma simples
  const linha1 = "OPERATION:" + req.operation;
  const linha2 = "ACCOUNT_ID:" + req.accountId;
  const linha3 = "TO_ACCOUNT_ID:" + req.toAccountId;
  
  // No BALANCE o professor pediu VALUE:0 (sem casas decimais)
  // Nas outras operações usamos VALUE:100.00 (com duas casas)
  const valorFormatado = (req.operation === 'BALANCE') ? "0" : req.value.toFixed(2);
  const linha4 = "VALUE:" + valorFormatado;

  // Juntamos tudo com uma quebra de linha (\n)
  return linha1 + "\n" + linha2 + "\n" + linha3 + "\n" + linha4;
}

/**
 * Pega o texto bruto que veio do servidor e transforma em um objeto que o JS entende.
 */
export function parseResponse(rawText: string): GBTPResponse {
  // 1. Quebramos o texto em várias linhas
  const linhas = rawText.trim().split('\n');
  
  // Variáveis para guardar o que encontrarmos
  let status = "ERROR";
  let message = "Erro desconhecido";
  let balance = "0.00";

  // 2. Percorremos cada linha para achar os valores
  for (let i = 0; i < linhas.length; i++) {
    const linhaAtual = linhas[i];
    
    // Separamos a chave do valor usando o ":"
    const partes = linhaAtual.split(':');
    const chave = partes[0].trim();
    const valor = partes[1] ? partes[1].trim() : "";

    // Guardamos o valor na variável correta
    if (chave === "STATUS") {
      status = valor;
    } else if (chave === "MESSAGE") {
      message = valor;
    } else if (chave === "BALANCE") {
      balance = valor;
    }
  }

  // Retornamos tudo organizado em um objeto
  return {
    status: status as 'OK' | 'ERROR',
    message: message,
    balance: balance
  };
}
