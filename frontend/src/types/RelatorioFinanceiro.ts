export interface DadosDiarios {
  data: string;
  entradas: number;
  saidas: number;
  saldo: number;
}

export interface RelatorioFinanceiro {
  periodo: {
    data_inicio: string;
    data_fim: string;
  };
  totais: {
    entradas: number;
    saidas: number;
    saldo: number;
  };
  despesas_por_categoria: Record<string, number>;
  dados_diarios: DadosDiarios[];
}
