import React, { useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface Endereco {
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

interface Restaurante {
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
}

const RestauranteForm = () => {
  const [restaurante, setRestaurante] = useState<Restaurante>({
    nome: "",
    descricao: "",
    categoria: "",
    taxa_entrega: 0.0,
    tempo_medio_entrega: "",
    avaliacao: 0.0,
    ativo: true,
    abertura: "",
    fechamento: "",
    cnpj: "",
    telefone: "",
    email: "",
    endereco: {
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
    },
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("endereco.")) {
      // Atualiza campos aninhados de endereço
      const enderecoField = name.split(".")[1]; // Extrai o nome do campo de endereço
      setRestaurante((prevRestaurante) => ({
        ...prevRestaurante,
        endereco: {
          ...prevRestaurante.endereco,
          [enderecoField]: value,
        },
      }));
    } else {
      // Atualiza campos normais do restaurante
      setRestaurante((prevRestaurante) => ({
        ...prevRestaurante,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setRestaurante((prevRestaurante) => ({
      ...prevRestaurante,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = {
        restaurante: {
          ...restaurante,
          taxa_entrega: parseFloat(restaurante.taxa_entrega.toString()),
          avaliacao: parseFloat(restaurante.avaliacao.toString()),
          endereco_attributes: restaurante.endereco, // Use apenas endereco_attributes
        },
      };
  
      const response = await api.post("/api/v1/restaurantes", payload);
  
      if (response.status === 201) {
        toast.success("Restaurante cadastrado com sucesso!");
        navigate("/restaurantes");
        // Resetar o formulário
        setRestaurante({
          nome: "",
          descricao: "",
          categoria: "",
          taxa_entrega: 0.0,
          tempo_medio_entrega: "",
          avaliacao: 0.0,
          ativo: true,
          abertura: "",
          fechamento: "",
          cnpj: "",
          telefone: "",
          email: "",
          endereco: {
            rua: "",
            numero: "",
            complemento: "",
            bairro: "",
            cidade: "",
            estado: "",
            cep: "",
          },
        });
      } else {
        toast.error("Erro ao cadastrar restaurante.");
      }
    } catch (error: any) {
      console.error("Erro ao cadastrar restaurante:", error);
      let errorMessage = "Erro ao cadastrar restaurante. Tente novamente.";
      if (error.response) {
        errorMessage = error.response.data?.error || error.response.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    }
  };

  const handleRestaurantesClick = () => {
    navigate("/restaurantes");
  };

  return (
    <section className="bg-white dark:bg-gray-900 mt-8">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Adicionar Restaurante</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome:</label>
              <input
                type="text"
                name="nome"
                id="nome"
                value={restaurante.nome}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Nome do Restaurante"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="descricao" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descrição</label>
              <textarea
                id="descricao"
                name="descricao"
                rows={4}
                value={restaurante.descricao}
                onChange={handleChange}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Descrição do Restaurante"
              />
            </div>
            <div className="w-full">
              <label htmlFor="categoria" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Categoria</label>
              <input
                type="text"
                name="categoria"
                id="categoria"
                value={restaurante.categoria}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Categoria do Restaurante"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="taxa_entrega" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Taxa de Entrega</label>
              <input
                type="number"
                name="taxa_entrega"
                id="taxa_entrega"
                value={restaurante.taxa_entrega}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Taxa de Entrega"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="tempo_medio_entrega" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tempo Médio de Entrega</label>
              <input
                type="text"
                name="tempo_medio_entrega"
                id="tempo_medio_entrega"
                value={restaurante.tempo_medio_entrega}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Tempo Médio de Entrega"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="avaliacao" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Avaliação</label>
              <input
                type="number"
                name="avaliacao"
                id="avaliacao"
                value={restaurante.avaliacao}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Avaliação"
                required
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="ativo"
                id="ativo"
                checked={restaurante.ativo}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="ativo" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Ativo</label>
            </div>
            <div className="w-full">
              <label htmlFor="abertura" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Horário de Abertura</label>
              <input
                type="time"
                name="abertura"
                id="abertura"
                value={restaurante.abertura}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="fechamento" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Horário de Fechamento</label>
              <input
                type="time"
                name="fechamento"
                id="fechamento"
                value={restaurante.fechamento}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="cnpj" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">CNPJ</label>
              <input
                type="text"
                name="cnpj"
                id="cnpj"
                value={restaurante.cnpj}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="CNPJ"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="telefone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Telefone</label>
              <input
                type="text"
                name="telefone"
                id="telefone"
                value={restaurante.telefone}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Telefone"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={restaurante.email}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Email"
                required
              />
            </div>
            {/* Campos de Endereço */}
            <div className="sm:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Endereço</h3>
            </div>
            <div className="w-full">
              <label htmlFor="endereco.rua" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Logradouro</label>
              <input
                type="text"
                name="endereco.rua"
                id="endereco.rua"
                value={restaurante.endereco.rua}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Logradouro"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="endereco.numero" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Número</label>
              <input
                type="text"
                name="endereco.numero"
                id="endereco.numero"
                value={restaurante.endereco.numero}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Número"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="endereco.complemento" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Complemento</label>
              <input
                type="text"
                name="endereco.complemento"
                id="endereco.complemento"
                value={restaurante.endereco.complemento}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Complemento"
              />
            </div>
            <div className="w-full">
              <label htmlFor="endereco.bairro" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Bairro</label>
              <input
                type="text"
                name="endereco.bairro"
                id="endereco.bairro"
                value={restaurante.endereco.bairro}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Bairro"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="endereco.cidade" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cidade</label>
              <input
                type="text"
                name="endereco.cidade"
                id="endereco.cidade"
                value={restaurante.endereco.cidade}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Cidade"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="endereco.estado" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Estado</label>
              <input
                type="text"
                name="endereco.estado"
                id="endereco.estado"
                value={restaurante.endereco.estado}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Estado"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="endereco.cep" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">CEP</label>
              <input
                type="text"
                name="endereco.cep"
                id="endereco.cep"
                value={restaurante.endereco.cep}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="CEP"
                required
              />
            </div>
          </div>
          <div className="flex gap-4 mt-4 sm:mt-6">
            <button
              type="submit"
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-green-700 rounded-lg focus:ring-4 focus:ring-green-200 dark:focus:ring-primary-900 hover:bg-green-800"
            >
              Adicionar Restaurante
            </button>
            <button
              type="button"
              onClick={handleRestaurantesClick}
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-red-700 rounded-lg focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 hover:bg-red-800"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default RestauranteForm;