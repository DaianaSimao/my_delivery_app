import React, { useState, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Despesa } from "../../types/Despesa";
import { CategoriasDespesa } from "../../types/CategoriasDespesa";

const DespesaForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [despesa, setDespesa] = useState<Despesa>({
    descricao: "",
    valor: 0,
    data: "",
    categorias_despesa_id: 0,
    status: "",
    observacoes: "",
    restaurante_id: 0,
  });
  const [categorias, setCategorias] = useState<CategoriasDespesa[]>([]);
  const [loading, setLoading] = useState(true);
  const restauranteId = localStorage.getItem("restauranteId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get(`/api/v1/restaurantes/${restauranteId}/categorias_despesas/lista`);
        setCategorias(response.data);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
        toast.error("Erro ao carregar categorias.");
      }
    };

    const fetchDespesa = async () => {
      if (id) {
        try {
          const response = await api.get(`/api/v1/restaurantes/${restauranteId}/despesas/${id}`);
          setDespesa(response.data);
        } catch (error) {
          console.error("Erro ao carregar despesa:", error);
          toast.error("Erro ao carregar despesa.");
        }
      }
      setLoading(false);
    };

    fetchCategorias();
    fetchDespesa();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDespesa((prevDespesa) => prevDespesa ? { ...prevDespesa, [name]: value } : prevDespesa);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (despesa) {
        if (id) {
          await api.put(`/api/v1/restaurantes/${restauranteId}/despesas/${id}`, despesa);
          toast.success("Despesa atualizada com sucesso!");
        } else {
          await api.post(`/api/v1/restaurantes/${restauranteId}/despesas`, despesa);
          toast.success("Despesa cadastrada com sucesso!");
        }
        navigate("/despesas");
      }
    } catch (error) {
      console.error("Erro ao salvar despesa:", error);
      toast.error("Erro ao salvar despesa.");
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <section className="bg-white dark:bg-gray-900 mt-8">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          {id ? "Editar Despesa" : "Adicionar Despesa"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label htmlFor="descricao" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Descrição
              </label>
              <input
                type="text"
                name="descricao"
                id="descricao"
                value={despesa?.descricao || ""}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Descrição da Despesa"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="valor" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Valor
              </label>
              <input
                type="number"
                name="valor"
                id="valor"
                value={despesa?.valor}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Valor da Despesa"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="data" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Data
              </label>
              <input
                type="date"
                name="data"
                id="data"
                value={despesa?.data}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Status
              </label>
              <input
                type="text"
                name="status"
                id="status"
                value={despesa?.status}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="observacoes" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Observações
              </label>
              <input
                type="text"
                name="observacoes"
                id="observacoes"
                value={despesa?.observacoes || ""}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="categorias_despesa_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Categoria
              </label>
              <select
                name="categorias_despesa_id"
                id="categorias_despesa_id"
                value={despesa?.categorias_despesa_id}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                required
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-4 mt-4 sm:mt-6">
            <button
              type="submit"
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-green-700 rounded-lg focus:ring-4 focus:ring-green-200 dark:focus:ring-primary-900 hover:bg-green-800"
            >
              {id ? "Atualizar Despesa" : "Adicionar Despesa"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/despesas")}
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

export default DespesaForm;