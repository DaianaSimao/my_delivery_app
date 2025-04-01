import { api } from './api';
import { ICustomer, ICustomerFormData, ICustomerAddress } from '../types/CustomerTypes';

export class CustomerService {
  private static formatPhoneNumber(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  private static validatePhoneNumber(phone: string): boolean {
    const formattedPhone = this.formatPhoneNumber(phone);
    return /^(\d{11}|\d{9})$/.test(formattedPhone);
  }

  static async findCustomerByWhatsApp(whatsapp: string): Promise<ICustomer | null> {
    try {
      if (!this.validatePhoneNumber(whatsapp)) {
        throw new Error('Número de WhatsApp inválido');
      }

      const formattedWhatsapp = this.formatPhoneNumber(whatsapp);
      const response = await api.get(`/clientes/?whatsapp=${formattedWhatsapp}`);
      return response.data;
    } catch (error) {
      if (error instanceof Error && error.message === 'Número de WhatsApp inválido') {
        throw error;
      }
      console.error('Erro ao buscar cliente:', error);
      return null;
    }
  }

  static async createCustomer(data: ICustomerFormData): Promise<ICustomer> {
    try {
      if (!this.validatePhoneNumber(data.whatsapp)) {
        throw new Error('Número de WhatsApp inválido');
      }

      const customerData = {
        nome: data.firstName.trim(),
        sobrenome: data.lastName.trim(),
        telefone: this.formatPhoneNumber(data.whatsapp)
      };

      const response = await api.post('/clientes', customerData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  }

  static async updateCustomer(
    clientId: string, 
    data: ICustomerFormData
  ): Promise<ICustomer> {
    try {
      if (!this.validatePhoneNumber(data.whatsapp)) {
        throw new Error('Número de WhatsApp inválido');
      }

      const customerData = {
        nome: data.firstName.trim(),
        sobrenome: data.lastName.trim(),
        telefone: this.formatPhoneNumber(data.whatsapp)
      };

      const response = await api.put(`/clientes/${clientId}`, customerData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }
  }

  static async updateCustomerAddress(
    clientId: string, 
    addressId: string
  ): Promise<ICustomer> {
    try {
      const response = await api.put(`/clientes/${clientId}`, { endereco_id: addressId });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar endereço do cliente:', error);
      throw error;
    }
  }

  static async getCustomerAddress(addressId: number): Promise<ICustomerAddress> {
    try {
      const response = await api.get(`/enderecos/${addressId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
      throw error;
    }
  }
}
