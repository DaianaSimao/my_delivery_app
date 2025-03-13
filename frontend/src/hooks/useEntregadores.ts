import { useState, useEffect } from 'react';
import api from '../services/api';

const useEntregadores = () => {
  const [entregador, setEntregadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntregadores = async () => {
      try {
        const response = await api.get('/api/v1/entregadores');
        setEntregadores(response.data);
      } catch (err) {
        console.error('Erro ao buscar entregas:', err);
        setError('Erro ao carregar entregas');
      } finally {
        setLoading(false);
      }
    };

    fetchEntregadores();
  }, []);

  return { entregador, loading, error };
};

export default useEntregadores;