import React, { useState } from 'react';
import { ArrowLeft, Sun, Moon } from 'lucide-react';
import CustomerForm from './CustomerForm';
import AddressForm from './AddressForm';
import OrderSummary from './OrderSummary';
import DeliveryOptions from './DeliveryOptions';
import ConfirmationModal from './modals/ConfirmationModal';
import NeighborhoodModal from './modals/NeighborhoodModal';
import ChangeModal from './modals/ChangeModal';
import useCustomerData from '../../hooks/useCustomerData';
import useAddress from '../../hooks/useAddress';
import useOrder from '../../hooks/useOrder';
import { atualizarCliente, atualizarEndereco, criarEndereco, criarPedido, atualizarEnderecoCliente, criarCliente} from '../../services/api';
import toast from 'react-hot-toast';

interface OrderItem {
  id: any;
  name: string;
  quantity: number;
  price: number;
  options?: string[];
}

interface CustomerDataProps {
  cartItems: OrderItem[];
  onBack: () => void;
}

const CustomerData: React.FC<CustomerDataProps> = ({ cartItems, onBack }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [step, setStep] = useState<'data' | 'address' | 'payment'>('data');
  const [showNeighborhoodModal, setShowNeighborhoodModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showTrocoModal, setShowTrocoModal] = useState(false);

  const {
    formData: customerFormData,
    clienteEncontrado,
    showClienteModal,
    setShowClienteModal,
    handleWhatsappChange,
    handleFirstNameChange,
    handleLastNameChange,
  } = useCustomerData();

  const {
    formData: addressFormData,
    handleStreetChange,
    handleNumberChange,
    handleComplementChange,
    handleReferenceChange,
    handleNeighborhoodChange,
    handleCityChange,
    handleAddressTypeChange,
  } = useAddress(clienteEncontrado?.endereco_id);

  const {
    selectedDelivery,
    selectedPayment,
    trocoValue,
    handleDeliveryChange,
    handlePaymentChange,
    handleTrocoChange,
  } = useOrder();

  const deliveryFee = 5.00;
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal + deliveryFee;

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleConfirmarDadosCliente = (editar: boolean) => {
    if (editar) {
      // Entra no modo de edição
      setIsEditing(true);
    } else {
      // Confirma sem editar, avança para o próximo passo
      setStep('address');
    }
    setShowClienteModal(false); // Fecha o modal
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (clienteEncontrado && isEditing) {
      try {
        // Atualiza os dados no backend
        await atualizarCliente(clienteEncontrado.id, {
          nome: `${customerFormData.firstName} ${customerFormData.lastName}`,
          telefone: customerFormData.whatsapp,
        });
        toast.success('Cliente atualizado com sucesso!');
      } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        // Mostra o erro no toast
        toast.error('Erro ao atualizar cliente. Tente novamente.');
        return; // Sai da função para evitar avançar para o próximo passo
      }
    } else if(!clienteEncontrado) {
      try {
        const cliente = await criarCliente({
          nome: `${customerFormData.firstName} ${customerFormData.lastName}`,
          telefone: customerFormData.whatsapp,
        });
        localStorage.setItem('cliente_id', cliente.id);
        toast.success('Cliente criado com sucesso!'); 
      } catch (error) {
        console.error('Erro ao criar cliente:', error);
        // Mostra o erro no toast
        toast.error('Erro ao criar cliente. Tente novamente.');
        return; // Sai da função para evitar avançar para o próximo passo
      }
    }
    // Avança para o próximo passo apenas se não houve erro
    setStep('address');
  };

  const handleSubmitAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    const clienteId = localStorage.getItem('cliente_id');
  
    // Verifica se o cliente foi encontrado
    if (!clienteEncontrado && !clienteId) {
      toast.error('Cliente não encontrado. Por favor, preencha os dados do cliente.');
    }
  
    // Dados do endereço
    const enderecoData = {
      rua: addressFormData.street,
      numero: addressFormData.number,
      complemento: addressFormData.complement,
      referencia: addressFormData.reference,
      bairro: addressFormData.neighborhood,
      cidade: addressFormData.city,
      tipo: addressFormData.addressType,
    };
  
    try {
      if (clienteId) {
        const endereco = await criarEndereco(enderecoData);
        if (!endereco) {
          throw new Error('Erro ao salvar endereço.');
        } else {
          // Atualiza o cliente com o ID do endereço
          await atualizarEnderecoCliente(clienteId, { endereco_id: clienteId });
          toast.success('Endereço salvo com sucesso!');
        }
      }
      // Se o cliente já tem um endereço_id, atualiza o endereço
      if (clienteEncontrado.endereco_id) {
        await atualizarEndereco(clienteEncontrado.endereco_id, enderecoData);
        toast.success('Endereço atualizado com sucesso!');
      } else {
        // Se o cliente não tem um endereço_id, cria um novo endereço
        const endereco = await criarEndereco(enderecoData);
        if (!endereco) {
          throw new Error('Erro ao salvar endereço.');
        } else {
          // Atualiza o cliente com o ID do endereço
          await atualizarEnderecoCliente(clienteEncontrado.id, { endereco_id: endereco.id });
          toast.success('Endereço salvo com sucesso!');
        }
      }
      
      // Avança para o próximo passo
      setStep('payment');
    } catch (error) {
      console.error('Erro ao salvar endereço:', error);
      toast.error('Erro ao salvar endereço. Tente novamente.');
    }
  };

  const handleFinalizarPedido = async () => {
    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!clienteEncontrado || !selectedPayment || !selectedDelivery) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
  
    // Estrutura os itens do pedido
    const itensPedidos = cartItems.map((item) => ({
      produto_id: item.id, // Supondo que cada item tenha um ID de produto
      quantidade: item.quantity,
      preco_unitario: item.price,
      observacao: item.options ? item.options.join(", ") : null, // Junta as opções em uma string
    }));
  
    // Estrutura o pagamento
    const pagamento = {
      metodo: selectedPayment,
      status: "Pendente",
      valor: total,
      troco: selectedPayment === "cash" ? parseFloat(trocoValue) || 0 : 0, // Troco só é aplicável para pagamento em dinheiro
    };
  
    // Estrutura o pedido completo
    const pedido = {
      restaurante_id: 1, // Defina o ID do restaurante conforme necessário
      status: "Recebido",
      forma_pagamento: selectedPayment,
      troco: pagamento.troco,
      cliente_id: clienteEncontrado.id, // Usa o ID do cliente
      itens_pedidos: itensPedidos,
      pagamento,
      valor_total: total,
    };
  
    try {
      // Envia os dados para o backend
      const pedidoCriado = await criarPedido(pedido);
      if (!pedidoCriado) {
        throw new Error("Erro ao enviar o pedido.");
      }
  
      toast.success('Pedido finalizado com sucesso!');
  
      // Limpa o carrinho e redireciona o usuário
      onBack(); // Volta para a tela anterior
    } catch (error) {
      console.error("Erro ao enviar o pedido:", error);
      toast.error("Erro ao enviar o pedido. Tente novamente.");
    }
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

          {step === 'data' && (
            <CustomerForm
              formData={customerFormData}
              onWhatsappChange={handleWhatsappChange}
              onFirstNameChange={handleFirstNameChange}
              onLastNameChange={handleLastNameChange}
              onSubmit={handleSubmit}
            />
          )}

          {step === 'address' && (
            <AddressForm
              formData={addressFormData}
              onStreetChange={handleStreetChange}
              onNumberChange={handleNumberChange}
              onComplementChange={handleComplementChange}
              onReferenceChange={handleReferenceChange}
              onNeighborhoodChange={(neighborhood) => {
                handleNeighborhoodChange(neighborhood);
                setShowNeighborhoodModal(false);
              }}
              onCityChange={handleCityChange}
              onAddressTypeChange={handleAddressTypeChange}
              onSubmit={handleSubmitAddress}
            />
          )}

          {step === 'payment' && (
            <>
              <OrderSummary
                cartItems={cartItems}
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                total={total}
                formData={{ ...customerFormData, ...addressFormData }}
              />
              <DeliveryOptions
                selectedDelivery={selectedDelivery}
                selectedPayment={selectedPayment}
                onDeliveryChange={handleDeliveryChange}
                onPaymentChange={handlePaymentChange}
                onTrocoChange={handleTrocoChange}
                onSubmit={handleFinalizarPedido}
              />
            </>
          )}
        </div>
        {showClienteModal && clienteEncontrado && (
          <ConfirmationModal
            clienteEncontrado={clienteEncontrado}
            onEdit={() => handleConfirmarDadosCliente(true)} // Entra no modo de edição
            onConfirm={() => handleConfirmarDadosCliente(false)} // Confirma sem editar
          />
        )}

        {showNeighborhoodModal && (
          <NeighborhoodModal
            onNeighborhoodChange={handleNeighborhoodChange}
            onClose={() => setShowNeighborhoodModal(false)}
          />
        )}

        {showTrocoModal && (
          <ChangeModal
            trocoValue={trocoValue}
            onTrocoChange={handleTrocoChange}
            onClose={() => setShowTrocoModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CustomerData;
