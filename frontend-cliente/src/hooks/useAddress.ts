import { useState } from 'react';

const useAddress = () => {
  const [formData, setFormData] = useState({
    street: '',
    number: '',
    complement: '',
    reference: '',
    neighborhood: 'Centro',
    city: 'São Paulo',
    addressType: 'home',
  });

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