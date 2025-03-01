// src/components/SelecionaRestaurante.tsx
"use client"; // Adicione esta linha no topo do arquivo

import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/useAuth";
import toast from "react-hot-toast";
import { Label, Select } from "flowbite-react"; // Importe os componentes do Flowbite
import { useNavigate } from "react-router-dom";

interface Restaurante {
  attributes: any;
  id: string;
  nome: string;
  descricao: string;
  endereco: string;
  telefone: string;
  created_at: string;
  updated_at: string;
}

const SelecionaRestaurante: React.FC = () => {
  const { restauranteId, switchRestaurant } = useAuth();
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Busca os restaurantes associados ao usuário
    const fetchRestaurantes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/api/v1/restaurantes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Ajuste aqui: A API retorna um objeto com a propriedade `data`
        setRestaurantes(response.data.data);
      } catch (error) {
        console.error("Erro ao buscar restaurantes:", error);
        toast.error("Erro ao carregar restaurantes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurantes();
  }, []);

  const { carregarPedidos, carregarProdutos, carregarEntregas } = useAuth();

  const handleSwitchRestaurante = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const novoRestauranteId = event.target.value;
    if (!novoRestauranteId) return;
  
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/api/v1/switch_restaurant",
        { restaurante_id: novoRestauranteId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      switchRestaurant(novoRestauranteId); // Atualiza o restauranteId no contexto
      toast.success("Restaurante alterado com sucesso!");
      navigate("/bem_vindo"); // Redireciona para a página inicial do admin
      // Recarrega os dados após trocar de restaurante
      await carregarPedidos();
      await carregarProdutos();
      await carregarEntregas();
    } catch (error) {
      console.error("Erro ao trocar de restaurante:", error);
      toast.error("Erro ao trocar de restaurante.");
    }
  };

  if (isLoading) {
    return <div>Carregando restaurantes...</div>;
  }

  return (
    <div className="max-w-md">
      <div className="mb-2 block text-gray-800 dark:text-white">
        <Label htmlFor="restaurantes" value="Selecione um restaurante" />
      </div>
      <Select id="restaurantes" value={restauranteId || ""} onChange={handleSwitchRestaurante} required>
        <option value="" disabled>
          Selecione um restaurante
        </option>
        {restaurantes.map((restaurante) => (
          <option className=" text-gray-800 dark:text-gray-200" key={restaurante.id} value={restaurante.id}>
            {restaurante.attributes.nome}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default SelecionaRestaurante;