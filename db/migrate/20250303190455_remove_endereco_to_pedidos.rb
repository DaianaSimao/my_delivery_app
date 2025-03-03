class RemoveEnderecoToPedidos < ActiveRecord::Migration[8.0]
  def change
    remove_column :pedidos, :endereco_id, :bigint
    add_reference :clientes, :endereco, foreign_key: true
  end
end
