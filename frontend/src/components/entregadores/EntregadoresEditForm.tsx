import React, { useState, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Entregador } from "../../types/Entregador";

const EntregadoresEditForm = () => {
  const { id } = useParams<{ id: string }>();
  const [entregador, setEntregador] = useState<Entregador>({
    id: 0,
    nome: "",
    telefone: "",
    veiculo: "",
    placa: "",
    ativo: false,
    restaurante_id: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntregador = async () => {
      try {
        const response = await api.get(`/api/v1/entregadores/${id}`);
        setEntregador(response.data);
      } catch (error) {
        console.error("Erro ao carregar entregador:", error);
        toast.error("Erro ao carregar entregador.");
      }
    };
    fetchEntregador();
  }, [id]);  

  

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
        entregador: {
          nome: entregador.nome,
          telefone: entregador.telefone,
          veiculo: entregador.veiculo,
          placa: entregador.placa,
          ativo: entregador.ativo,
          restaurante_id: entregador.restaurante_id,
        },
      };
  
  
      const response = await api.put(`/api/v1/entregadores/${id}`, payload);
  
      if (response.status === 200) {
        toast.success("Entregador atualizado com sucesso!");
        navigate("/entregadores");
      } else {
        toast.error("Erro ao atualizar entregador.");
      }
    } catch (error: any) {
      console.error("Erro ao atualizar entregador:", error);
      let errorMessage = "Erro ao atualizar entregador. Tente novamente.";
      if (error.response) {
        errorMessage = error.response.data?.error || error.response.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    }
  };

  const handleEntregadoresClick = () => {
    navigate("/entregadores");
  };

  return (
    <section className="bg-white dark:bg-gray-900 mt-8">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Editar Entregador</h2>
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
                placeholder="Nome do Produto"
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
                placeholder="Telefone do entregador"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="veiculo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Veiculo</label>
              <input
                id="veiculo"
                name="veiculo"
                value={entregador.veiculo}
                onChange={handleChange}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Descrição do Produto"
              />
            </div>
            <div className="w-full">
              <label htmlFor="placa" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Placa</label>
              <input
                type="text"
                name="placa"
                id="placa"
                value={entregador.placa}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Placa do veiculo"
                required
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
          </div>
          <div className="flex gap-4 mt-4 sm:mt-6">
            <button
              type="submit"
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-green-700 rounded-lg focus:ring-4 focus:ring-green-200 dark:focus:ring-primary-900 hover:bg-green-800"
            >
              Atualizar Entregador
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

export default EntregadoresEditForm;