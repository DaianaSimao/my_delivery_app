export interface Pagamento {
  id: string;
  metodo: "PIX" | "Dinheiro" | "Cartão de Crédito" | "Cartão de Débito";
  status: "Pago" | "Aguardando pagamento";
  valor: number;
  troco: number;
}