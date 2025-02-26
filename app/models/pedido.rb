class Pedido < ApplicationRecord
  has_one :entrega
  belongs_to :restaurante
  belongs_to :cliente
  belongs_to :endereco
  
  has_many :itens_pedidos
  has_many :produtos, through: :itens_pedidos # Associação correta
  has_one :pagamento

end
