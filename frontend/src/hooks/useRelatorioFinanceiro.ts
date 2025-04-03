import { useState, useEffect, useCallback } from 'react';
import { RelatorioFinanceiro } from '../types/RelatorioFinanceiro';
import { CategoriasDespesa } from '../types/CategoriasDespesa';
import api from '../services/api';

interface UseRelatorioFinanceiroReturn {
  relatorio: RelatorioFinanceiro | null;
  loading: boolean;
  dataInicio: string;
  dataFim: string;
  categorias: CategoriasDespesa[];
  categoriaSelecionada: string;
  periodo: number;
  setDataInicio: (data: string) => void;
  setDataFim: (data: string) => void;
  setCategoriaSelecionada: (categoria: string) => void;
  handlePeriodoChange: (novoPeriodo: number) => void;
  fetchRelatorio: () => Promise<void>;
}

export const useRelatorioFinanceiro = (): UseRelatorioFinanceiroReturn => {
  const [relatorio, setRelatorio] = useState<RelatorioFinanceiro | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataInicio, setDataInicio] = useState<string>(
    new Date(new Date().setDate(1)).toISOString().split('T')[0]
  );
  const [dataFim, setDataFim] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [categorias, setCategorias] = useState<CategoriasDespesa[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('');
  const [periodo, setPeriodo] = useState<number>(30);
  
  const restauranteId = localStorage.getItem('restauranteId');

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get(`/api/v1/restaurantes/${restauranteId}/categorias_despesas/lista`);
        setCategorias(response.data);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    };

    fetchCategorias();
  }, [restauranteId]);

  useEffect(() => {
    fetchRelatorio();
  }, [dataInicio, dataFim, categoriaSelecionada]);
  
  const handlePeriodoChange = useCallback((novoPeriodo: number) => {
    setPeriodo(novoPeriodo);
    
    const hoje = new Date();
    const novaDataFim = hoje.toISOString().split('T')[0];
    
    const novaDataInicio = new Date();
    novaDataInicio.setDate(hoje.getDate() - novoPeriodo);
    
    setDataFim(novaDataFim);
    setDataInicio(novaDataInicio.toISOString().split('T')[0]);
  }, []);

  const fetchRelatorio = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/v1/financeiro/relatorio_entradas_saidas', {
        params: {
          restaurante_id: restauranteId,
          data_inicio: dataInicio,
          data_fim: dataFim,
          categoria_despesa_id: categoriaSelecionada || undefined
        }
      });

      const dadosProcessados = {
        ...response.data,
        dados_diarios: response.data.dados_diarios.map((item: any) => ({
          ...item,
          entradas: Number(item.entradas),
          saidas: Number(item.saidas),
          saldo: Number(item.saldo)
        })),
        totais: {
          entradas: Number(response.data.totais.entradas),
          saidas: Number(response.data.totais.saidas),
          saldo: Number(response.data.totais.saldo)
        }
      };
      
      setRelatorio(dadosProcessados);
    } catch (error) {
      console.error('Erro ao carregar relatório financeiro:', error);
    } finally {
      setLoading(false);
    }
  }, [restauranteId, dataInicio, dataFim, categoriaSelecionada]);

  return {
    relatorio,
    loading,
    dataInicio,
    dataFim,
    categorias,
    categoriaSelecionada,
    periodo,
    setDataInicio,
    setDataFim,
    setCategoriaSelecionada,
    handlePeriodoChange,
    fetchRelatorio
  };
};
