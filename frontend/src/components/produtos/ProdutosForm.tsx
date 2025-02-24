import React, { useState } from 'react';
import api from '../../services/api'; // Ajuste o caminho conforme necessário
import toast from 'react-hot-toast';

const ProdutosForm = () => {
  const [produto, setProduto] = useState({
    nome: '',
    preco: '',
    descricao: '',
    disponivel: true,
    imagem_url: '',
    restaurante_id: 1, // Adiciona o ID do restaurante
  });

  interface Produto {
    nome: string;
    preco: string;
    descricao: string;
    disponivel: boolean;
    imagem_url: string;
    restaurante_id: number;
  }

  interface ChangeEvent {
    target: {
      name: string;
      value: string | boolean;
    };
  }

  const handleChange = (e: ChangeEvent) => {
    const { name, value } = e.target;
    setProduto((prevProduto: Produto) => ({
      ...prevProduto,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setProduto((prevProduto: Produto) => ({
      ...prevProduto,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/v1/produtos', { produto: produto });
  
      if (response.status === 201) { // 201 significa "Created"
        toast.success('Produto cadastrado com sucesso!');
        setProduto({
          nome: '',
          preco: '',
          descricao: '',
          disponivel: true,
          imagem_url: '',
          restaurante_id: 1,
        });
      } else {
        toast.error('Erro ao cadastrar produto.');
      }
    } catch (error: any) { // Usamos 'any' para evitar problemas de tipagem
      console.error('Erro ao cadastrar produto:', error);
  
      let errorMessage = 'Erro ao cadastrar produto. Tente novamente.';
      if (error.response) {
        // Captura a mensagem de erro retornada pelo backend
        errorMessage = error.response.data?.error || error.response.data?.message || errorMessage;
      }
  
      toast.error(errorMessage);
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Adicionar Produto</h2>
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
                rows="8" 
                value={produto.descricao} 
                onChange={handleChange} 
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                placeholder="Your description here" 
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
                placeholder="Image URL" 
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
          </div>
          <button type="submit" className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
            Adicionar Produto
          </button>
        </form>
      </div>
    </section>
  );
};

export default ProdutosForm;