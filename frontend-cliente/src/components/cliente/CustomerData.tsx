import React, { useState } from 'react';
import { ArrowLeft, Edit2, MapPin, CreditCard, Wallet, QrCode, DollarSign, Home, Briefcase, Users, Sun, Moon } from 'lucide-react';
import { fetchClienteByWhatsApp, fetchEnderecoById } from '../../services/api';

interface DeliveryOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface PaymentMethod {
  id: string;
  title: string;
  icon: React.ReactNode;
}

interface AddressType {
  id: string;
  title: string;
  icon: React.ReactNode;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  options?: string[];
}

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  endereco_id: number;
  sobrenome: string;
}

interface Endereco {
  id: number;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

function CustomerData({ cartItems, onBack }: { cartItems: OrderItem[]; onBack: () => void }) {
  const [darkMode, setDarkMode] = useState(true);
  const [step, setStep] = useState<'data' | 'address' | 'payment'>('data');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [showTrocoModal, setShowTrocoModal] = useState(false);
  const [trocoValue, setTrocoValue] = useState('');
  const [clienteEncontrado, setClienteEncontrado] = useState<Cliente | null>(null);
  const [enderecoCliente, setEnderecoCliente] = useState<Endereco | null>(null);
  const [showClienteModal, setShowClienteModal] = useState(false);

  const deliveryFee = 5.00;
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal + deliveryFee;

  const [formData, setFormData] = useState({
    whatsapp: '',
    firstName: '',
    lastName: '',
    street: '',
    number: '',
    complement: '',
    reference: '',
    neighborhood: 'Centro',
    city: 'São Paulo',
    addressType: 'home',
    observations: ''
  });

  // Definindo os tipos de endereço
  const addressTypes: AddressType[] = [
    { id: 'home', title: 'Casa', icon: <Home className="w-6 h-6" /> },
    { id: 'work', title: 'Trabalho', icon: <Briefcase className="w-6 h-6" /> },
    { id: 'friends', title: 'Amigos', icon: <Users className="w-6 h-6" /> }
  ];

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Função para buscar cliente pelo WhatsApp
  const buscarCliente = async (whatsapp: string) => {
    const cliente = await fetchClienteByWhatsApp(whatsapp);
    if (cliente) {
      setClienteEncontrado(cliente);
      const endereco = await fetchEnderecoById(cliente.endereco_id);
      if (endereco) {
        setEnderecoCliente(endereco);
        setFormData((prevFormData) => ({
          ...prevFormData,
          street: endereco.rua,
          number: endereco.numero,
          complement: endereco.complemento,
          neighborhood: endereco.bairro,
          city: endereco.cidade,
        }));
      }
      setShowClienteModal(true);
    }
  };

  // Atualiza o WhatsApp e busca o cliente
  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, whatsapp: value });
    buscarCliente(value);
  };

  // Confirma os dados do cliente
  const handleConfirmarDadosCliente = (editar: boolean) => {
    if (clienteEncontrado && !editar) {
      const [firstName, ...lastNameArray] = clienteEncontrado.nome.split(' ');
      const lastName = lastNameArray.join(' ');
      setFormData({
        ...formData,
        firstName,
        lastName,
        whatsapp: clienteEncontrado.telefone
      });
      setStep('address');
    } else if (clienteEncontrado && editar) {
      const [firstName, ...lastNameArray] = clienteEncontrado.nome.split(' ');
      const lastName = lastNameArray.join(' ');
      setFormData({
        ...formData,
        firstName,
        lastName,
        whatsapp: clienteEncontrado.telefone
      });
    }
    setShowClienteModal(false);
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('address');
  };

  const renderCustomerDataForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Número de WhatsApp
        </label>
        <input
          type="tel"
          id="whatsapp"
          value={formData.whatsapp}
          onChange={handleWhatsappChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent
                   px-4 py-2"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nome
          </label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent
                     px-4 py-2"
            required
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Sobrenome
          </label>
          <input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent
                     px-4 py-2"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
      >
        Avançar
      </button>
    </form>
  );

  const renderAddressForm = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex justify-between items-center">
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">Região de Entrega</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{formData.neighborhood}</p>
        </div>
        <button
          onClick={() => setShowChangeModal(true)}
          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
        >
          Ver Opções
        </button>
      </div>

      <form className="space-y-4">
        <div>
          <label htmlFor="street" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Rua
          </label>
          <input
            type="text"
            id="street"
            value={formData.street}
            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent
                     px-4 py-2"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Número
            </label>
            <input
              type="text"
              id="number"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent
                       px-4 py-2"
              required
            />
          </div>
          <div>
            <label htmlFor="complement" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Complemento
            </label>
            <input
              type="text"
              id="complement"
              value={formData.complement}
              onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent
                       px-4 py-2"
            />
          </div>
        </div>

        <div>
          <label htmlFor="reference" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Ponto de Referência
          </label>
          <input
            type="text"
            id="reference"
            value={formData.reference}
            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent
                     px-4 py-2"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nome do Endereço
          </label>
          <div className="grid grid-cols-3 gap-4">
            {addressTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setFormData({ ...formData, addressType: type.id })}
                className={`p-4 rounded-lg border ${
                  formData.addressType === type.id
                    ? 'border-red-600 dark:border-red-400 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-700'
                } flex flex-col items-center justify-center space-y-2`}
              >
                <div className={`${
                  formData.addressType === type.id
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {type.icon}
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{type.title}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            setStep('payment');
          }}
          className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
        >
          Salvar Endereço
        </button>
      </form>
    </div>
  );

  const renderOrderSummary = () => (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Resumo do Pedido</h3>
      <div className="space-y-3">
        {cartItems.map((item, index) => (
          <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {item.quantity}x {item.name}
                </p>
                {item.options && item.options.length > 0 && (
                  <ul className="mt-1 space-y-1">
                    {item.options.map((option, optIndex) => (
                      <li key={optIndex} className="text-sm text-gray-600 dark:text-gray-400">
                        • {option}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <p className="font-medium text-red-600 dark:text-red-400">
                R$ {(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
        <div className="pt-3 space-y-2">
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Taxa de entrega</span>
            <span>R$ {deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold text-gray-900 dark:text-white text-lg">
            <span>Total</span>
            <span className="text-red-600 dark:text-red-400">R$ {total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDeliveryOptions = () => {
    const deliveryOptions: DeliveryOption[] = [
      {
        id: 'delivery',
        title: 'Entrega',
        description: 'Receba em casa',
        icon: <MapPin className="w-6 h-6" />,
      },
      {
        id: 'pickup',
        title: 'Retirada',
        description: 'Retire no local',
        icon: <Home className="w-6 h-6" />,
      },
    ];

    const paymentMethods: PaymentMethod[] = [
      { id: 'credit', title: 'Cartão de Crédito', icon: <CreditCard className="w-6 h-6" /> },
      { id: 'debit', title: 'Cartão de Débito', icon: <Wallet className="w-6 h-6" /> },
      { id: 'pix', title: 'PIX', icon: <QrCode className="w-6 h-6" /> },
      { id: 'cash', title: 'Dinheiro', icon: <DollarSign className="w-6 h-6" /> }
    ];

    return (
      <div className="space-y-6">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {formData.firstName} {formData.lastName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{formData.whatsapp}</p>
            </div>
            <button
              onClick={() => setStep('data')}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              <Edit2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Escolha a Forma de Entrega</h3>
          {deliveryOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                setSelectedDelivery(option.id);
                if (option.id === 'delivery') {
                  setShowChangeModal(true);
                }
              }}
              className={`w-full p-4 rounded-lg border ${
                selectedDelivery === option.id
                  ? 'border-red-600 dark:border-red-400'
                  : 'border-gray-300 dark:border-gray-700'
              } flex items-center space-x-4`}
            >
              <div className={`${
                selectedDelivery === option.id
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {option.icon}
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900 dark:text-white">{option.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
              </div>
            </button>
          ))}
        </div>

        {selectedDelivery && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Escolha a Forma de Pagamento</h3>
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => {
                  setSelectedPayment(method.id);
                  if (method.id === 'cash') {
                    setShowTrocoModal(true);
                  }
                }}
                className={`w-full p-4 rounded-lg border ${
                  selectedPayment === method.id
                    ? 'border-red-600 dark:border-red-400'
                    : 'border-gray-300 dark:border-gray-700'
                } flex items-center space-x-4`}
              >
                <div className={`${
                  selectedPayment === method.id
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {method.icon}
                </div>
                <p className="flex-1 text-left font-medium text-gray-900 dark:text-white">{method.title}</p>
              </button>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="observations" className="block font-medium text-gray-900 dark:text-white">
            Observações do Pedido
          </label>
          <textarea
            id="observations"
            value={formData.observations}
            onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
            placeholder="Alguma observação sobre a entrega?"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent"
            rows={3}
          />
        </div>

        {selectedDelivery && selectedPayment && (
          <button
            onClick={() => {/* Handle order submission */}}
            className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
          >
            Finalizar Pedido
          </button>
        )}
      </div>
    );
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => {
                if (step === 'address') setStep('data');
                else if (step === 'payment') setStep('address');
                else onBack();
              }}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-white" />
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {darkMode ? (
                <Sun className="w-6 h-6 text-gray-900 dark:text-white" />
              ) : (
                <Moon className="w-6 h-6 text-gray-900 dark:text-white" />
              )}
            </button>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {step === 'data' && 'Dados para Entrega'}
            {step === 'address' && 'Novo Endereço'}
            {step === 'payment' && 'Finalizar Pedido'}
          </h1>

          {step === 'data' && renderCustomerDataForm()}
          {step === 'address' && renderAddressForm()}
          {step === 'payment' && (
            <>
              {renderOrderSummary()}
              {renderDeliveryOptions()}
            </>
          )}
        </div>

        {/* Modal de Confirmação de Dados do Cliente */}
        {showClienteModal && clienteEncontrado && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dados Encontrados</h3>
              <div className="space-y-2 mb-6">
                <p className="text-gray-600 dark:text-gray-300">
                  Nome: {clienteEncontrado.nome}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  WhatsApp: {clienteEncontrado.telefone}
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => handleConfirmarDadosCliente(true)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                           text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Editar Informações
                </button>
                <button
                  onClick={() => handleConfirmarDadosCliente(false)}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Escolha do Bairro */}
        {showChangeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Escolha o Bairro</h3>
              <div className="space-y-2 mb-6">
                {['Centro', 'Jardins', 'Pinheiros', 'Vila Madalena'].map((bairro) => (
                  <button
                    key={bairro}
                    onClick={() => {
                      setFormData({ ...formData, neighborhood: bairro });
                      setShowChangeModal(false);
                    }}
                    className="w-full p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700
                             text-gray-900 dark:text-white"
                  >
                    {bairro}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal de Troco */}
        {showTrocoModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Precisa de Troco?</h3>
              <input
                type="number"
                value={trocoValue}
                onChange={(e) => setTrocoValue(e.target.value)}
                placeholder="Valor para troco"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent
                         mb-4"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setShowTrocoModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg
                           text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Não Preciso
                </button>
                <button
                  onClick={() => setShowTrocoModal(false)}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerData;