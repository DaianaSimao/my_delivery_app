class CreateAcompanhamentosPedidos < ActiveRecord::Migration[8.0]
  def change
    create_table :acompanhamentos_pedidos do |t|
      t.references :item_acompanhamento, null: false, foreign_key: true
      t.references :itens_pedido, null: false, foreign_key: true
      t.integer :quantidade
      t.decimal :preco_unitario

      t.timestamps
    end
  end
end
