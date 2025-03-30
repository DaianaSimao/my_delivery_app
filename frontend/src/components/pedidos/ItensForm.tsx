import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { ItemPedido } from '../../types/ItemPedido';

const ItensForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [itensPedido, setItensPedido] = useState<ItemPedido[]>([]);

  useEffect(() => {
    const carregarItensPedido = async () => {
      try {
        const response = await api.get(`/api/v1/pedidos/${id}/itens`);
        if (response.status === 200) {
          setItensPedido(response.data);
        } else {
          toast.error('Erro ao carregar itens do pedido.');
        }
      } catch (error) {
        console.error('Erro ao carregar itens do pedido:', error);
        toast.error('Erro ao carregar itens do pedido.');
      }
    };

    carregarItensPedido();
  }, [id]);

  const handleQuantidadeChange = (itemId: number, quantidade: number) => {
    setItensPedido((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantidade } : item
      )
    );
  };

  const handleAcompanhamentoQuantidadeChange = (
    itemId: number,
    acompanhamentoId: number,
    quantidade: number
  ) => {
    setItensPedido((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              acompanhamentos_pedidos: item.acompanhamentos_pedidos?.map((acomp) =>
                acomp.id === acompanhamentoId
                  ? { ...acomp, quantidade }
                  : acomp
              ),
            }
          : item
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await api.put(`/api/v1/pedidos/${id}/atualizar_itens`, {
        itens: itensPedido.map((item) => ({
          id: item.id,
          quantidade: item.quantidade,
          acompanhamentos_pedidos_attributes: item.acompanhamentos_pedidos?.map((acomp) => ({
            id: acomp.id,
            quantidade: acomp.quantidade,
          })),
        })),
      });
      if (response.status === 200) {
        toast.success('Itens do pedido atualizados com sucesso!');
        navigate(-1);
      } else {
        throw new Error('Erro ao atualizar itens do pedido.');
      }
    } catch (error) {
      console.error('Erro ao atualizar itens do pedido:', error);
      toast.error('Erro ao atualizar itens do pedido.');
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <section className="bg-white dark:bg-gray-900 mt-8">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Editar Itens do Pedido
        </h2>
        <form onSubmit={handleSubmit}>
          {itensPedido.map((item) => (
            <div key={item.id} className="mb-6 p-4 border rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {item.produto.nome}
              </h3>

              <div className="mt-2">
                <label
                  htmlFor={`quantidade-${item.id}`}
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Quantidade:
                </label>
                <input
                  type="number"
                  id={`quantidade-${item.id}`}
                  value={item.quantidade}
                  onChange={(e) =>
                    handleQuantidadeChange(item.id, parseInt(e.target.value, 10))
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  min="1"
                  required
                />
              </div>

              {item.acompanhamentos_pedidos &&
                item.acompanhamentos_pedidos.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white">
                      Acompanhamentos
                    </h4>
                    {item.acompanhamentos_pedidos.map((acomp) => (
                      <div key={acomp.id} className="mt-2">
                        <label
                          htmlFor={`acompanhamento-${acomp.id}`}
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          {acomp.item_acompanhamento.nome} (R$ {acomp.preco_unitario})
                        </label>
                        <input
                          type="number"
                          id={`acompanhamento-${acomp.id}`}
                          value={acomp.quantidade}
                          onChange={(e) =>
                            handleAcompanhamentoQuantidadeChange(
                              item.id,
                              acomp.id,
                              parseInt(e.target.value, 10)
                            )
                          }
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          min="0"
                          required
                        />
                      </div>
                    ))}
                  </div>
                )}
            </div>
          ))}

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

export default ItensForm;