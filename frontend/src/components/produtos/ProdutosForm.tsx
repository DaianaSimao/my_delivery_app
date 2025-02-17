import React, { useState } from 'react';

const ProdutosForm = () => {
  const [product, setProduct] = useState({
    nome: '',
    marca: '',
    preco: '',
    categoria: '',
    peso: '',
    descricao: '',
    disponivel: true,
  });

  interface Product {
    nome: string;
    marca: string;
    preco: string;
    categoria: string;
    peso: string;
    descricao: string;
    disponivel: boolean;
  }

  interface ChangeEvent {
    target: {
      name: string;
      value: string;
    };
  }

  const handleChange = (e: ChangeEvent) => {
    const { name, value } = e.target;
    setProduct((prevProduct: Product) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Produto adicionado:", product);
    // Aqui você pode adicionar a lógica para enviar os dados para a API ou o backend
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Add a new product</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Product Name</label>
              <input 
                type="text" 
                name="nome" 
                id="nome" 
                value={product.nome} 
                onChange={handleChange} 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                placeholder="Type product name" 
                required 
              />
            </div>
            <div className="w-full">
              <label htmlFor="marca" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Brand</label>
              <input 
                type="text" 
                name="marca" 
                id="marca" 
                value={product.marca} 
                onChange={handleChange} 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                placeholder="Product brand" 
                required 
              />
            </div>
            <div className="w-full">
              <label htmlFor="preco" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Price</label>
              <input 
                type="number" 
                name="preco" 
                id="preco" 
                value={product.preco} 
                onChange={handleChange} 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                placeholder="$2999" 
                required 
              />
            </div>
            <div>
              <label htmlFor="categoria" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
              <select 
                id="categoria" 
                name="categoria" 
                value={product.categoria} 
                onChange={handleChange} 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              >
                <option value="">Select category</option>
                <option value="TV">TV/Monitors</option>
                <option value="PC">PC</option>
                <option value="GA">Gaming/Console</option>
                <option value="PH">Phones</option>
              </select>
            </div>
            <div>
              <label htmlFor="peso" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Item Weight (kg)</label>
              <input 
                type="number" 
                name="peso" 
                id="peso" 
                value={product.peso} 
                onChange={handleChange} 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                placeholder="12" 
                required 
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="descricao" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
              <textarea 
                id="descricao" 
                name="descricao" 
                rows="8" 
                value={product.descricao} 
                onChange={handleChange} 
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                placeholder="Your description here" 
              />
            </div>
          </div>
          <button type="submit" className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
            Add product
          </button>
        </form>
      </div>
    </section>
  );
};

export default ProdutosForm;
