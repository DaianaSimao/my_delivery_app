class UpdatePedidosRestaurantes < ActiveRecord::Migration[8.0]
  def change
    add_reference :pedidos, :endereco, foreign_key: true
    add_reference :restaurantes, :endereco, foreign_key: true
  end
end
