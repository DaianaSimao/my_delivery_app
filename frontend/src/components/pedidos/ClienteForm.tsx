import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ClienteForm: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();

  const [cliente, setCliente] = useState({
    nome: '',
    telefone: '',
    sobrenome: '',
    endereco: {
      id: 0,
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
      regiao_entrega: '',
      ponto_referencia: '',
      tipo: '',
      complemento: '',
      regioes_entrega: {
        id: 0,
        bairro: '',
      }
    },
  });

  useEffect(() => {
    const carregarCliente = async () => {
      try {
        const response = await api.get(`/api/v1/clientes/carregar_cliente/${id}`);
        console.log(response.data);
        if (response.status === 200) {
          setCliente(response.data);
        } else {
          toast.error('Erro ao carregar dados do cliente.');
        }
      } catch (error) {
        console.error('Erro ao carregar cliente:', error);
        toast.error('Erro ao carregar dados do cliente.');
      }
    };

    carregarCliente();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCliente((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCliente((prev) => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Atualiza os dados do cliente
      const clientePayload = {
        nome: cliente.nome,
        telefone: cliente.telefone,
        sobrenome: cliente.sobrenome,
      };

      const responseCliente = await api.put(`/api/v1/clientes/${id}`, { cliente: clientePayload });

      if (responseCliente.status !== 200) {
        throw new Error('Erro ao atualizar cliente.');
      }

      // Atualiza os dados do endereço
      const enderecoPayload = {
        rua: cliente.endereco.rua,
        numero: cliente.endereco.numero,
        bairro: cliente.endereco.bairro,
        cidade: cliente.endereco.cidade,
        estado: cliente.endereco.estado,
        cep: cliente.endereco.cep,
        ponto_referencia: cliente.endereco.ponto_referencia,
        tipo: cliente.endereco.tipo,
        complemento: cliente.endereco.complemento,
      };

      const responseEndereco = await api.put(`/api/v1/enderecos/${cliente.endereco.id}`, { endereco: enderecoPayload });

      if (responseEndereco.status !== 200) {
        throw new Error('Erro ao atualizar endereço.');
      }

      toast.success('Cliente e endereço atualizados com sucesso!');
      navigate(-1); // Volta para a página anterior após salvar
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      toast.error('Erro ao atualizar cliente ou endereço.');
    }
  };

  const handleCancel = () => {
    navigate(-1); // Volta para a página anterior
  };

  return (
    <section className="bg-white dark:bg-gray-900 mt-8">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Editar Cliente</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            {/* Nome */}
            <div className="sm:col-span-2">
              <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Nome:
              </label>
              <input
                type="text"
                name="nome"
                id="nome"
                value={cliente.nome}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Ex: João"
                required
              />
            </div>

            {/* Sobrenome */}
            <div className="sm:col-span-2">
              <label htmlFor="sobrenome" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Sobrenome:
              </label>
              <input
                type="text"
                name="sobrenome"
                id="sobrenome"
                value={cliente.sobrenome}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Ex: Silva"
                required
              />
            </div>

            {/* Telefone */}
            <div className="sm:col-span-2">
              <label htmlFor="telefone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Telefone:
              </label>
              <input
                type="text"
                name="telefone"
                id="telefone"
                value={cliente.telefone}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Ex: (11) 99999-9999"
                required
              />
            </div>

            {/* Endereço */}
            <div className="sm:col-span-2">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Endereço</h3>
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                {/* Rua */}
                <div>
                  <label htmlFor="rua" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Rua:
                  </label>
                  <input
                    type="text"
                    name="rua"
                    id="rua"
                    value={cliente.endereco.rua}
                    onChange={handleEnderecoChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Ex: Rua das Flores"
                    required
                  />
                </div>

                {/* Número */}
                <div>
                  <label htmlFor="numero" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Número:
                  </label>
                  <input
                    type="text"
                    name="numero"
                    id="numero"
                    value={cliente.endereco.numero}
                    onChange={handleEnderecoChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Ex: 123"
                    required
                  />
                </div>

                {/* Cidade */}
                <div>
                  <label htmlFor="cidade" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Cidade:
                  </label>
                  <input
                    type="text"
                    name="cidade"
                    id="cidade"
                    value={cliente.endereco.cidade}
                    onChange={handleEnderecoChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Ex: São Paulo"
                    required
                    disabled
                  />
                </div>

                {/* Estado */}
                <div>
                  <label htmlFor="estado" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Estado:
                  </label>
                  <input
                    type="text"
                    name="estado"
                    id="estado"
                    value={cliente.endereco.estado}
                    onChange={handleEnderecoChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Ex: SP"
                    required
                  />
                </div>

                {/* CEP */}
                <div>
                  <label htmlFor="cep" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    CEP:
                  </label>
                  <input
                    type="text"
                    name="cep"
                    id="cep"
                    value={cliente.endereco.cep}
                    onChange={handleEnderecoChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Ex: 12345-678"
                    required
                  />
                </div>

                {/* Região de Entrega */}
                <div>
                  <label htmlFor="regiao_entrega" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Região de Entrega:
                  </label>
                  <input
                    type="text"
                    name="regiao_entrega"
                    id="regiao_entrega"
                    value={cliente.endereco.regioes_entrega.bairro}
                    onChange={handleEnderecoChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Ex: Zona Sul"
                  />
                </div>

                {/* Ponto de Referência */}
                <div>
                  <label htmlFor="ponto_referencia" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Ponto de Referência:
                  </label>
                  <input
                    type="text"
                    name="ponto_referencia"
                    id="ponto_referencia"
                    value={cliente.endereco.ponto_referencia}
                    onChange={handleEnderecoChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Ex: Próximo ao mercado"
                  />
                </div>

                {/* Tipo */}
                <div>
                  <label htmlFor="tipo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Tipo:
                  </label>
                  <select
                    name="tipo"
                    id="tipo"
                    value={cliente.endereco.tipo}
                    onChange={handleEnderecoChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  >
                    <option value="Trabalho">Trabalho</option>
                    <option value="Amigos">Amigos</option>
                    <option value="Casa">Casa</option>
                  </select>
                </div>

                {/* Complemento */}
                <div>
                  <label htmlFor="complemento" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Complemento:
                  </label>
                  <input
                    type="text"
                    name="complemento"
                    id="complemento"
                    value={cliente.endereco.complemento}
                    onChange={handleEnderecoChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Ex: Apto 101"
                  />
                </div>
              </div>
            </div>
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

export default ClienteForm;