import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import restauranteIcon from "/icons/restaurante.svg";

interface Endereco {
  id: number;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

interface Restaurante {
  id: number;
  nome: string;
  descricao: string;
  categoria: string;
  taxa_entrega: number;
  tempo_medio_entrega: string;
  avaliacao: number;
  ativo: boolean;
  abertura: string;
  fechamento: string;
  cnpj: string;
  telefone: string;
  email: string;
  endereco: Endereco;
  created_at?: string;
  updated_at?: string;
}

// Função para formatar o horário (ISO 8601 -> HH:mm)
const formatTime = (isoString: string): string => {
  const date = new Date(isoString);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const RestauranteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurante, setRestaurante] = useState<Restaurante | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurante = async () => {
      try {
        const response = await api.get(`/api/v1/restaurantes/${id}`);
        console.log("Dados do restaurante:", response.data.data);
        setRestaurante(response.data.data);
      } catch (error) {
        console.error("Erro ao carregar restaurante:", error);
        toast.error("Erro ao carregar restaurante.");
      }
    };

    fetchRestaurante();
  }, [id]);

  if (!restaurante) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <section className="bg-white dark:bg-gray-900 mt-10">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          <img
            src={restauranteIcon}
            alt={restaurante.nome}
            className="h-8 w-auto mr-3"
          />
          {restaurante.nome}</h2>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          {/* Informações Básicas */}
          <div className="sm:col-span-2">
            <p className="text-gray-700 dark:text-gray-300">{restaurante.descricao}</p>
          </div>
          <div className="w-full">
            <p className="text-gray-900 dark:text-white">Categoria: {restaurante.categoria}</p>
          </div>
          <div className="w-full">
            <p className="text-gray-900 dark:text-white">Taxa de Entrega: R$ {restaurante.taxa_entrega}</p>
          </div>
          <div className="w-full">
            <p className="text-gray-900 dark:text-white">Tempo Médio de Entrega: {restaurante.tempo_medio_entrega}</p>
          </div>
          <div className="w-full">
            <p className="text-gray-900 dark:text-white">Avaliação: {restaurante.avaliacao}</p>
          </div>
          <div className="w-full">
            <p className="text-gray-900 dark:text-white">
              Status: {restaurante.ativo ? "Ativo" : "Inativo"}
            </p>
          </div>
          <div className="w-full">
            <p className="text-gray-900 dark:text-white">
              Horário de Abertura: {formatTime(restaurante.abertura)} {/* Formata o horário */}
            </p>
          </div>
          <div className="w-full">
            <p className="text-gray-900 dark:text-white">
              Horário de Fechamento: {formatTime(restaurante.fechamento)} {/* Formata o horário */}
            </p>
          </div>
          <div className="w-full">
            <p className="text-gray-900 dark:text-white">CNPJ: {restaurante.cnpj}</p>
          </div>
          <div className="w-full">
            <p className="text-gray-900 dark:text-white">Telefone: {restaurante.telefone}</p>
          </div>
          <div className="w-full">
            <p className="text-gray-900 dark:text-white">Email: {restaurante.email}</p>
          </div>

          {/* Endereço */}
          <div className="sm:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Endereço</h3>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-900 dark:text-white">Rua: {restaurante.endereco.rua}</p>
              <p className="text-gray-900 dark:text-white">Número: {restaurante.endereco.numero}</p>
              <p className="text-gray-900 dark:text-white">Complemento: {restaurante.endereco.complemento}</p>
              <p className="text-gray-900 dark:text-white">Bairro: {restaurante.endereco.bairro}</p>
              <p className="text-gray-900 dark:text-white">Cidade: {restaurante.endereco.cidade}</p>
              <p className="text-gray-900 dark:text-white">Estado: {restaurante.endereco.estado}</p>
              <p className="text-gray-900 dark:text-white">CEP: {restaurante.endereco.cep}</p>
            </div>
          </div>
        </div>

        {/* Botão Voltar */}
        <div className="flex gap-4 mt-4 sm:mt-6">
          <button
            type="button"
            onClick={() => navigate("/restaurantes")}
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-red-700 rounded-lg focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 hover:bg-red-800"
          >
            Voltar
          </button>
        </div>
      </div>
    </section>
  );
};

export default RestauranteDetail;