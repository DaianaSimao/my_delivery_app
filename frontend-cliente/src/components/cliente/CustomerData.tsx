import * as React from 'react';
import { useState, useEffect } from 'react';
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
import { atualizarCliente, atualizarEndereco, criarEndereco, criarPedido, atualizarEnderecoCliente, criarCliente, fetchRegioesEntrega } from '../../services/api';
import toast from 'react-hot-toast';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { OrderItem } from '../../types/OrderItem';
import { Cliente } from '../../types/Cliente';
import { useRestauranteId } from '../../hooks/useRestauranteId';

interface CustomerDataProps {
  cartItems: OrderItem[];
  onBack: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const CustomerData: React.FC<CustomerDataProps> = ({ cartItems, onBack, isDarkMode, onToggleDarkMode }) => {
  const { onCheckout } = useCart();
  const [step, setStep] = useState<'data' | 'address' | 'payment'>('data');
  const [showNeighborhoodModal, setShowNeighborhoodModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showTrocoModal, setShowTrocoModal] = useState(false);
  const restauranteId = useRestauranteId();
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  const navigate = useNavigate();

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
  
  const [regioesEntrega, setRegioesEntrega] = useState<any[]>([]);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [isOrderFinalized, setIsOrderFinalized] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0 && !isOrderFinalized) {
      toast.error('Seu carrinho está vazio. Adicione itens para prosseguir.');
      navigate('/cart');
    }
  }, [cartItems, navigate, isOrderFinalized]);

  useEffect(() => {
    if (restauranteId) {
      fetchRegioesEntrega(restauranteId)
        .then((data) => {
          setRegioesEntrega(data);
          
          if (addressFormData.regioes_entrega_id) {
            const regiao = data.find((r: any) => r.id === addressFormData.regioes_entrega_id);
            setDeliveryFee(regiao ? regiao.taxa_entrega : 0);
          }
        })
        .catch((error) => console.error('Erro ao carregar regiões:', error));
    }
  }, [addressFormData.regioes_entrega_id]);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = Number(subtotal) + Number(deliveryFee);

  const handleConfirmarDadosCliente = (editar: boolean) => {
    if (editar) {
      setIsEditing(true);
    } else {
      setStep('address');
    }
    setShowClienteModal(false);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (clienteEncontrado && isEditing) {
      try {
        await atualizarCliente(clienteEncontrado.id, {
          nome: customerFormData.firstName,
          sobrenome: customerFormData.lastName,
          telefone: customerFormData.whatsapp,
        });
        toast.success('Cliente atualizado com sucesso!');
      } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        toast.error('Erro ao atualizar cliente. Tente novamente.');
        return;
      }
    } else if (!clienteEncontrado) {
      try {
        const cliente = await criarCliente({
          nome: customerFormData.firstName,
          sobrenome: customerFormData.lastName,
          telefone: customerFormData.whatsapp,
        });
        localStorage.setItem('cliente', cliente);
        localStorage.setItem('clienteId', cliente.id);
        toast.success('Cliente criado com sucesso!');
      } catch (error) {
        console.error('Erro ao criar cliente:', error);
        toast.error('Erro ao criar cliente. Tente novamente.');
        return;
      }
    }
    setStep('address');
  };

  const handleSubmitAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const clienteId = localStorage.getItem('clienteId');

    const cliente: Cliente | null = clienteEncontrado && 'nome' in clienteEncontrado
      ? clienteEncontrado
      : clienteId
      ? { id: clienteId }
      : null;

    if (!cliente) {
      toast.error('Cliente não encontrado. Por favor, preencha os dados do cliente.');
      return;
    }

    const enderecoData = {
      rua: addressFormData.street,
      numero: addressFormData.number,
      complemento: addressFormData.complement,
      ponto_referencia: addressFormData.reference,
      bairro: addressFormData.neighborhood,
      cidade: addressFormData.city,
      regioes_entrega_id: addressFormData.regioes_entrega_id,
      tipo: addressFormData.addressType,
    };

    try {
      if (cliente.endereco_id) {
        await atualizarEndereco(cliente.endereco_id, enderecoData);
        toast.success('Endereço atualizado com sucesso!');
      } else {
        const endereco = await criarEndereco(enderecoData);
        if (!endereco) {
          throw new Error('Erro ao salvar endereço.');
        } else {
          await atualizarEnderecoCliente(cliente.id, { endereco_id: endereco.id });
          toast.success('Endereço salvo com sucesso!');
        }
      }
      const regiao = regioesEntrega.find((r) => r.id === addressFormData.regioes_entrega_id);

      setDeliveryFee(regiao ? regiao.taxa_entrega : 0);
      setStep('payment');
    }catch (error) {
      console.error('Erro ao salvar endereço:', error);
      
      // Verifica se é um erro Axios e tem response data
      if (error instanceof Error && (error as any).isAxiosError && (error as any).response?.data?.errors) {
        // Exibe todos os erros retornados pelo backend
        (error as any).response.data.errors.forEach((errMsg: string) => {
          toast.error(errMsg);
        });
      } else {
        // Erro genérico caso não seja um erro Axios com response
        toast.error('Erro ao salvar endereço. Tente novamente.');
      }
    }
  };

  const handleFinalizarPedido = async () => {
    if (isProcessingOrder) return;
    
    try {
      setIsProcessingOrder(true);
      
      const clienteId =
        typeof clienteEncontrado === "object" && clienteEncontrado !== null
          ? clienteEncontrado.id
          : localStorage.getItem("clienteId");

      if (!clienteId) {
        toast.error("Cliente não encontrado. Por favor, preencha os dados do cliente.");
        return;
      }

      const restauranteId = localStorage.getItem('restauranteId');
      if (!clienteId || !selectedPayment || !selectedDelivery) {
        toast.error('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      const troco = selectedPayment === 'cash' ? parseFloat(trocoValue) : 0;
      const itensPedidos = cartItems.map((item) => {
        const produtoId = item.id.split('-')[0];
        const acompanhamentos = item.acompanhamentos.map((option) => ({
          item_acompanhamento_id: option.id,
          quantidade: option.quantidade,
          preco_unitario: option.preco || 0,
        }));

        return {
          produto_id: produtoId,
          quantidade: item.quantity,
          preco_unitario: item.price,
          observacao: item.observation,
          acompanhamentos_pedidos_attributes: acompanhamentos || [],
        };
      });
      const pagamento = {
        metodo: selectedPayment,
        status: selectedPayment === "cash" || selectedPayment === "pix" ? "Aguardando Pagamento" : "Pago",
        valor: total,
        troco: selectedPayment === "cash" ? troco - total : 0,
      };

      const pedido = {
        restaurante_id: restauranteId,
        status: "Recebido",
        forma_pagamento: selectedPayment,
        troco: pagamento.troco - total ,
        cliente_id: clienteId,
        itens_pedidos_attributes: itensPedidos,
        pagamento_attributes: pagamento,
        valor_total: total,
        forma_entrega: selectedDelivery,
        troco_para: selectedPayment === "cash" ? troco : 0,
      };

      const pedidoCriado = await criarPedido(pedido);
      if (!pedidoCriado) {
        throw new Error("Erro ao enviar o pedido.");
      }
      toast.success('Pedido finalizado com sucesso!');
      localStorage.setItem('pedido', JSON.stringify(pedidoCriado));
      localStorage.setItem('pedidoId', pedidoCriado.data.id.toString());

      setIsOrderFinalized(true);
      onCheckout();
      navigate('/order-tracking');
    } catch (error) {
      console.error("Erro ao enviar o pedido:", error);
      toast.error("Erro ao enviar o pedido. Tente novamente.");
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const handleBack = () => {
    setIsOrderFinalized(false);
    onBack();
  };

  return (
    <div>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => {
                if (step === 'address') setStep('data');
                else if (step === 'payment') setStep('address');
                else handleBack();
              }}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-white" />
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
            onNeighborhoodChange={(neighborhood: string, regioes_entrega_id: number, city: string) => {
              handleNeighborhoodChange(neighborhood, regioes_entrega_id, city);
              const regiao = regioesEntrega.find((r) => r.id === regioes_entrega_id);
              setDeliveryFee(regiao ? regiao.taxa_entrega : 0);
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
                isProcessingOrder={isProcessingOrder}
              />
            </>
          )}
        </div>
        {showClienteModal && clienteEncontrado && (
          <ConfirmationModal
            clienteEncontrado={clienteEncontrado}
            onEdit={() => handleConfirmarDadosCliente(true)}
            onConfirm={() => handleConfirmarDadosCliente(false)}
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