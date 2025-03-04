import { useState, useEffect } from 'react';
import { fetchEnderecoById } from '../services/api';

const useAddress = (enderecoId?: number) => {
  const [formData, setFormData] = useState({
    street: '',
    number: '',
    complement: '',
    reference: '',
    neighborhood: 'Centro',
    city: 'São Paulo',
    addressType: 'home',
  });

  const [originalData, setOriginalData] = useState({ ...formData });

  useEffect(() => {
    if (enderecoId) {
      const buscarEndereco = async () => {
        try {
          const endereco = await fetchEnderecoById(enderecoId);
          if (endereco) {
            const dadosEndereco = {
              street: endereco.rua,
              number: endereco.numero,
              complement: endereco.complemento || '',
              reference: endereco.ponto_referencia || '',
              neighborhood: endereco.bairro,
              city: endereco.cidade,
              addressType: endereco.tipo || 'home',

            };
            setFormData(dadosEndereco);
            setOriginalData(dadosEndereco); // Armazena os dados originais
          }
        } catch (error) {
          console.error('Erro ao buscar endereço:', error);
        }
      };

      buscarEndereco();
    }
  }, [enderecoId]);

  // Funções para atualizar o estado do formulário
  const handleStreetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, street: e.target.value });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, number: e.target.value });
  };

  const handleComplementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, complement: e.target.value });
  };

  const handleReferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, reference: e.target.value });
  };

  const handleNeighborhoodChange = (neighborhood: string) => {
    setFormData({ ...formData, neighborhood });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, city: e.target.value });
  };

  const handleAddressTypeChange = (addressType: string) => {
    setFormData({ ...formData, addressType });
  };

  return {
    formData,
    originalData, // Retorna os dados originais
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