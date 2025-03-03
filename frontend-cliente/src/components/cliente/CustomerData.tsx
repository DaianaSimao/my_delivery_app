import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit2, MapPin, CreditCard, Wallet, QrCode, DollarSign, Home, Briefcase, Users, Sun, Moon } from 'lucide-react';
import { fetchClienteByWhatsApp } from '../../services/api'; // Importe a função de busca de cliente

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
  sobrenome: ReactNode;
  id: string;
  nome: string;
  telefone: string;
}

function CustomerData({ cartItems, onBack }: { cartItems: OrderItem[]; onBack: () => void }) {
  const [darkMode, setDarkMode] = useState(false);
  const [step, setStep] = useState<'data' | 'address' | 'payment'>('data');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [showTrocoModal, setShowTrocoModal] = useState(false);
  const [trocoValue, setTrocoValue] = useState('');
  const [clienteEncontrado, setClienteEncontrado] = useState<Cliente | null>(null);
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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Função para buscar cliente pelo WhatsApp
  const buscarCliente = async (whatsapp: string) => {
    // if (whatsapp.length === 11) { // Verifica se o WhatsApp está completo
      const cliente = await fetchClienteByWhatsApp(whatsapp);
      console.log('Cliente encontrado na tela dados:', cliente);
      if (cliente) {
        setClienteEncontrado(cliente);
        setShowClienteModal(true);
      }
    // }
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
    }
    setShowClienteModal(false);
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowEditModal(true); // Abre o modal de confirmação
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

  // Restante do código...

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={onBack}
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
                  Sobrenome: {clienteEncontrado.sobrenome}
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

        {/* Outros modais... */}
      </div>
    </div>
  );
}

export default CustomerData;