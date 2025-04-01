import { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, Mail, Calendar, DollarSign, Star, Package, Home, MapPinned, Truck, ArrowLeft, Sun, Moon } from 'lucide-react';
import { fetchRestaurantInfo, fetchRegioesEntrega } from '../../services/api';
import type { Restaurante, RegiaoEntrega } from '../../types';

interface RestauranteInfoProps {
  onBack: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

// Função para formatar horário
const formatTime = (isoString: string): string => {
  const date = new Date(isoString);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Função para formatar dias de funcionamento
const formatDiasFuncionamento = (dias: string | undefined): string => {
  if (!dias) return 'Não informado';
  return dias.split(',').join(', ');
};

const RestauranteInfo: React.FC<RestauranteInfoProps> = ({ isDarkMode, onToggleDarkMode }) => {
  const [restaurante, setRestaurante] = useState<Restaurante | null>(null);
  const [regioes, setRegioes] = useState<RegiaoEntrega[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Recupera o ID do restaurante do localStorage
        const restauranteId = localStorage.getItem('restauranteId');
        
        if (!restauranteId) {
          throw new Error('ID do restaurante não encontrado.');
        }

        const restauranteData = await fetchRestaurantInfo(restauranteId);
        setRestaurante(restauranteData);
        
        const regioesData = await fetchRegioesEntrega(restauranteId);
        setRegioes(regioesData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const regioesPorCidade = regioes.reduce((acc, regiao) => {
    if (!regiao.ativo) return acc;
    
    if (!acc[regiao.cidade]) {
      acc[regiao.cidade] = [];
    }
    
    acc[regiao.cidade].push(regiao);
    return acc;
  }, {} as Record<string, RegiaoEntrega[]>);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 dark:text-red-400 text-center">
        {error}
      </div>
    );
  }

  if (!restaurante) {
    return (
      <div className="p-4 text-gray-600 dark:text-gray-400 text-center">
        Nenhuma informação do restaurante encontrada.
      </div>
    );
  }

  function onBack(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    window.history.back();
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <ArrowLeft className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </header>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {restaurante.nome}
          </h2>
          {restaurante.categoria && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {restaurante.categoria}
            </p>
          )}
          {restaurante.descricao && (
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {restaurante.descricao}
            </p>
          )}
          
          {restaurante.avaliacao && (
            <div className="flex items-center mb-2">
              <Star className="h-5 w-5 text-yellow-500 mr-1" fill="currentColor" />
              <span className="text-gray-700 dark:text-gray-300">
              {restaurante.avaliacao}
              </span>
            </div>
          )}
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Informações de Contato
            </h3>
            <ul className="space-y-3">
              {restaurante.telefone && (
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <Phone className="h-5 w-5 text-primary-500 mr-2" />
                  <span>{restaurante.telefone}</span>
                </li>
              )}
              {restaurante.email && (
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <Mail className="h-5 w-5 text-primary-500 mr-2" />
                  <span>{restaurante.email}</span>
                </li>
              )}
              {restaurante.endereco && (
                <li className="flex items-start text-gray-700 dark:text-gray-300">
                  <MapPin className="h-5 w-5 text-primary-500 mr-2 mt-1" />
                  <span>
                    {restaurante.endereco.rua}, {restaurante.endereco.numero}
                    {restaurante.endereco.complemento && `, ${restaurante.endereco.complemento}`}<br />
                    {restaurante.endereco.bairro}, {restaurante.endereco.cidade}/{restaurante.endereco.estado}
                    <br />
                    CEP: {restaurante.endereco.cep}
                  </span>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Horário de Funcionamento
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <Clock className="h-5 w-5 text-primary-500 mr-2" />
                <span>
                  {formatTime(restaurante.abertura)} - {formatTime(restaurante.fechamento)}
                </span>
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <Calendar className="h-5 w-5 text-primary-500 mr-2" />
                <span>
                  {formatDiasFuncionamento(restaurante.dias_funcionamento)}
                </span>
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <Package className="h-5 w-5 text-primary-500 mr-2" />
                <span>
                  Tempo médio de entrega: {restaurante.tempo_medio_entrega} min
                </span>
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <DollarSign className="h-5 w-5 text-primary-500 mr-2" />
                <span>
                  Pedido mínimo: R$ {restaurante.pedido_minimo}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Regiões de entrega */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <Truck className="h-5 w-5 text-primary-500 mr-2" />
            Regiões de Entrega
          </h2>
        </div>

        <div className="p-6">
          {Object.keys(regioesPorCidade).length > 0 ? (
            Object.entries(regioesPorCidade).map(([cidade, bairros]) => (
              <div key={cidade} className="mb-6 last:mb-0">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                  <MapPinned className="h-5 w-5 text-primary-500 mr-2" />
                  {cidade}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {bairros.map((regiao) => (
                    <div 
                      key={regiao.id} 
                      className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-start">
                        <Home className="h-4 w-4 text-primary-500 mr-2 mt-1" />
                        <div>
                          <p className="text-gray-800 dark:text-gray-200">{regiao.bairro}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Taxa: R$ {regiao.taxa_entrega}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center">
              Nenhuma região de entrega encontrada.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestauranteInfo;
