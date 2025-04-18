import React, { useState, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Restaurante } from "../../types/Restaurante";
import { Bairro } from "../../types/Bairro";

// Função para formatar o horário (ISO 8601 -> HH:mm)
const formatTime = (isoString: string): string => {
  const date = new Date(isoString);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const RestauranteEditForm = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurante, setRestaurante] = useState<Restaurante>({
    nome: "",
    descricao: "",
    categoria: "",
    taxa_entrega: 0.0,
    tempo_medio_entrega: "",
    avaliacao: 0.0,
    pedido_minimo: 0.0,
    ativo: true,
    abertura: "",
    fechamento: "",
    cnpj: "",
    telefone: "",
    email: "",
    endereco: {
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
      tipo: "Restaurante",
      uf: "",
    },
    regioes_entrega: [],
  });

  const [cidades, setCidades] = useState<string[]>([]);
  const [bairros, setBairros] = useState<Bairro[]>([]);
  const [cidadeSelecionada, setCidadeSelecionada] = useState<string>("");
  const [bairroSelecionado, setBairroSelecionado] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurante = async () => {
      try {
        const response = await api.get(`/api/v1/restaurantes/${id}`);
        const restauranteData = response.data.data;
        setRestaurante({
          id: restauranteData.id,
          nome: restauranteData.nome,
          descricao: restauranteData.descricao,
          categoria: restauranteData.categoria,
          taxa_entrega: restauranteData.taxa_entrega,
          tempo_medio_entrega: restauranteData.tempo_medio_entrega,
          avaliacao: restauranteData.avaliacao,
          pedido_minimo: restauranteData.pedido_minimo,
          ativo: restauranteData.ativo,
          cnpj: restauranteData.cnpj,
          telefone: restauranteData.telefone,
          email: restauranteData.email,
          abertura: formatTime(restauranteData.abertura), // Aplica a formatação ao carregar
          fechamento: formatTime(restauranteData.fechamento), // Aplica a formatação ao carregar
          endereco: restauranteData.endereco || {
            rua: "",
            numero: "",
            complemento: "",
            bairro: "",
            cidade: "",
            estado: "",
            cep: "",
            uf: "",
          },
          regioes_entrega: restauranteData.regioes_entrega || [],
        });
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar dados do restaurante:", error);
        toast.error("Erro ao carregar dados do restaurante.");
        setLoading(false);
      }
    };

    fetchRestaurante();
  }, [id]);

  // Carrega as cidades com base no estado do endereço
  useEffect(() => {
    if (restaurante.endereco.uf) {
      api.get(`/api/v1/bairros/cidades?uf=${restaurante.endereco.uf}`)
        .then((response) => {
          console.log("uf", restaurante.endereco.uf);
          setCidades(response.data);
          console.log("Cidades carregadas:", response.data); // Depuração
        })
        .catch((error) => {
          console.error("Erro ao carregar cidades:", error);
        });
    }
  }, [restaurante.endereco.uf ]);

  // Carrega os bairros com base na cidade selecionada
  useEffect(() => {
    if (cidadeSelecionada) {
      api.get(`/api/v1/bairros?cidade=${cidadeSelecionada}&uf=${restaurante.endereco.uf}`)
        .then((response) => {
          console.log("Bairros carregados:", response.data); // Depuração
          setBairros(response.data);
        })
        .catch((error) => {
          console.error("Erro ao carregar bairros:", error);
        });
    }
  }, [cidadeSelecionada, restaurante.endereco.estado]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("endereco.")) {
      const enderecoField = name.split(".")[1];
      setRestaurante((prevRestaurante) => ({
        ...prevRestaurante,
        endereco: {
          ...prevRestaurante.endereco,
          [enderecoField]: value,
        },
      }));
    } else {
      setRestaurante((prevRestaurante) => ({
        ...prevRestaurante,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setRestaurante((prevRestaurante) => ({
      ...prevRestaurante,
      [name]: checked,
    }));
  };

  const handleRegiaoChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    const novasRegioes = [...restaurante.regioes_entrega];
    
    novasRegioes[index] = { 
      ...novasRegioes[index], 
      [name]: type === 'checkbox' ? checked : value 
    };
    
    setRestaurante((prevRestaurante) => ({
      ...prevRestaurante,
      regioes_entrega: novasRegioes,
    }));
  };

  const adicionarRegiao = () => {
    if (cidadeSelecionada && bairroSelecionado) {
      const novaRegiao = {
        cidade: cidadeSelecionada,
        bairro: bairroSelecionado,
        taxa_entrega: 0,
        ativo: true,
      };
      setRestaurante((prevRestaurante) => ({
        ...prevRestaurante,
        regioes_entrega: [...prevRestaurante.regioes_entrega, novaRegiao],
      }));
      setBairroSelecionado("");
    } else {
      toast.error("Selecione uma cidade e um bairro.");
    }
  };

  const removerRegiao = (index: number) => {
    const novasRegioes = [...restaurante.regioes_entrega];

    if (novasRegioes[index].id) {
      // Se a região já existe no banco de dados, marque para exclusão
      novasRegioes[index] = { ...novasRegioes[index], _destroy: true };
    } else {
      // Se a região é nova (não tem ID), remova-a do array
      novasRegioes.splice(index, 1);
    }

    setRestaurante((prevRestaurante) => ({
      ...prevRestaurante,
      regioes_entrega: novasRegioes,
    }));
  };

  const filtrarCamposDesnecessarios = (objeto: any, camposParaRemover: string[]) => {
    const novoObjeto = { ...objeto };
  
    // Remove campos desnecessários do objeto principal
    camposParaRemover.forEach((campo) => delete novoObjeto[campo]);
  
    // Remove campos desnecessários de sub-objetos (endereco_attributes e regioes_entrega_attributes)
    if (novoObjeto) {
      camposParaRemover.forEach((campo) => delete novoObjeto[campo]);
    }
    if (novoObjeto.endereco_attributes) {
      camposParaRemover.forEach((campo) => delete novoObjeto.endereco_attributes[campo]);
    }
  
    if (novoObjeto.regioes_entrega_attributes) {
      novoObjeto.regioes_entrega_attributes = novoObjeto.regioes_entrega_attributes.map((regiao: any) => {
        const novaRegiao = { ...regiao };
        camposParaRemover.forEach((campo) => delete novaRegiao[campo]);
        return novaRegiao;
      });
    }
  
    return novoObjeto;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = {
        restaurante: {
          id: restaurante.id,
          nome: restaurante.nome,
          descricao: restaurante.descricao,
          categoria: restaurante.categoria,
          ativo: restaurante.ativo,
          cnpj: restaurante.cnpj,
          telefone: restaurante.telefone,
          email: restaurante.email,
          pedido_minimo: restaurante.pedido_minimo,
          tempo_medio_entrega: restaurante.tempo_medio_entrega,
          abertura: new Date(`1970-01-01T${restaurante.abertura}Z`).toISOString(),
          fechamento: new Date(`1970-01-01T${restaurante.fechamento}Z`).toISOString(),
          taxa_entrega: parseFloat(restaurante.taxa_entrega.toString()),
          avaliacao: parseFloat(restaurante.avaliacao.toString()),
          endereco_attributes: restaurante.endereco,
          regioes_entrega_attributes: restaurante.regioes_entrega,
        },
      };
      const payload_filtrado_ = filtrarCamposDesnecessarios(payload.restaurante , ["created_at", "updated_at" , "regioes_entrega_id"]);

      const response = await api.put(`/api/v1/restaurantes/${id}`, payload_filtrado_);

      if (response.status === 200) {
        toast.success("Restaurante atualizado com sucesso!");
        navigate("/restaurantes");
      } else {
        toast.error("Erro ao atualizar restaurante.");
      }
    } catch (error: any) {
      console.error("Erro ao atualizar restaurante:", error);
      let errorMessage = "Erro ao atualizar restaurante. Tente novamente.";
      if (error.response) {
        errorMessage = error.response.data?.error || error.response.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    }
  };

  const handleRestaurantesClick = () => {
    navigate("/restaurantes");
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <section className="bg-white dark:bg-gray-900 mt-8">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Editar Restaurante</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            {/* Nome */}
            <div className="sm:col-span-2 flex gap-4 items-center">
              <div className="flex-1">
                <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Nome:
                </label>
                <input
                  type="text"
                  name="nome"
                  id="nome"
                  value={restaurante.nome}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Nome do Restaurante"
                  required
                />
              </div>
              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  name="ativo"
                  id="ativo"
                  checked={restaurante.ativo}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="ativo" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Ativo
                </label>
              </div>
            </div>

            {/* Descrição */}
            <div className="sm:col-span-2">
              <label htmlFor="descricao" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descrição</label>
              <textarea
                id="descricao"
                name="descricao"
                rows={4}
                value={restaurante.descricao}
                onChange={handleChange}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Descrição do Restaurante"
              />
            </div>

            <div className="w-full">
              <label htmlFor="categoria" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Categoria</label>
              <input
                type="text"
                name="categoria"
                id="categoria"
                value={restaurante.categoria}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Categoria do Restaurante"
                required
              />
            </div>

            <div className="w-full">
              <label htmlFor="taxa_entrega" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Pedido</label>
              <input
                type="number"
                name="pedido_minimo"
                id="pedido_minimo"
                value={restaurante.pedido_minimo}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Taxa de Entrega"
                required
              />
            </div>

            <div className="w-full">
              <label htmlFor="tempo_medio_entrega" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tempo Médio de Entrega</label>
              <input
                type="text"
                name="tempo_medio_entrega"
                id="tempo_medio_entrega"
                value={restaurante.tempo_medio_entrega}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Tempo Médio de Entrega"
                required
              />
            </div>

            <div className="w-full">
              <label htmlFor="abertura" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Horário de Abertura</label>
              <input
                type="time"
                name="abertura"
                id="abertura"
                value={restaurante.abertura}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                required
              />
            </div>

            <div className="w-full">
              <label htmlFor="fechamento" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Horário de Fechamento</label>
              <input
                type="time"
                name="fechamento"
                id="fechamento"
                value={restaurante.fechamento}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                required
              />
            </div>

            <div className="w-full">
              <label htmlFor="cnpj" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">CNPJ</label>
              <input
                type="text"
                name="cnpj"
                id="cnpj"
                value={restaurante.cnpj}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="CNPJ"
                required
              />
            </div>

            <div className="w-full">
              <label htmlFor="telefone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Telefone</label>
              <input
                type="text"
                name="telefone"
                id="telefone"
                value={restaurante.telefone}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Telefone"
                required
              />
            </div>

            <div className="w-full">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={restaurante.email}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Email"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Endereço</h3>
            </div>
            <div className="w-full">
              <label htmlFor="endereco.rua" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Rua</label>
              <input
                type="text"
                name="endereco.rua"
                id="endereco.rua"
                value={restaurante.endereco.rua}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Rua"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="endereco.numero" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Número</label>
              <input
                type="text"
                name="endereco.numero"
                id="endereco.numero"
                value={restaurante.endereco.numero}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Número"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="endereco.complemento" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Complemento</label>
              <input
                type="text"
                name="endereco.complemento"
                id="endereco.complemento"
                value={restaurante.endereco.complemento}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Complemento"
              />
            </div>
            <div className="w-full">
              <label htmlFor="endereco.bairro" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Bairro</label>
              <input
                type="text"
                name="endereco.bairro"
                id="endereco.bairro"
                value={restaurante.endereco.bairro}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Bairro"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="endereco.cidade" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cidade</label>
              <input
                type="text"
                name="endereco.cidade"
                id="endereco.cidade"
                value={restaurante.endereco.cidade}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Cidade"
                required
              />
            </div>

            <div className="w-full">
              <label htmlFor="endereco.estado" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Estado</label>
              <input
                type="text"
                name="endereco.estado"
                id="endereco.estado"
                value={restaurante.endereco.estado}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Estado"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="endereco.uf" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">UF</label>
              <input
                type="text"
                name="endereco.uf"
                id="endereco.uf"
                value={restaurante.endereco.uf}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="UF"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="endereco.cep" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">CEP</label>
              <input
                type="text"
                name="endereco.cep"
                id="endereco.cep"
                value={restaurante.endereco.cep}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="CEP"
                required
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 mt-4">Regiões de Entrega</h3>
            <div className="w-full">
              <label htmlFor="cidade" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Cidade
              </label>
              <select
                id="cidade"
                name="cidade"
                value={cidadeSelecionada}
                onChange={(e) => setCidadeSelecionada(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              >
                <option value="">Selecione uma cidade</option>
                {cidades.map((cidade, index) => (
                  <option key={index} value={cidade}>
                    {cidade}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full">
              <label htmlFor="bairro" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Bairro
              </label>
              <select
                id="bairro"
                name="bairro"
                value={bairroSelecionado}
                onChange={(e) => setBairroSelecionado(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              >
                <option value="">Selecione um bairro</option>
                {bairros.map((bairro) => (
                  <option key={bairro.id} value={bairro.nome}>
                    {bairro.nome}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={adicionarRegiao}
              className="mt-2 text-sm text-blue-500 hover:text-blue-700"
            >
              + Adicionar Região
            </button>

            {restaurante.regioes_entrega.map((regiao, index) => {
              if (regiao._destroy) return null;

              return (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    name="bairro"
                    value={regiao.bairro}
                    disabled
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  />
                  <input
                    type="number"
                    name="taxa_entrega"
                    value={regiao.taxa_entrega}
                    onChange={(e) => handleRegiaoChange(index, e)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Taxa de Entrega"
                    required
                  />
                  <input
                    type="checkbox"
                    name="ativo"
                    id="ativo"
                    checked={regiao.ativo}
                    onChange={(e) => handleRegiaoChange(index, e)}
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="ativo" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Ativo</label>
                  <button
                    type="button"
                    onClick={() => removerRegiao(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remover
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex gap-4 mt-4 sm:mt-6">
            <button
              type="submit"
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-green-700 rounded-lg focus:ring-4 focus:ring-green-200 dark:focus:ring-primary-900 hover:bg-green-800"
            >
              Atualizar Restaurante
            </button>
            <button
              type="button"
              onClick={handleRestaurantesClick}
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

export default RestauranteEditForm;