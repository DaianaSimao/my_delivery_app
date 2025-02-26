import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

interface ItemAcompanhamento {
  id?: number; // ID é opcional (para novos itens)
  nome: string;
  preco: string;
  _destroy?: boolean; // Flag para marcar o item para remoção
}

interface Acompanhamento {
  nome: string;
  quantidade_maxima: number;
  itens: ItemAcompanhamento[];
}

const AcompanhamentosEditForm = () => {
  const { id } = useParams<{ id: string }>(); // Captura o ID do acompanhamento da URL
  const [acompanhamento, setAcompanhamento] = useState<Acompanhamento>({
    nome: '',
    quantidade_maxima: 1,
    itens: [],
  });

  const navigate = useNavigate();

  // Carrega os dados do acompanhamento existente
  useEffect(() => {
    const fetchAcompanhamento = async () => {
      try {
        const response = await api.get(`/api/v1/acompanhamentos/${id}`);
        console.log("Dados recebidos:", response.data); // Verifique os dados no console
        const data = response.data.data;

        if (data) {
          setAcompanhamento({
            nome: data.nome || '', // Define um valor padrão caso data.nome seja undefined
            quantidade_maxima: data.quantidade_maxima || 1, // Define um valor padrão
            itens: data.item_acompanhamentos
              ? data.item_acompanhamentos.map((item: any) => ({
                  id: item.id, // Inclui o ID do item existente
                  nome: item.nome || '', // Define um valor padrão
                  preco: item.preco || '', // Define um valor padrão
                  _destroy: false, // Inicializa como false
                }))
              : [], // Define um array vazio caso item_acompanhamentos seja undefined
          });
        } else {
          toast.error('Dados do acompanhamento não encontrados.');
        }
      } catch (error) {
        console.error('Erro ao carregar acompanhamento:', error);
        toast.error('Erro ao carregar acompanhamento.');
      }
    };

    fetchAcompanhamento();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAcompanhamento((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const novosItens = [...acompanhamento.itens];
    novosItens[index] = { ...novosItens[index], [name]: value };
    setAcompanhamento((prev) => ({
      ...prev,
      itens: novosItens,
    }));
  };

  const adicionarItem = () => {
    setAcompanhamento((prev) => ({
      ...prev,
      itens: [...prev.itens, { nome: '', preco: '', _destroy: false }], // Novo item sem ID
    }));
  };

  const marcarItemParaRemocao = (index: number) => {
    const novosItens = [...acompanhamento.itens];
    novosItens[index]._destroy = true; // Marca o item para remoção
    setAcompanhamento((prev) => ({
      ...prev,
      itens: novosItens,
    }));
  };

  const handleAcompanhamentosClick = () => {
    navigate('/acompanhamentos');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = {
        acompanhamento: {
          nome: acompanhamento.nome,
          quantidade_maxima: acompanhamento.quantidade_maxima,
          item_acompanhamentos_attributes: acompanhamento.itens.map((item) => ({
            id: item.id || null, // Inclui o ID se existir, ou null para novos itens
            nome: item.nome,
            preco: item.preco || null, // Envia null se o preço não for informado
            _destroy: item._destroy || false, // Envia a flag _destroy
          })),
        },
      };

      console.log("Payload enviado:", payload); // Verifique o payload no console

      const response = await api.put(`/api/v1/acompanhamentos/${id}`, payload);

      if (response.status === 200) {
        toast.success('Acompanhamento atualizado com sucesso!');
        navigate('/acompanhamentos'); // Redireciona de volta para a lista de acompanhamentos
      } else {
        toast.error('Erro ao atualizar acompanhamento.');
      }
    } catch (error: any) {
      console.error('Erro ao atualizar acompanhamento:', error);
      toast.error(error.response?.data?.message || 'Erro ao atualizar acompanhamento.');
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900 mt-8">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Editar Acompanhamento</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Nome do Acompanhamento:
              </label>
              <input
                type="text"
                name="nome"
                id="nome"
                value={acompanhamento.nome}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Ex: Proteínas"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="quantidade_maxima" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Quantidade Máxima:
              </label>
              <input
                type="number"
                name="quantidade_maxima"
                id="quantidade_maxima"
                value={acompanhamento.quantidade_maxima}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Ex: 2"
                min="1"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Itens do Acompanhamento:
              </label>
              {acompanhamento.itens.map((item, index) => (
                !item._destroy && ( // Renderiza apenas os itens que não estão marcados para remoção
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      name="nome"
                      value={item.nome}
                      onChange={(e) => handleItemChange(index, e)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Ex: Salmão"
                      required
                    />
                    <input
                      type="text"
                      name="preco"
                      value={item.preco}
                      onChange={(e) => handleItemChange(index, e)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Preço (opcional)"
                    />
                    <button
                      type="button"
                      onClick={() => marcarItemParaRemocao(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remover
                    </button>
                  </div>
                )
              ))}
              <button
                type="button"
                onClick={adicionarItem}
                className="mt-2 text-sm text-blue-500 hover:text-blue-700"
              >
                + Adicionar Item
              </button>
            </div>
          </div>
          <div className="flex gap-4 mt-4 sm:mt-6">
            <button
              type="submit"
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-green-700 rounded-lg focus:ring-4 focus:ring-green-200 dark:focus:ring-primary-900 hover:bg-green-800"
            >
              Atualizar Acompanhamento
            </button>
            <button
              type="button"
              onClick={handleAcompanhamentosClick}
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

export default AcompanhamentosEditForm;