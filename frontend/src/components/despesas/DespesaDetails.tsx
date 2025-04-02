import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Despesa } from "../../types/Despesa";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const DespesaDetails: React.FC = () => {
  const restauranteId = localStorage.getItem("restauranteId");
  const { id } = useParams<{ id: string }>();
  const [despesa, setDespesa] = useState<Despesa | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchDespesa = async () => {
      try {
        const response = await api.get(`/api/v1/restaurantes/${restauranteId}/despesas/${id}`);
        setDespesa(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar despesa:", error);
        setLoading(false);
      }
    };

    fetchDespesa();
  }, [id]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">{despesa?.descricao}</h2>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <div className="sm:col-span-2">
            <p className="text-gray-700 dark:text-gray-300">Valor: {despesa?.valor}</p>
          </div>
          <div className="w-full">
            <p className="text-gray-900 dark:text-white">Data: {despesa?.data}</p>
          </div>
          <div className="w-full">
            <p className="text-gray-900 dark:text-white">Status: {despesa?.status ? "Pago" : "Pendente"}</p>
          </div>
          <div className="w-full">
            <p className="text-gray-900 dark:text-white">Observações: {despesa?.observacoes}</p>
          </div>
          <div className="w-full">
            <p className="text-gray-900 dark:text-white">
              Categoria: {despesa?.categorias_despesa_id}
            </p>
          </div>
        </div>
        <div className="flex gap-4 mt-4 sm:mt-6">
          <button
            type="button"
            onClick={() => navigate("/despesas")}
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-red-700 rounded-lg focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 hover:bg-red-800"
          >
            Voltar
          </button>
        </div>
      </div>
    </section>
  );
};

export default DespesaDetails;