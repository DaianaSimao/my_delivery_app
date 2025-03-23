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

interface OrderItem {
  id: any;
  name: string;
  quantity: number;
  price: number;
  options?: string[];
  observation?: string;
  acompanhamentos: any[];
}

interface CustomerDataProps {
  cartItems: OrderItem[];
  onBack: () => void;
}

interface Cliente {
  id: any;
  nome?: string; // Propriedades opcionais
  telefone?: string;
  endereco_id?: number;
  sobrenome?: string;
  // Outras propriedades do cliente...
}

const CustomerData: React.FC<CustomerDataProps> = ({ cartItems, onBack }) => {
  const { onCheckout } = useCart();
  const [darkMode, setDarkMode] = useState(() => {
    // Obtém a preferência do tema do localStorage
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : true;
  });
  const [step, setStep] = useState<'data' | 'address' | 'payment'>('data');
  const [showNeighborhoodModal, setShowNeighborhoodModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showTrocoModal, setShowTrocoModal] = useState(false);

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
      navigate('/cart'); // Redireciona para a página do carrinho
    }
  }, [cartItems, navigate, isOrderFinalized]);

  useEffect(() => {
    const restauranteId = localStorage.getItem('restauranteId');
    if (restauranteId) {
      fetchRegioesEntrega(restauranteId)
        .then((data) => {
          setRegioesEntrega(data);
          // Atualiza a taxa de entrega com base no regioes_entrega_id inicial, se houver
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

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode: any) => {
      const newMode = !prevMode;
      // Armazena a preferência do tema no localStorage
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
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
          nome: customerFormData.firstName,
          sobrenome: customerFormData.lastName,
          telefone: customerFormData.whatsapp,
        });
        toast.success('Cliente atualizado com sucesso!');
      } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        // Mostra o erro no toast
        toast.error('Erro ao atualizar cliente. Tente novamente.');
        return; // Sai da função para evitar avançar para o próximo passo
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
    const clienteId = localStorage.getItem('clienteId');

    const cliente: Cliente | null = clienteEncontrado && 'nome' in clienteEncontrado
      ? clienteEncontrado
      : clienteId
      ? { id: clienteId } // Cria um objeto Cliente básico com apenas o ID
      : null;

    // Verifica se o cliente foi encontrado ou criado
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
      regioes_entrega_id: addressFormData.regioes_entrega_id, // Adicionado
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
      // Avança para o próximo passo
      setStep('payment');
    } catch (error) {
      console.error('Erro ao salvar endereço:', error);
      toast.error('Erro ao salvar endereço. Tente novamente.');
    }
  };

  const handleFinalizarPedido = async () => {
    // Verifica se todos os campos obrigatórios estão preenchidos
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
    // Estrutura os itens do pedido
    const itensPedidos = cartItems.map((item) => {
      // Extrai o ID do produto (parte antes do hífen)
      const produtoId = item.id.split('-')[0];

      // Mapeia os acompanhamentos a partir das options
      const acompanhamentos = item.acompanhamentos.map((option) => ({
        item_acompanhamento_id: option.id, // ID do acompanhamento
        quantidade: option.quantidade, // Quantidade selecionada
        preco_unitario: option.preco || 0, // Preço do acompanhamento (ou 0 se não houver preço)
      }));

      return {
        produto_id: produtoId, // ID do produto (apenas a parte antes do hífen)
        quantidade: item.quantity, // Quantidade do item
        preco_unitario: item.price, // Preço unitário do item
        observacao: item.observation, // Observações (opcional)
        acompanhamentos_pedidos_attributes: acompanhamentos || [], // Acompanhamentos (ou array vazio se não houver)
      };
    });
    // Estrutura o pagamento
    const pagamento = {
      metodo: selectedPayment,
      status: selectedPayment === "cash" || selectedPayment === "pix" ? "Aguardando Pagamento" : "Pago",
      valor: total,
      troco: selectedPayment === "cash" ? troco - total : 0,
    };

    // Estrutura o pedido completo
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

    try {
      // Envia os dados para o backend
      const pedidoCriado = await criarPedido(pedido);
      if (!pedidoCriado) {
        throw new Error("Erro ao enviar o pedido.");
      }
      toast.success('Pedido finalizado com sucesso!');

      // Salvar pedido completo no localStorage
      localStorage.setItem('pedido', JSON.stringify(pedidoCriado));
      
      // Salvar apenas o ID do pedido para recuperação posterior
      localStorage.setItem('pedidoId', pedidoCriado.data.id.toString());

      setIsOrderFinalized(true);
      
      onCheckout(); // Limpa o carrinho e redireciona
      navigate('/order-tracking');
    } catch (error) {
      console.error("Erro ao enviar o pedido:", error);
      toast.error("Erro ao enviar o pedido. Tente novamente.");
    }
  };

  const handleBack = () => {
    setIsOrderFinalized(false); // Reseta o estado ao voltar
    onBack(); // Chama a função onBack original
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
                else handleBack();
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
            onNeighborhoodChange={(neighborhood: string, regioes_entrega_id: number, city: string) => {
              handleNeighborhoodChange(neighborhood, regioes_entrega_id, city);
              const regiao = regioesEntrega.find((r) => r.id === regioes_entrega_id);
              setDeliveryFee(regiao ? regiao.taxa_entrega : 0); // Atualiza a taxa ao mudar a região
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