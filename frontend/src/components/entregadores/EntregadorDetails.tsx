import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

interface Entregador {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  veiculo: string;
  placa: string;
  ativo: boolean;
  resturante_id: number;
}

const EntregadorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [entregador, setEntregador] = useState<Entregador | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await api.get(`/api/v1/entregadores/${id}`);
        setEntregador(response.data);
      } catch (error) {
        console.error("Erro ao carregar entregador:", error);
        toast.error("Erro ao carregar entregador.");
      }
    };

    fetchProduto();
  }, [id]);

  if (!entregador) {
    return <div>Carregando...</div>;
  }

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">{entregador.nome}</h2>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <div className="sm:col-span-2">
            <p className="text-gray-700 dark:text-gray-300">Telefone: {entregador.telefone}</p>
          </div>
          <div className="w-full">
            <p className="text-gray-900 dark:text-white">Veiculo: {entregador.veiculo}</p>
          </div>
          <div className="w-full">
            <p className="text-gray-900 dark:text-white">Placa: {entregador.placa}</p>
          </div>
          <div className="w-full">
            <p className="text-gray-900 dark:text-white">
              Disponível: {entregador.ativo ? "Sim" : "Não"}
            </p>
          </div>
        </div>
        <div className="flex gap-4 mt-4 sm:mt-6">
          <button
            type="button"
            onClick={() => navigate("/entregadores")}
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-red-700 rounded-lg focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 hover:bg-red-800"
          >
            Voltar
          </button>
        </div>
      </div>
    </section>
  );
};

export default EntregadorDetail;