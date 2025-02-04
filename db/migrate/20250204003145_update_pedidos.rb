class UpdatePedidos < ActiveRecord::Migration[8.0]
  def change
    remove_column :pedidos, :nome_cliente, :string
    remove_column :pedidos, :telefone_cliente, :string
    remove_column :pedidos, :endereco_entrega, :text

    add_reference :pedidos, :cliente, foreign_key: true, null: false
  end
end
