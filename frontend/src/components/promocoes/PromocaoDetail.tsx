import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Promocao } from "../../types/Promocao";
import toast from "react-hot-toast";

const PromocaoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [promocao, setPromocao] = useState<Promocao | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPromocao = async () => {
      try {
        const response = await api.get(`/api/v1/promocoes/${id}`);
        console.log(response);
        setPromocao(response.data);
      } catch (error) {
        console.error("Erro ao carregar promoção:", error);
        toast.error("Erro ao carregar promoção.");
      }
    };
    fetchPromocao();
  }, [id]);

  if (!promocao) {
    return <div className="text-center py-8 mt-5">Carregando...</div>;
  }

  return (
    <section className="bg-white dark:bg-gray-900 mt-8">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">{promocao.nome}</h2>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <div className="sm:col-span-2">
            <p className="text-gray-700 dark:text-gray-300">{promocao.descricao}</p>
          </div>
          <div className="w-full">
            <p className="text-gray-900 dark:text-white">
              Tipo: {promocao.tipo === 'de_para' ? 'De/Para' : 'Desconto Percentual'}
            </p>
          </div>
          {promocao.tipo === 'de_para' && (
            <>
              <div className="w-full">
                <p className="text-gray-900 dark:text-white">Valor De: R$ {promocao.valor_de}</p>
              </div>
              <div className="w-full">
                <p className="text-gray-900 dark:text-white">Valor Para: R$ {promocao.valor_para}</p>
              </div>
            </>
          )}
          {promocao.tipo === 'desconto_percentual' && (
            <div className="w-full">
              <p className="text-gray-900 dark:text-white">Desconto: {promocao.desconto_percentual}%</p>
            </div>
          )}
          <div className="w-full">
            <p className="text-gray-900 dark:text-white">
              Período: {promocao.data_inicio} até {promocao.data_fim}
            </p>
          </div>
          <div className="w-full">
            <p className="text-gray-900 dark:text-white">
              Status: {promocao.ativa ? 'Ativa' : 'Inativa'}
            </p>
          </div>
          <div className="sm:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Produtos:</h3>
            {promocao.produtos && promocao.produtos.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {promocao.produtos.map((produto) => (
                  <li key={produto.id} className="text-gray-700 dark:text-gray-300">
                    {produto.nome}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700 dark:text-gray-300">Nenhum produto associado.</p>
            )}
          </div>
        </div>
        <div className="flex gap-4 mt-4 sm:mt-6">
          <button
            type="button"
            onClick={() => navigate("/promocoes")}
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-red-700 rounded-lg focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 hover:bg-red-800"
          >
            Voltar
          </button>
        </div>
      </div>
    </section>
  );
};

export default PromocaoDetail;