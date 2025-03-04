import { useState } from 'react';
import { fetchClienteByWhatsApp } from '../services/api';

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  endereco_id: number;
  sobrenome: string;
}

const useCustomerData = () => {
  const [clienteEncontrado, setClienteEncontrado] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState({
    whatsapp: '',
    firstName: '',
    lastName: '',
  });

  const buscarCliente = async (whatsapp: string) => {
    const cliente = await fetchClienteByWhatsApp(whatsapp);
    if (cliente) {
      setClienteEncontrado(cliente);
      const [firstName, ...lastNameArray] = cliente.nome.split(' ');
      const lastName = lastNameArray.join(' ');
      setFormData({
        whatsapp: cliente.telefone,
        firstName,
        lastName,
      });
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
    handleWhatsappChange,
    handleFirstNameChange,
    handleLastNameChange,
  };
};

export default useCustomerData;