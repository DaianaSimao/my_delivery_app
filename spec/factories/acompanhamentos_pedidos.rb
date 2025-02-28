FactoryBot.define do
  factory :acompanhamentos_pedido do
    item_acompanhamento { nil }
    itens_pedido { nil }
    quantidade { 1 }
    preco_unitario { "9.99" }
  end
end
