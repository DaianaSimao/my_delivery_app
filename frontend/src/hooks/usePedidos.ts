// src/hooks/usePedidos.ts
import { useState, useEffect } from 'react';
import api from '../services/api';
import { Pedido } from '../types/Pedido';

const usePedidos = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await api.get('/api/v1/pedidos');
        setPedidos(response.data.data);
      } catch (err) {
        setError('Erro ao carregar pedidos');
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  return { pedidos, loading, error };
};

export default usePedidos;