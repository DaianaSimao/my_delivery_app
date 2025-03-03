class RemoveEnderecoToPedidos < ActiveRecord::Migration[8.0]
  def change
    remove_column :pedidos, :endereco_id, :bigint
  end
end
