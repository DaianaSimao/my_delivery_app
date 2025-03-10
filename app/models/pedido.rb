class Pedido < ApplicationRecord
  belongs_to :restaurante
  belongs_to :cliente

  has_many :itens_pedidos
  has_many :produtos, through: :itens_pedidos
  has_one :pagamento
  has_one :entrega

  accepts_nested_attributes_for :pagamento
  accepts_nested_attributes_for :itens_pedidos, allow_destroy: true

  after_update :create_entrega
  after_create :broadcast_new_order, :ajusta_metodo_pagamento
  after_update :atualiza_status, if: -> { saved_change_to_status? }

  def atualiza_status
    PedidoStatusChannel.broadcast_to(self, { status: self.status })
  end

  def ajusta_metodo_pagamento
    self.update_columns(forma_pagamento: self.pagamento.metodo)
  end

  def create_entrega
    if self.status == "Expedido"
      Entrega.create(pedido_id: self.id, taxa_entrega: cliente.endereco.regioes_entrega.taxa_entrega)
    end
  end

  def broadcast_new_order
    restaurante_id = self.restaurante_id
    pedido_completo = Pedido.includes(:cliente, :itens_pedidos, :produtos, :pagamento).find(self.id)

    pedido_data = pedido_completo.as_json(
      include: {
        cliente: {
          only: %i[id nome telefone endereco_id],
          include: {
            endereco: {
              only: %i[id rua numero bairro cidade estado cep]
            }
          }
        },
        itens_pedidos: {
          only: %i[id quantidade preco_total],
          include: {
            produto: {
              only: %i[id nome preco]
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
