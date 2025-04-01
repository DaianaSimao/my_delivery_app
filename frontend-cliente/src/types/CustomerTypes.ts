export interface ICustomerFormData {
  whatsapp: string;
  firstName: string;
  lastName: string;
}

export interface ICustomer {
  id: string;
  nome: string;
  sobrenome: string;
  telefone: string;
  endereco_id?: number;
}

export interface IAddressFormData {
  street: string;
  number: string;
  complement?: string;
  reference?: string;
  neighborhood: string;
  city: string;
  regioes_entrega_id: number;
  addressType: string;
}

export interface IDeliveryRegion {
  id: number;
  nome: string;
  taxa_entrega: number;
}

export interface ICustomerAddress {
  id: number;
  rua: string;
  numero: string;
  complemento?: string;
  ponto_referencia?: string;
  bairro: string;
  cidade: string;
  regioes_entrega_id: number;
  tipo: string;
}

export type CustomerFormStep = 'data' | 'address' | 'payment';

export interface ICustomerState {
  step: CustomerFormStep;
  customer: ICustomer | null;
  address: ICustomerAddress | null;
  isEditing: boolean;
  showClientModal: boolean;
  showNeighborhoodModal: boolean;
  showChangeModal: boolean;
  deliveryFee: number;
}

export interface ICustomerValidation {
  isValid: boolean;
  errors: {
    whatsapp?: string;
    firstName?: string;
    lastName?: string;
  };
}
