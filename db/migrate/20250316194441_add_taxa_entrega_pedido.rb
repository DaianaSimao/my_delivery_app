class AddTaxaEntregaPedido < ActiveRecord::Migration[8.0]
  def change
    add_column :pedidos, :taxa_entrega, :decimal, precision: 10, scale: 2, default: 0.0
  end
end
