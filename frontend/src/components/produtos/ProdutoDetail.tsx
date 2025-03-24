import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import sushiIcon from "/icons/sushi.svg";

interface Produto {
  id: number;
  nome: string;
  preco: string;
  descricao: string;
  disponivel: boolean;
  imagem_url: string;
  restaurante_id: number;
  produto_acompanhamentos: {
    id: number;
    acompanhamento: {
      [x: string]: any;
      id: number;
      nome: string;
      item_acompanhamentos: {
        preco: number;
        id: number;
        nome: string;
      }[];
    };
  }[];
  produto_secoes: { // Adicione esta propriedade
    id: number;
    secoes_cardapio: {
      id: number;
      nome: string;
      ordem: number;
    };
  }[];
}

const ProdutoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await api.get(`/api/v1/produtos/${id}`);
        setProduto(response.data.data);
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
        toast.error("Erro ao carregar produto.");
      }
    };

    fetchProduto();
  }, [id]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (!produto) {
    return <div>Carregando...</div>;
  }

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">{produto.nome}</h2>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <div className="sm:col-span-2">
            <img src={produto.imagem_url} alt={produto.nome} className="w-full h-64 object-cover rounded-lg" />
          </div>
          <div className="sm:col-span-2">
            <p className="text-gray-700 dark:text-gray-300">{produto.descricao}</p>
          </div>
          <div className="w-full">
            <p className="text-gray-900 dark:text-white">Preço: {produto.preco}</p>
          </div>
          <div className="w-full">
            <p className="text-gray-900 dark:text-white">
              Disponível: {produto.disponivel ? "Sim" : "Não"}
            </p>
          </div>

          {/* Seções do Cardápio */}
          <div className="sm:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Seções do Cardápio
            </h3>
            {produto.produto_secoes?.length > 0 ? (
              <ul className="space-y-2">
                {produto.produto_secoes.map((ps) => (
                  <li key={ps.id} className="text-gray-700 dark:text-gray-300">
                    {ps.secoes_cardapio.nome} (Ordem: {ps.secoes_cardapio.ordem})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700 dark:text-gray-300">
                Este produto não está associado a nenhuma seção do cardápio.
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <button
              onClick={openModal}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <img
                src={sushiIcon}
                alt="Ícone do restaurante"
                className="h-8 w-auto mr-3 text-4xl"
              />
              Acompanhamentos
            </button>
          </div>
        </div>
        <div className="flex gap-4 mt-4 sm:mt-6">
          <button
            type="button"
            onClick={() => navigate("/produtos")}
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-red-700 rounded-lg focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 hover:bg-red-800"
          >
            Voltar
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Acompanhamentos
            </h3>
            <div className="space-y-4">
              {produto.produto_acompanhamentos?.length > 0 ? (
                produto.produto_acompanhamentos.map((pa) => (
                  <div key={pa.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {pa.acompanhamento?.nome}
                      {pa.acompanhamento?.preco && (
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                          (R$ {pa.acompanhamento.preco})
                        </span>
                      )}
                    </h4>
                    <ul className="mt-2 space-y-2">
                      {pa.acompanhamento?.item_acompanhamentos?.map((item) => (
                        <li key={item.id} className="text-gray-700 dark:text-gray-300">
                          {item.nome}
                          {item.preco && (
                            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                              (R$ {item.preco})
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p className="text-gray-700 dark:text-gray-300">
                  Este produto não possui acompanhamentos.
                </p>
              )}
            </div>
            <button
              onClick={closeModal}
              className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProdutoDetail;