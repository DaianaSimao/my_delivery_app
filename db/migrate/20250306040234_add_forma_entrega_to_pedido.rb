class AddFormaEntregaToPedido < ActiveRecord::Migration[8.0]
  def change
    add_column :pedidos, :forma_entrega, :string
  end
end
