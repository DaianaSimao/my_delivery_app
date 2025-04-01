import { api } from './api';
import { ICustomerAddress, IAddressFormData, IDeliveryRegion } from '../types/CustomerTypes';

export class AddressService {
  static async createAddress(data: IAddressFormData): Promise<ICustomerAddress> {
    try {
      const addressData = {
        rua: data.street.trim(),
        numero: data.number.trim(),
        complemento: data.complement?.trim(),
        ponto_referencia: data.reference?.trim(),
        bairro: data.neighborhood.trim(),
        cidade: data.city.trim(),
        regioes_entrega_id: data.regioes_entrega_id,
        tipo: data.addressType
      };

      const response = await api.post('/enderecos', addressData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar endereço:', error);
      throw error;
    }
  }

  static async updateAddress(
    addressId: number, 
    data: IAddressFormData
  ): Promise<ICustomerAddress> {
    try {
      const addressData = {
        rua: data.street.trim(),
        numero: data.number.trim(),
        complemento: data.complement?.trim(),
        ponto_referencia: data.reference?.trim(),
        bairro: data.neighborhood.trim(),
        cidade: data.city.trim(),
        regioes_entrega_id: data.regioes_entrega_id,
        tipo: data.addressType
      };

      const response = await api.put(`/enderecos/${addressId}`, addressData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar endereço:', error);
      throw error;
    }
  }

  static async getAddress(addressId: number): Promise<ICustomerAddress> {
    try {
      const response = await api.get(`/enderecos/${addressId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
      throw error;
    }
  }

  static async getDeliveryRegions(restaurantId: string | number): Promise<IDeliveryRegion[]> {
    try {
      const response = await api.get(`/restaurantes/regioes_entrega/${restaurantId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar regiões de entrega:', error);
      throw error;
    }
  }

  static validateAddress(data: IAddressFormData): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (!data.street.trim()) {
      errors.street = 'Rua é obrigatória';
      isValid = false;
    }

    if (!data.number.trim()) {
      errors.number = 'Número é obrigatório';
      isValid = false;
    }

    if (!data.neighborhood.trim()) {
      errors.neighborhood = 'Bairro é obrigatório';
      isValid = false;
    }

    if (!data.city.trim()) {
      errors.city = 'Cidade é obrigatória';
      isValid = false;
    }

    if (!data.regioes_entrega_id) {
      errors.regioes_entrega_id = 'Região de entrega é obrigatória';
      isValid = false;
    }

    return { isValid, errors };
  }
}
