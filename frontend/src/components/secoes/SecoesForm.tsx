import React, { useState, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

interface SecaoCardapio {
  nome: string;
  ordem: number;
  restaurante_id: number;
}

const SecoesForm = () => {
  const { id } = useParams<{ id: string }>(); // Captura o ID da seção (se estiver editando)
  const [secao, setSecao] = useState<SecaoCardapio>({
    nome: "",
    ordem: 0,
    restaurante_id: 1, // Defina o ID do restaurante conforme necessário
  });

  const navigate = useNavigate();

  // Carrega os dados da seção se estiver em modo de edição
  useEffect(() => {
    if (id) {
      const fetchSecao = async () => {
        try {
          const response = await api.get(`/api/v1/secoes_cardapios/${id}`);
          setSecao(response.data);
        } catch (error) {
          console.error("Erro ao carregar seção:", error);
          toast.error("Erro ao carregar seção.");
        }
      };

      fetchSecao();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecao((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        // Modo de edição: atualiza a seção existente
        console.log("Atualizando seção:", secao);
        const response = await api.put(`/api/v1/secoes_cardapios/${id}`, {secao_cardapio: secao} );
        if (response.status === 200) {
          toast.success("Seção atualizada com sucesso!");
          navigate("/secoes"); // Redireciona para a lista de seções
        } else {
          toast.error("Erro ao atualizar seção.");
        }
      } else {
        // Modo de criação: cria uma nova seção
        console.log("Criando seção:", secao);
        const response = await api.post("/api/v1/secoes_cardapios", {secao_cardapio: secao} );

        if (response.status === 201) {
          toast.success("Seção cadastrada com sucesso!");
          navigate("/secoes"); // Redireciona para a lista de seções
        } else {
          toast.error("Erro ao cadastrar seção.");
        }
      }
    } catch (error: any) {
      console.error("Erro ao salvar seção:", error);
      toast.error(error.response?.data?.error || "Erro ao salvar seção.");
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900 mt-8">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          {id ? "Editar Seção" : "Adicionar Seção"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Nome da Seção:
              </label>
              <input
                type="text"
                name="nome"
                id="nome"
                value={secao.nome}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Nome da Seção"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="ordem" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Ordem:
              </label>
              <input
                type="number"
                name="ordem"
                id="ordem"
                value={secao.ordem}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Ordem"
                required
              />
            </div>
          </div>
          <div className="flex gap-4 mt-4 sm:mt-6">
            <button
              type="submit"
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-green-700 rounded-lg focus:ring-4 focus:ring-green-200 dark:focus:ring-primary-900 hover:bg-green-800"
            >
              {id ? "Atualizar Seção" : "Adicionar Seção"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/secoes")}
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

export default SecoesForm;