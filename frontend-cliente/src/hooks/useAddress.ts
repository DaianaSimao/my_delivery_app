import { useState, useEffect } from 'react';
import { fetchEnderecoById } from '../services/api';

const useAddress = (enderecoId?: number) => {
  const [formData, setFormData] = useState({
    street: '',
    number: '',
    complement: '',
    reference: '',
    neighborhood: '',
    city: 'Cidade Padrão', // Ajuste conforme necessário
    addressType: 'Casa',
    regioes_entrega_id: 0, // Valor inicial
  });

  useEffect(() => {
    if (enderecoId) {
      fetchEnderecoById(enderecoId).then((data) => {
        setFormData({
          street: data.rua || '',
          number: data.numero || '',
          complement: data.complemento || '',
          reference: data.ponto_referencia || '',
          neighborhood: data.bairro || '',
          city: data.cidade || 'Cidade Padrão',
          addressType: data.tipo || 'Casa',
          regioes_entrega_id: data.regioes_entrega_id || 0,
        });
      });
    }
  }, [enderecoId]);

  const handleStreetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, street: e.target.value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, number: e.target.value }));
  };

  const handleComplementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, complement: e.target.value }));
  };

  const handleReferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, reference: e.target.value }));
  };

  const handleNeighborhoodChange = (neighborhood: string, regioes_entrega_id: number, city: string) => {
    setFormData((prev) => ({
      ...prev,
      neighborhood,
      regioes_entrega_id, // Atualiza o ID da região
      city,
    }));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, city: e.target.value }));
  };

  const handleAddressTypeChange = (addressType: string) => {
    setFormData((prev) => ({ ...prev, addressType }));
  };

  return {
    formData,
    handleStreetChange,
    handleNumberChange,
    handleComplementChange,
    handleReferenceChange,
    handleNeighborhoodChange,
    handleCityChange,
    handleAddressTypeChange,
  };
};

export default useAddress;