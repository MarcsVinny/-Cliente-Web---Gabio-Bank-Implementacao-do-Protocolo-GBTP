/**
 * @file websocket.ts
 * @description Gerenciamento simples da conexão de rede via WebSocket.
 * 
 * Aqui é onde o "túnel" de comunicação com o servidor é aberto.
 */

import { GBTPRequest, GBTPResponse, buildRequest, parseResponse } from './protocol';

// Endereço do servidor (onde o backend está rodando)
const URL_SERVIDOR = 'ws://localhost:8080';

// Variável que guarda a conexão
let conexao: WebSocket | null = null;

// Funções "vazias" que serão preenchidas pelo arquivo principal (main.ts)
// Isso serve para avisar a tela quando algo acontece na rede.
let acaoAoReceberMensagem: ((res: GBTPResponse) => void) | null = null;
let acaoAoMudarStatus: ((status: string, erro?: string) => void) | null = null;

/**
 * Função para conectar ao servidor.
 */
export function conectar(): void {
  // Se já estiver conectado, não faz nada
  if (conexao !== null && conexao.readyState === WebSocket.OPEN) {
    return;
  }

  // Cria o túnel de comunicação
  conexao = new WebSocket(URL_SERVIDOR);

  // Quando o túnel abre com sucesso
  conexao.onopen = function() {
    if (acaoAoMudarStatus) acaoAoMudarStatus('connected');
  };

  // Quando o túnel é fechado
  conexao.onclose = function() {
    if (acaoAoMudarStatus) acaoAoMudarStatus('disconnected');
    conexao = null;
  };

  // Quando ocorre algum erro na rede
  conexao.onerror = function() {
    if (acaoAoMudarStatus) acaoAoMudarStatus('error', 'Não foi possível alcançar o servidor.');
  };

  // Quando o servidor envia uma resposta (O CORAÇÃO DO PROTOCOLO)
  conexao.onmessage = function(evento) {
    const textoBruto = evento.data; // Texto que veio do servidor
    
    // Transformamos o texto em um objeto usando a lógica do protocol.ts
    const respostaObjeto = parseResponse(textoBruto);
    
    // Avisamos a tela para mostrar o resultado
    if (acaoAoReceberMensagem) {
      acaoAoReceberMensagem(respostaObjeto);
    }
  };
}

/**
 * Função para desconectar.
 */
export function desconectar(): void {
  if (conexao) {
    conexao.close();
    conexao = null;
  }
}

/**
 * Envia um pedido para o servidor.
 */
export function enviarPedido(pedido: GBTPRequest): boolean {
  // Só envia se estiver conectado
  if (conexao === null || conexao.readyState !== WebSocket.OPEN) {
    return false;
  }

  // Transformamos o objeto em texto GBTP
  const textoParaEnviar = buildRequest(pedido);
  
  // Enviamos o texto pelo túnel
  conexao.send(textoParaEnviar);
  return true;
}

/**
 * Funções para o main.ts "se inscrever" nos eventos
 */
export function configurarAcaoMensagem(funcao: (res: GBTPResponse) => void) {
  acaoAoReceberMensagem = funcao;
}

export function configurarAcaoStatus(funcao: (status: string, erro?: string) => void) {
  acaoAoMudarStatus = funcao;
}

export function estaConectado(): boolean {
  return conexao !== null && conexao.readyState === WebSocket.OPEN;
}
