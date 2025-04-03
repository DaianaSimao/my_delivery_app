import React, { useState, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { CategoriasDespesa } from "../../types/CategoriasDespesa";

const CategoriaDespesaForm: React.FC = () => {
  const restauranteId = localStorage.getItem("restauranteId");
  const { id } = useParams<{ id: string }>();
  const [categoria, setCategoria] = useState<CategoriasDespesa>({
    nome: "",
    descricao: "",
    ativo: true,
    restaurante_id: Number(restauranteId)
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoria = async () => {
      if (id) {
        try {
          const response = await api.get(`/api/v1/restaurantes/${restauranteId}/categorias_despesas/${id}`);
          setCategoria(response.data);
        } catch (error) {
          console.error("Erro ao carregar categoria:", error);
          toast.error("Erro ao carregar categoria.");
        }
      }
      setLoading(false);
    };

    fetchCategoria();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategoria((prevCategoria) => ({ ...prevCategoria, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/api/v1/restaurantes/${restauranteId}/categorias_despesas/${id}`, categoria);
        toast.success("Categoria atualizada com sucesso!");
      } else {
        await api.post(`/api/v1/restaurantes/${restauranteId}/categorias_despesas`, categoria);
        toast.success("Categoria cadastrada com sucesso!");
      }
      navigate("/categorias_despesas");
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
      toast.error("Erro ao salvar categoria.");
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <section className="bg-white dark:bg-gray-900 mt-8">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          {id ? "Editar Categoria" : "Adicionar Categoria"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label htmlFor="nome" className=" mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Nome
              </label>
              <input
                type="text"
                name="nome"
                id="nome"
                value={categoria.nome}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Nome da Categoria"
                required
              />
            </div>
          </div>
          <div className="flex gap-4 mt-4 sm:mt-6">
            <button
              type="submit"
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-green-700 rounded-lg focus:ring-4 focus:ring-green-200 dark:focus:ring-primary-900 hover:bg-green-800"
            >
              {id ? "Atualizar Categoria" : "Adicionar Categoria"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/categorias_despesas")}
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

export default CategoriaDespesaForm; 