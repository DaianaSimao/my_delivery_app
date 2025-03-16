import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

interface Pagamento {
  id: string;
  metodo: "PIX" | "Dinheiro" | "Cartão de Crédito" | "Cartão de Débito";
  status: "Pago" | "Aguardando pagamento";
  valor: number;
  troco?: number; // Troco é opcional (apenas para pagamento em dinheiro)
}

const PagamentoForm: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // ID do pedido
  const navigate = useNavigate();

  // Estado para os dados do pagamento
  const [pagamento, setPagamento] = useState<Pagamento>({
    id: "",
    metodo: "PIX",
    status: "Aguardando pagamento",
    valor: 0,
    troco: 0, // Inicialize troco com 0
  });

  // Carrega os dados do pagamento ao montar o componente
  useEffect(() => {
    const carregarPagamento = async () => {
      try {
        const response = await api.get(`/api/v1/pedidos/${id}/pagamento`);
        if (response.status === 200) {
          // Garanta que troco seja definido como 0 se for undefined ou null
          const dadosPagamento = response.data;
          setPagamento({
            ...dadosPagamento,
            troco: dadosPagamento.troco || 0, // Define troco como 0 se for undefined ou null
          });
        } else {
          toast.error("Erro ao carregar dados do pagamento.");
        }
      } catch (error) {
        console.error("Erro ao carregar pagamento:", error);
        toast.error("Erro ao carregar dados do pagamento.");
      }
    };

    carregarPagamento();
  }, [id]);

  // Atualiza o estado do pagamento quando os campos mudam
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPagamento((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Define o status automaticamente com base no método de pagamento
    if (name === "metodo") {
      const novoStatus =
        value === "Cartão de Crédito" || value === "Cartão de Débito"
          ? "Pago"
          : "Aguardando pagamento";
      setPagamento((prev) => ({
        ...prev,
        status: novoStatus,
      }));
    }
  };

  // Salva as alterações
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await api.put(`/api/v1/pagamentos/${pagamento.id}/`, pagamento);
      if (response.status === 200) {
        toast.success("Pagamento atualizado com sucesso!");
        navigate(-1); // Volta para a página anterior
      } else {
        throw new Error("Erro ao atualizar pagamento.");
      }
    } catch (error) {
      console.error("Erro ao atualizar pagamento:", error);
      toast.error("Erro ao atualizar pagamento. Tente novamente.");
    }
  };

  // Cancela a edição
  const handleCancel = () => {
    navigate(-1); // Volta para a página anterior
  };

  return (
    <section className="bg-white dark:bg-gray-900 mt-8">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Editar Pagamento
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            {/* Método de Pagamento */}
            <div className="sm:col-span-2">
              <label
                htmlFor="metodo"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Método de Pagamento:
              </label>
              <select
                name="metodo"
                id="metodo"
                value={pagamento.metodo}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                required
              >
                <option value="PIX">PIX</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Cartão de Débito">Cartão de Débito</option>
              </select>
            </div>

            {/* Status */}
            <div className="sm:col-span-2">
              <label
                htmlFor="status"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Status:
              </label>
              <select
                name="status"
                id="status"
                value={pagamento.status}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                required
              >
                <option value="Pago">Pago</option>
                <option value="Aguardando pagamento">Aguardando pagamento</option>
              </select>
            </div>

            {/* Valor */}
            <div className="sm:col-span-2">
              <label
                htmlFor="valor"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Valor:
              </label>
              <input
                type="number"
                name="valor"
                id="valor"
                value={pagamento.valor}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                required
              />
            </div>

            {/* Troco (visível apenas para pagamento em dinheiro) */}
            {pagamento.metodo === "Dinheiro" && (
              <div className="sm:col-span-2">
                <label
                  htmlFor="troco"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Troco:
                </label>
                <input
                  type="number"
                  name="troco"
                  id="troco"
                  value={pagamento.troco || 0} // Garanta que troco nunca seja undefined
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                />
              </div>
            )}
          </div>

          {/* Botões de ação */}
          <div className="flex gap-4 mt-4 sm:mt-6">
            <button
              type="submit"
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-green-700 rounded-lg focus:ring-4 focus:ring-green-200 dark:focus:ring-primary-900 hover:bg-green-800"
            >
              Salvar Alterações
            </button>
            <button
              type="button"
              onClick={handleCancel}
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

export default PagamentoForm;