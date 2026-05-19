/**
 * Validações de campos do formulário.
 */

import { GBTPRequest } from './protocol';

/**
 * Verifica se os dados da transação estão corretos antes de enviar.
 * Retorna uma string com o erro, ou uma string vazia "" se estiver tudo OK.
 */
export function validarDados(req: GBTPRequest): string {
  
  // 1. Validar conta de origem (sempre obrigatória)
  if (req.accountId === "") {
    return "O número da conta de origem é obrigatório.";
  }

  // 2. Validar se é número
  if (isNaN(Number(req.accountId))) {
    return "A conta deve conter apenas números.";
  }

  // 3. Validar transferência
  if (req.operation === "TRANSFER") {
    if (req.toAccountId === "") {
      return "Informe a conta de destino.";
    }
    if (req.accountId === req.toAccountId) {
      return "As contas de origem e destino devem ser diferentes.";
    }
  }

  // 4. Validar valor (exceto para consulta de saldo)
  if (req.operation !== "BALANCE") {
    if (req.value <= 0) {
      return "O valor deve ser maior que zero.";
    }
  }

  // Se chegou aqui, está tudo certo!
  return "";
}
