import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { Promocao } from "../../types/Promocao";
import { Produto } from "../../types/Produto";
import toast from "react-hot-toast";

const PromocaoForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [promocao, setPromocao] = useState<Promocao>({
    id: 0,
    nome: "",
    descricao: "",
    tipo: "de_para",
    valor_de: 0,
    valor_para: 0,
    desconto_percentual: 0,
    data_inicio: "",
    data_fim: "",
    ativa: true,
    produto_ids: [],
  });
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const produtosResponse = await api.get("/api/v1/produtos");
        setProdutos(produtosResponse.data.data);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    };
  
    const fetchPromocao = async () => {
      try {
        const promocaoResponse = await api.get(`/api/v1/promocoes/${id}`);
        const data = promocaoResponse.data;
  
        // Mapear os dados da API para o estado promocao
        setPromocao({
          id: data.id || 0,
          nome: data.nome || "",
          descricao: data.descricao || "",
          tipo: data.tipo || "de_para",
          valor_de: parseFloat(data.valor_de) || 0, // Converter string para número
          valor_para: parseFloat(data.valor_para) || 0, // Converter string para número
          desconto_percentual: parseFloat(data.desconto_percentual) || 0, // Converter string para número
          data_inicio: data.data_inicio || "",
          data_fim: data.data_fim || "",
          ativa: data.ativa !== undefined ? data.ativa : true,
          produto_ids: data.produtos ? data.produtos.map((produto: Produto) => produto.id) : [], // Mapear produtos para IDs
        });
      } catch (error) {
        console.error("Erro ao carregar promoção:", error);
      }
    };
  
    fetchProdutos().then(() => {
      if (id) {
        fetchPromocao();
      }
    });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPromocao((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProdutoChange = (produtoId: number) => {
    setPromocao((prev) => {
      const alreadySelected = prev.produto_ids?.includes(produtoId);
      return {
        ...prev,
        produto_ids: alreadySelected
          ? prev.produto_ids?.filter((id) => id !== produtoId) // Remove o produto se já estiver selecionado
          : [...(prev.produto_ids || []), produtoId], // Adiciona o produto se não estiver selecionado
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const payload = {
      promocao: {
        nome: promocao.nome,
        descricao: promocao.descricao,
        tipo: promocao.tipo,
        valor_de: promocao.valor_de,
        valor_para: promocao.valor_para,
        desconto_percentual: promocao.desconto_percentual,
        data_inicio: promocao.data_inicio,
        data_fim: promocao.data_fim,
        ativa: promocao.ativa,
        produto_ids: promocao.produto_ids, // IDs dos produtos selecionados
      },
    };
  
    try {
      if (id) {
        await api.put(`/api/v1/promocoes/${id}`, payload);
        toast.success("Promoção atualizada com sucesso!");
      } else {
        await api.post("/api/v1/promocoes", payload);
        toast.success("Promoção criada com sucesso!");
      }
      navigate("/promocoes");
    } catch (error) {
      console.error("Erro ao salvar promoção:", error);
      toast.error("Erro ao salvar promoção. Tente novamente.");
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900 mt-8">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          {id ? "Editar Promoção" : "Adicionar Promoção"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Nome:
              </label>
              <input
                type="text"
                name="nome"
                id="nome"
                value={promocao.nome}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Nome da Promoção"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="descricao" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Descrição:
              </label>
              <textarea
                id="descricao"
                name="descricao"
                rows={4}
                value={promocao.descricao}
                onChange={handleChange}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Descrição da Promoção"
              />
            </div>
            <div className="w-full">
              <label htmlFor="tipo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Tipo:
              </label>
              <select
                name="tipo"
                id="tipo"
                value={promocao.tipo}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              >
                <option value="de_para">De/Para</option>
                <option value="desconto_percentual">Desconto Percentual</option>
              </select>
            </div>
            {promocao.tipo === 'de_para' && (
              <>
                <div className="w-full">
                  <label htmlFor="valor_de" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Valor De:
                  </label>
                  <input
                    type="number"
                    name="valor_de"
                    id="valor_de"
                    value={promocao.valor_de}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Valor De"
                  />
                </div>
                <div className="w-full">
                  <label htmlFor="valor_para" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Valor Para:
                  </label>
                  <input
                    type="number"
                    name="valor_para"
                    id="valor_para"
                    value={promocao.valor_para}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Valor Para"
                  />
                </div>
              </>
            )}
            {promocao.tipo === 'desconto_percentual' && (
              <div className="w-full">
                <label htmlFor="desconto_percentual" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Desconto Percentual:
                </label>
                <input
                  type="number"
                  name="desconto_percentual"
                  id="desconto_percentual"
                  value={promocao.desconto_percentual}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Desconto Percentual"
                />
              </div>
            )}
            <div className="sm:col-span-2">
              <label htmlFor="produto_ids" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Produtos:
              </label>
              <div className="grid grid-cols-2 gap-4">
                {produtos.map((produto) => (
                  <div key={produto.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`produto-${produto.id}`}
                      checked={promocao.produto_ids?.includes(produto.id)}
                      onChange={() => handleProdutoChange(produto.id)}
                      className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor={`produto-${produto.id}`}
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      {produto.nome}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full">
              <label htmlFor="data_inicio" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Data Início:
              </label>
              <input
                type="date"
                name="data_inicio"
                id="data_inicio"
                value={promocao.data_inicio}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="data_fim" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Data Fim:
              </label>
              <input
                type="date"
                name="data_fim"
                id="data_fim"
                value={promocao.data_fim}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                required
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="ativa"
                id="ativa"
                checked={promocao.ativa}
                onChange={(e) => setPromocao((prev) => ({ ...prev, ativa: e.target.checked }))}
                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="ativa" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Ativa
              </label>
            </div>
          </div>
          <div className="flex gap-4 mt-4 sm:mt-6">
            <button
              type="submit"
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-green-700 rounded-lg focus:ring-4 focus:ring-green-200 dark:focus:ring-primary-900 hover:bg-green-800"
            >
              {id ? "Atualizar Promoção" : "Adicionar Promoção"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/promocoes")}
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

export default PromocaoForm;