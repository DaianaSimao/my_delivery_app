class Pedido < ApplicationRecord
  has_one :entrega
  belongs_to :restaurante
  belongs_to :cliente
  belongs_to :endereco

  has_many :itens_pedidos
  has_many :produtos, through: :itens_pedidos # Associação correta
  has_one :pagamento

  after_update :create_entrega
  after_create :broadcast_new_order

  def create_entrega
    if self.status == "Expedido"
      Entrega.create(pedido_id: self.id)
    end
  end

  def broadcast_new_order
    restaurante_id = self.restaurante_id
    pedido_completo = Pedido.includes(:cliente, :endereco, :itens_pedidos, :produtos, :pagamento).find(self.id)

    pedido_data = pedido_completo.as_json(
      include: {
        cliente: {
          only: %i[id nome telefone]
        },
        endereco: {
          only: %i[id rua numero bairro cidade estado cep]
        },
        itens_pedidos: {
          only: %i[id quantidade preco_total],
          include: {
            produto: {
              only: %i[id nome preco],
              include: {
                acompanhamentos: {
                  only: %i[id nome quantidade_maxima],
                  include: {
                    itens_acompanhamentos: {
                      only: %i[id nome preco]
                    }
                  }
                }
              }
            },
            acompanhamentos_pedidos: {
              only: %i[quantidade preco_unitario],
              include: {
                item_acompanhamento: {
                  only: %i[id nome quantidade_maxima],
                  include: {
                    acompanhamento: {
                      only: %i[id nome quantidade_maxima]
                    }
                  }
                }
              }
            }
          }
        },
        pagamento: {
          only: %i[id metodo status valor]
        }
      }
    )
    ActionCable.server.broadcast("order_notifications_channel_#{restaurante_id}", { type: "new_order", pedido: pedido_data })
    ActionCable.server.broadcast("pedidos_channel_#{restaurante_id}", { type: "NEW_PEDIDO", pedido: pedido_data })
  end
end
