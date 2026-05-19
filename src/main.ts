/**
 * @file main.ts
 * @description O arquivo principal que "cola" a rede com a tela.
 */

import { conectar, desconectar, enviarPedido, configurarAcaoMensagem, configurarAcaoStatus, estaConectado } from './websocket';
import { atualizarPainelResposta, adicionarAoLog, atualizarStatusConexao, ajustarCamposDaTela, mostrarErroFormulario } from './ui';
import { Operation, GBTPRequest, buildRequest } from './protocol';
import { validarDados } from './validations';

// Variável para saber qual botão de operação está clicado (Saldo por padrão)
let operacaoEscolhida: Operation = 'BALANCE';

// ─── 1. CONFIGURAR OS BOTÕES DE OPERAÇÃO (Tabs) ──────────────────

const botoesOperacao = document.querySelectorAll('.op-tab');

botoesOperacao.forEach(function(botao) {
  botao.addEventListener('click', function() {
    // 1. Tira a cor de "ativo" de todos os botões
    botoesOperacao.forEach(b => b.classList.remove('active'));
    
    // 2. Coloca a cor de "ativo" só no que clicamos
    botao.classList.add('active');

    // 3. Pega o nome da operação (ex: DEPOSIT) que guardamos no HTML
    operacaoEscolhida = (botao as HTMLElement).dataset.op as Operation;
    
    // 4. Ajusta quais campos aparecem na tela
    ajustarCamposDaTela(operacaoEscolhida);
    mostrarErroFormulario(""); // Limpa erros antigos
  });
});

// ─── 2. BOTÃO DE CONECTAR / DESCONECTAR ──────────────────────────

const botaoConectar = document.getElementById('btn-connect')!;

botaoConectar.addEventListener('click', function() {
  if (estaConectado()) {
    desconectar();
    adicionarAoLog("Você se desconectou do servidor.", "connect");
  } else {
    adicionarAoLog("Tentando abrir conexão...", "connect");
    conectar();
  }
});

// ─── 3. BOTÃO DE ENVIAR (A MÁGICA ACONTECE AQUI) ─────────────────

const botaoEnviar = document.getElementById('btn-send')!;

botaoEnviar.addEventListener('click', function() {
  mostrarErroFormulario(""); // Limpa erros antes de começar

  // Pegamos os valores que o usuário digitou
  const contaOrigem = (document.getElementById('account-id') as HTMLInputElement).value;
  const contaDestino = (document.getElementById('to-account-id') as HTMLInputElement).value;
  const valorTexto = (document.getElementById('value') as HTMLInputElement).value;
  
  // Convertemos o valor para número (se for saldo, o valor é 0)
  let valorNumero = 0;
  if (operacaoEscolhida !== "BALANCE") {
    valorNumero = parseFloat(valorTexto);
  }

  // Criamos o objeto do pedido
  const pedido: GBTPRequest = {
    operation: operacaoEscolhida,
    accountId: contaOrigem,
    toAccountId: contaDestino,
    value: isNaN(valorNumero) ? 0 : valorNumero
  };

  // VALIDAMOS os dados antes de enviar
  const erro = validarDados(pedido);
  if (erro !== "") {
    mostrarErroFormulario(erro);
    return; // Para aqui se tiver erro
  }

  // Se chegou aqui, os dados estão OK!
  adicionarAoLog("► Enviando: " + pedido.operation + " da conta " + pedido.accountId, "send");
  
  // Mostramos no log como o protocolo fica em texto puro (CHAVE:VALOR)
  const textoPuro = buildRequest(pedido);
  adicionarAoLog(textoPuro, "raw");

  // Enviamos de verdade pela rede
  const deuCertoOEnvio = enviarPedido(pedido);
  if (!deuCertoOEnvio) {
    mostrarErroFormulario("Você precisa estar conectado ao servidor primeiro!");
    adicionarAoLog("Erro: O pedido não foi enviado pois não há conexão.", "error");
  }
});

// ─── 4. BOTÃO LIMPAR LOG ─────────────────────────────────────────

document.getElementById('btn-clear-log')!.addEventListener('click', function() {
  document.getElementById('log-terminal')!.innerHTML = "";
  adicionarAoLog("Histórico limpo pelo usuário.", "info");
});

// ─── 5. O QUE FAZER QUANDO A REDE RESPONDER? ─────────────────────

// Configuramos a ação para quando chegar uma mensagem do servidor
configurarAcaoMensagem(function(resposta) {
  // Mostra os dados bonitinhos no painel
  atualizarPainelResposta(resposta);

  // Coloca no log o que o servidor respondeu
  const corLog = (resposta.status === 'OK') ? 'ok' : 'error';
  adicionarAoLog("◄ Resposta: " + resposta.status + " | " + resposta.message, corLog);
});

// Configuramos a ação para quando o status da rede mudar (conectou/caiu)
configurarAcaoStatus(function(status, mensagemErro) {
  atualizarStatusConexao(status);

  // Habilita ou desabilita o botão de enviar
  const btn = document.getElementById('btn-send') as HTMLButtonElement;
  btn.disabled = (status !== 'connected');

  if (status === 'connected') {
    adicionarAoLog("Conexão estabelecida com sucesso!", "connect");
  } else if (status === 'disconnected') {
    adicionarAoLog("Conexão perdida.", "connect");
  } else if (status === 'error') {
    adicionarAoLog("Erro de rede: " + mensagemErro, "error");
  }
});
