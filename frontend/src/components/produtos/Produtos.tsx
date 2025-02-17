import React, { useEffect, useState } from "react";
import api from "../../services/api";

const Produtos: React.FC = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        // Recupera o token do localStorage
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token de autenticação não encontrado.");
        }

        // Faz a requisição à API com o token no cabeçalho
        const response = await api.get("/api/v1/produtos")

        setProdutos(response.data.data); // Ajuste conforme a estrutura da sua API
        setLoading(false);
      } catch (err) {
        setError("Erro ao carregar produtos. Verifique sua autenticação.");
        setLoading(false);
        console.error(err);
      }
    };

    fetchProdutos();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <section className="pt-6 bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Lista de Produtos</h2>
        <div className="space-y-4">
          {produtos.length > 0 ? (
            produtos.map((produto) => (
              <div
                key={produto.id}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {produto.attributes.nome}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Preço: ${produto.attributes.preco}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Categoria: {produto.attributes.categoria}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Descrição: {produto.attributes.descricao}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">Nenhum produto encontrado.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Produtos;