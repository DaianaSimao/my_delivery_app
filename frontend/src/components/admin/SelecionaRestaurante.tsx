"use client";

import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/useAuth";
import toast from "react-hot-toast";
import { Label, Select } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { Restaurante } from "../../types/Restaurante";

const SelecionaRestaurante: React.FC = () => {
  const { restauranteId, switchRestaurant } = useAuth();
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurantes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/api/v1/restaurantes_ativos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRestaurantes(response.data);
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
      switchRestaurant(novoRestauranteId);
      toast.success("Restaurante alterado com sucesso!");
      navigate("/bem_vindo");
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
            {restaurante?.nome}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default SelecionaRestaurante;