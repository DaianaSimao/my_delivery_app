class AcompanhamentosPedido < ApplicationRecord
  belongs_to :item_acompanhamento
  belongs_to :itens_pedido
end
