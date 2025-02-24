import React, { useState, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

interface Produto {
  nome: string;
  preco: string;
  descricao: string;
  disponivel: boolean;
  imagem_url: string;
  restaurante_id: number;
  acompanhamentos_selecionados: number[]; // IDs dos acompanhamentos selecionados
}

interface Acompanhamento {
  id: number;
  nome: string;
}

const ProdutosEditForm = () => {
  const { id } = useParams<{ id: string }>(); // Captura o ID do produto da URL
  const [produto, setProduto] = useState<Produto>({
    nome: "",
    preco: "",
    descricao: "",
    disponivel: true,
    imagem_url: "",
    restaurante_id: 1,
    acompanhamentos_selecionados: [],
  });

  const [acompanhamentos, setAcompanhamentos] = useState<Acompanhamento[]>([]);
  const navigate = useNavigate();

  // Carrega os dados do produto e a lista de acompanhamentos disponíveis
  useEffect(() => {
    const fetchProdutoEAcompanhamentos = async () => {
      try {
        // Carrega os dados do produto
        const produtoResponse = await api.get(`/api/v1/produtos/${id}`);
        const produtoData = produtoResponse.data.data;

        // Carrega a lista de acompanhamentos
        const acompanhamentosResponse = await api.get("/api/v1/acompanhamentos");
        setAcompanhamentos(acompanhamentosResponse.data.data);

        // Atualiza o estado com os dados do produto
        setProduto({
          nome: produtoData.nome,
          preco: produtoData.preco,
          descricao: produtoData.descricao,
          disponivel: produtoData.disponivel,
          imagem_url: produtoData.imagem_url,
          restaurante_id: produtoData.restaurante_id,
          acompanhamentos_selecionados: produtoData.produto_acompanhamentos.map(
            (pa: any) => pa.acompanhamento_id
          ),
        });
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados.");
      }
    };

    fetchProdutoEAcompanhamentos();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduto((prevProduto) => ({
      ...prevProduto,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setProduto((prevProduto) => ({
      ...prevProduto,
      [name]: checked,
    }));
  };

  const handleAcompanhamentoChange = (acompanhamentoId: number) => {
    setProduto((prev) => {
      const alreadySelected = prev.acompanhamentos_selecionados.includes(acompanhamentoId);
      return {
        ...prev,
        acompanhamentos_selecionados: alreadySelected
          ? prev.acompanhamentos_selecionados.filter((id) => id !== acompanhamentoId)
          : [...prev.acompanhamentos_selecionados, acompanhamentoId],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = {
        produto: {
          nome: produto.nome,
          preco: produto.preco,
          descricao: produto.descricao,
          disponivel: produto.disponivel,
          imagem_url: produto.imagem_url,
          restaurante_id: produto.restaurante_id,
          produto_acompanhamentos_attributes: produto.acompanhamentos_selecionados.map((id) => ({
            acompanhamento_id: id,
          })),
        },
      };

      // Envia uma requisição PUT para atualizar o produto
      const response = await api.put(`/api/v1/produtos/${id}`, payload);

      if (response.status === 200) {
        toast.success("Produto atualizado com sucesso!");
        navigate("/produtos");
      } else {
        toast.error("Erro ao atualizar produto.");
      }
    } catch (error: any) {
      console.error("Erro ao atualizar produto:", error);

      let errorMessage = "Erro ao atualizar produto. Tente novamente.";
      if (error.response) {
        errorMessage = error.response.data?.error || error.response.data?.message || errorMessage;
      }

      toast.error(errorMessage);
    }
  };

  const handleProdutosClick = () => {
    navigate("/produtos");
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Editar Produto</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome:</label>
              <input
                type="text"
                name="nome"
                id="nome"
                value={produto.nome}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Nome do Produto"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="preco" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Preço</label>
              <input
                type="text"
                name="preco"
                id="preco"
                value={produto.preco}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Preço do Produto"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="descricao" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descrição</label>
              <textarea
                id="descricao"
                name="descricao"
                rows={8}
                value={produto.descricao}
                onChange={handleChange}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Descrição do Produto"
              />
            </div>
            <div className="w-full">
              <label htmlFor="imagem_url" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">URL da Imagem</label>
              <input
                type="text"
                name="imagem_url"
                id="imagem_url"
                value={produto.imagem_url}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="URL da Imagem"
                required
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="disponivel"
                id="disponivel"
                checked={produto.disponivel}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="disponivel" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Disponível</label>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="acompanhamentos" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Acompanhamentos
              </label>
              <div className="grid grid-cols-2 gap-4">
                {acompanhamentos.map((acompanhamento) => (
                  <div key={acompanhamento.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`acompanhamento-${acompanhamento.id}`}
                      checked={produto.acompanhamentos_selecionados.includes(acompanhamento.id)}
                      onChange={() => handleAcompanhamentoChange(acompanhamento.id)}
                      className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor={`acompanhamento-${acompanhamento.id}`}
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      {acompanhamento.nome}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-4 sm:mt-6">
            <button
              type="submit"
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-green-700 rounded-lg focus:ring-4 focus:ring-green-200 dark:focus:ring-primary-900 hover:bg-green-800"
            >
              Atualizar Produto
            </button>
            <button
              type="button"
              onClick={handleProdutosClick}
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

export default ProdutosEditForm;