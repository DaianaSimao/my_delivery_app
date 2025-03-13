import React, { useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface Entregador {
  nome: string;
  telefone: string;
  veiculo: string;
  placa: string;
  ativo: boolean;
  restaurante_id: number;
}

const EntregadoresForm = () => {
  const restauranteId = Number(localStorage.getItem("restaurante_id"));
  const [entregador, setEntregador] = useState<Entregador>({
    nome: "",
    telefone: "",
    veiculo: "",
    placa: "",
    ativo: true,
    restaurante_id: restauranteId,
  });


  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEntregador((prevEntregador) => ({
      ...prevEntregador,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEntregador((prevEntregador) => ({
      ...prevEntregador,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = {
        nome: entregador.nome,
        telefone: entregador.telefone,
        veiculo: entregador.veiculo,
        placa: entregador.placa,
        ativo: entregador.ativo,
        restaurante_id: entregador.restaurante_id,
      };
      const response = await api.post("/api/v1/entregadores", payload);

      if (response.status === 201) {
        toast.success("Entregador cadastrado com sucesso!");
        navigate("/entregadores");
        setEntregador({
          nome: "",
          telefone: "",
          veiculo: "",
          placa: "",
          ativo: true,
          restaurante_id: restauranteId,
        });
      } else {
        toast.error("Erro ao cadastrar entregador.");
      }
    } catch (error: any) {
      console.error("Erro ao cadastrar entregador:", error);

      let errorMessage = "Erro ao cadastrar entregador. Tente novamente.";
      if (error.response) {
        errorMessage = error.response.data?.error || error.response.data?.message || errorMessage;
      }

      toast.error(errorMessage);
    }
  };

  const handleEntregadoresClick = () => {
    navigate("/entregadoress");
  };

  return (
    <section className="bg-white dark:bg-gray-900 mt-8">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Adicionar Entregador</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome:</label>
              <input
                type="text"
                name="nome"
                id="nome"
                value={entregador.nome}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Nome do Entregador"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="telefone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Telefone</label>
              <input
                type="text"
                name="telefone"
                id="telefone"
                value={entregador.telefone}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Telefone"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="veiculo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Veiculo</label>
              <input
                id="veiculo"
                name="veiculo"
                value={entregador.veiculo}
                onChange={handleChange}
                className="block p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Veiculo"
              />
            </div>
            <div className="w-full">
              <label htmlFor="placa" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Placa</label>
              <input
                id="palca"
                name="placa"
                value={entregador.placa}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Placa"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="ativo"
                id="ativo"
                checked={entregador.ativo}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="ativo" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Ativo</label>
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-green-700 rounded-lg focus:ring-4 focus:ring-green-200 dark:focus:ring-primary-900 hover:bg-green-800"
            >
              Adicionar Entregador
            </button>
            <button
              type="button"
              onClick={handleEntregadoresClick}
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

export default EntregadoresForm;