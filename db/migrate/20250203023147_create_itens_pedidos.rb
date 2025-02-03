class CreateItensPedidos < ActiveRecord::Migration[6.0]
  def change
    create_table :itens_pedidos do |t|
      t.references :pedido, null: false, foreign_key: true
      t.references :produto, null: false, foreign_key: true
      t.integer    :quantidade, null: false, default: 1
      t.decimal    :preco_unitario, precision: 10, scale: 2, null: false

      t.timestamps
    end
  end
end
