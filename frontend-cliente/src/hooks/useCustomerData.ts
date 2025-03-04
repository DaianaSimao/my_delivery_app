import { useState } from 'react';
import { fetchClienteByWhatsApp, criarCliente } from '../services/api';

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  endereco_id: number;
  sobrenome: string;
}

const useCustomerData = () => {
  const [clienteEncontrado, setClienteEncontrado] = useState<Cliente | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [formData, setFormData] = useState({
    whatsapp: '',
    firstName: '',
    lastName: '',
  });

  const buscarCliente = async (whatsapp: string) => {
    const cliente = await fetchClienteByWhatsApp(whatsapp);
    if (cliente) {
      setClienteEncontrado(cliente);
      setShowClienteModal(true); // Abre o modal apenas se o cliente for encontrado
      const [firstName, ...lastNameArray] = cliente.nome.split(' ');
      const lastName = lastNameArray.join(' ');
      setFormData({
        whatsapp: cliente.telefone,
        firstName,
        lastName,
      });
    } else {
      setClienteEncontrado(null); // Garante que o estado seja limpo se o cliente não for encontrado
    }
  };

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, whatsapp: value });
    buscarCliente(value);
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, firstName: e.target.value });
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, lastName: e.target.value });
  };

  return {
    formData,
    clienteEncontrado,
    isEditing,
    setIsEditing,
    handleWhatsappChange,
    handleFirstNameChange,
    handleLastNameChange,
    showClienteModal, // Retorne o estado do modal
    setShowClienteModal, // Retorne a função para controlar o modal
    setClienteEncontrado
  };
};

export default useCustomerData;