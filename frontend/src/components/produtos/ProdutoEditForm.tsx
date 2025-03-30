import React, { useState, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Produto } from "../../types/Produto";
import { Acompanhamento } from "../../types/Acompanhamento";
import { SecaoCardapio } from "../../types/SecaoCardapio";

const ProdutosEditForm = () => {
  const { id } = useParams<{ id: string }>();
  const [produto, setProduto] = useState<Produto>({
    nome: "",
    preco: "",
    descricao: "",
    disponivel: true,
    imagem_url: "",
    restaurante_id: 1,
    acompanhamentos_selecionados: [],
    produto_acompanhamentos: [],
    secoes_selecionadas: [],
    produto_secoes: [],
  });

  const [acompanhamentos, setAcompanhamentos] = useState<Acompanhamento[]>([]);
  const [secoes, setSecoes] = useState<SecaoCardapio[]>([]);
  const navigate = useNavigate();

  // Carrega os dados do produto, acompanhamentos e seções
  useEffect(() => {
    const fetchProdutoEAcompanhamentos = async () => {
      try {
        // Carrega os dados do produto
        const produtoResponse = await api.get(`/api/v1/produtos/${id}`);
        const produtoData = produtoResponse.data.data;
        // Carrega a lista de acompanhamentos
        const acompanhamentosResponse = await api.get("/api/v1/acompanhamentos");
        setAcompanhamentos(acompanhamentosResponse.data.data);

        // Carrega a lista de seções
        const secoesResponse = await api.get("/api/v1/secoes_cardapios");
        setSecoes(secoesResponse.data.data);

        // Atualiza o estado com os dados do produto
        setProduto({
          nome: produtoData.nome,
          preco: produtoData.preco,
          descricao: produtoData.descricao,
          disponivel: produtoData.disponivel,
          imagem_url: produtoData.imagem_url,
          restaurante_id: produtoData.restaurante_id,
          acompanhamentos_selecionados: produtoData.produto_acompanhamentos?.map(
            (pa: any) => pa.acompanhamento_id
          ) || [],
          produto_acompanhamentos: produtoData.produto_acompanhamentos?.map((pa: any) => ({
            id: pa.id,
            acompanhamento_id: pa.acompanhamento_id,
          })) || [],
          secoes_selecionadas: produtoData.produto_secoes?.map((ps: any) => ps.secoes_cardapio_id) || [],
          produto_secoes: produtoData.produto_secoes || [],
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

  const handleSecaoChange = (secaoId: number) => {
    setProduto((prev) => {
      const alreadySelected = prev.secoes_selecionadas.includes(secaoId);
      return {
        ...prev,
        secoes_selecionadas: alreadySelected
          ? prev.secoes_selecionadas.filter((id) => id !== secaoId)
          : [...prev.secoes_selecionadas, secaoId],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // 1. Acompanhamentos que permanecem (selecionados ou novos)
      const selectedAttributes = produto.acompanhamentos_selecionados.map((acompanhamentoId) => {
        const produtoAcompanhamentoExistente = produto.produto_acompanhamentos.find(
          (pa) => pa.acompanhamento_id === acompanhamentoId
        );

        return {
          id: produtoAcompanhamentoExistente?.id || null,
          acompanhamento_id: acompanhamentoId,
          _destroy: false,
        };
      });

      // 2. Acompanhamentos que foram removidos
      const removedAttributes = produto.produto_acompanhamentos
        .filter((pa) => !produto.acompanhamentos_selecionados.includes(pa.acompanhamento_id))
        .map((pa) => ({
          id: pa.id,
          acompanhamento_id: pa.acompanhamento_id,
          _destroy: true,
        }));

      // 3. Seções que foram adicionadas (novas)
      const addedSecoes = produto.secoes_selecionadas
        .filter((secaoId) => !produto.produto_secoes.some((ps) => ps.secoes_cardapio.id === secaoId))
        .map((secaoId) => ({
          secoes_cardapio_id: secaoId,
          _destroy: false,
        }));

      // 4. Seções que foram removidas
      const removedSecoes = produto.produto_secoes
        .filter((ps) => !produto.secoes_selecionadas.includes(ps.secoes_cardapio.id))
        .map((ps) => ({
          id: ps.id,
          secoes_cardapio_id: ps.secoes_cardapio.id,
          _destroy: true,
        }));

      // Junta os arrays para enviar todos os atributos
      const produtoAcompanhamentosAttributes = [
        ...selectedAttributes,
        ...removedAttributes,
      ];

      const produtoSecoesAttributes = [
        ...addedSecoes,
        ...removedSecoes,
      ];

      const payload = {
        produto: {
          nome: produto.nome,
          preco: produto.preco,
          descricao: produto.descricao,
          disponivel: produto.disponivel,
          imagem_url: produto.imagem_url,
          restaurante_id: produto.restaurante_id,
          produto_acompanhamentos_attributes: produtoAcompanhamentosAttributes,
          produto_secoes_attributes: produtoSecoesAttributes,
        },
      };

      // Envia a requisição PUT para atualizar o produto
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
    <section className="bg-white dark:bg-gray-900 mt-8">
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
            <div className="sm:col-span-2">
              <label htmlFor="secoes" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Seções do Cardápio
              </label>
              <div className="grid grid-cols-2 gap-4">
                {secoes.map((secao) => (
                  <div key={secao.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`secao-${secao.id}`}
                      checked={produto.secoes_selecionadas.includes(secao.id)}
                      onChange={() => handleSecaoChange(secao.id)}
                      className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor={`secao-${secao.id}`}
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      {secao.nome}
                    </label>
                  </div>
                ))}
              </div>
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
                      checked={acompanhamento.id !== undefined && produto.acompanhamentos_selecionados.includes(acompanhamento.id)}
                      onChange={() => acompanhamento.id !== undefined && handleAcompanhamentoChange(acompanhamento.id)}
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