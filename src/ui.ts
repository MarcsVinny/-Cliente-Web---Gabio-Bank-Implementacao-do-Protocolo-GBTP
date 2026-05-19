/**
 * Manipulação do DOM e interface.
 */

import { GBTPResponse, Operation } from './protocol';

/**
 * Mostra a resposta do banco na tela.
 */
export function atualizarPainelResposta(res: GBTPResponse): void {
  const painel = document.getElementById('response-display')!;
  
  // Escolhemos se o status é sucesso ou erro para a cor
  const classeStatus = (res.status === 'OK') ? 'ok' : 'error';
  const icone = (res.status === 'OK') ? '✓' : '✕';

  painel.innerHTML = `
    <div class="response-result">
      <div class="response-status ${classeStatus}">
        ${icone} ${res.status}
      </div>
      <div class="response-field">
        <div class="response-field-label">Mensagem:</div>
        <div class="response-field-value">${res.message}</div>
      </div>
      <div class="response-field">
        <div class="response-field-label">Saldo Atual:</div>
        <div class="response-balance">R$ ${Number(res.balance).toFixed(2)}</div>
      </div>
    </div>
  `;
}

/**
 * Escreve uma mensagem no log (terminalzinho de baixo).
 */
export function adicionarAoLog(texto: string, tipo: string = 'info'): void {
  const terminal = document.getElementById('log-terminal')!;
  const agora = new Date();
  const hora = agora.getHours() + ":" + agora.getMinutes() + ":" + agora.getSeconds();

  const p = document.createElement('p');
  p.className = "log-entry log-" + tipo;
  p.textContent = "[" + hora + "] " + texto;

  terminal.appendChild(p);
  terminal.scrollTop = terminal.scrollHeight; // Rola para baixo sozinho
}

/**
 * Muda a cor da bolinha de status.
 */
export function atualizarStatusConexao(status: string): void {
  const bolinha = document.getElementById('status-dot')!;
  const textoStatus = document.getElementById('status-text')!;
  const botao = document.getElementById('btn-connect') as HTMLButtonElement;

  bolinha.className = 'status-dot'; // Reseta as cores

  if (status === 'connected') {
    bolinha.classList.add('connected');
    textoStatus.textContent = 'Conectado';
    botao.textContent = 'Desconectar';
  } else if (status === 'error') {
    bolinha.classList.add('error');
    textoStatus.textContent = 'Erro';
    botao.textContent = 'Tentar de novo';
  } else {
    textoStatus.textContent = 'Desconectado';
    botao.textContent = 'Conectar';
  }
}

/**
 * Esconde ou mostra campos dependendo da operação (ex: TRANSFER precisa de destino).
 */
export function ajustarCamposDaTela(operacao: Operation): void {
  const grupoDestino = document.getElementById('to-account-group')!;
  const grupoValor = document.getElementById('value-group')!;

  // Se for transferência, mostra conta destino
  if (operacao === 'TRANSFER') {
    grupoDestino.style.display = 'block';
  } else {
    grupoDestino.style.display = 'none';
  }

  // Se for saldo, não precisa de valor
  if (operacao === 'BALANCE') {
    grupoValor.style.display = 'none';
  } else {
    grupoValor.style.display = 'block';
  }
}

/**
 * Mostra mensagem de erro no formulário.
 */
export function mostrarErroFormulario(msg: string): void {
  const divErro = document.getElementById('form-error')!;
  divErro.textContent = msg;
}
