import { useState, useEffect } from 'react';
import api from '../services/api';

interface Entrega {
  id: number;
  status: string;
  pedido_id: number;
  entregador_id?: number;
  entregador?: {
    id: number;
    nome: string;
    telefone: string;
    veiculo: string;
  };
}

const useEntregas = () => {
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntregas = async () => {
      try {
        const response = await api.get('/api/v1/entregas');
        console.log('Resposta da API:', response.data); // Verifique os dados aqui
        if (response.status === 200) {
          setEntregas(response.data);
        } else {
          throw new Error('Erro ao carregar entregas');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEntregas();
  }, []);

  return { entregas, loading, error };
};

export default useEntregas;