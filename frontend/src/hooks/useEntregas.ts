import { useState, useEffect } from 'react';
import api from '../services/api';

const useEntregas = () => {
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntregas = async () => {
      try {
        const response = await api.get('/api/v1/entregas');
        setEntregas(response.data);
      } catch (err) {
        console.error('Erro ao buscar entregas:', err);
        setError('Erro ao carregar entregas');
      } finally {
        setLoading(false);
      }
    };

    fetchEntregas();
  }, []);

  return { entregas, loading, error };
};

export default useEntregas;
