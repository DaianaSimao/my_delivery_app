import { useState } from 'react';

const useOrder = () => {
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [trocoValue, setTrocoValue] = useState('');

  const handleDeliveryChange = (delivery: string) => {
    setSelectedDelivery(delivery);
  };

  const handlePaymentChange = (payment: string) => {
    setSelectedPayment(payment);
  };

  const handleTrocoChange = (troco: string) => {
    setTrocoValue(troco);
  };

  return {
    selectedDelivery,
    selectedPayment,
    trocoValue,
    handleDeliveryChange,
    handlePaymentChange,
    handleTrocoChange,
  };
};

export default useOrder;