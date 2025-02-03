class CreatePedidos < ActiveRecord::Migration[6.0]
  def change
    create_table :pedidos do |t|
      t.references :restaurante, null: false, foreign_key: true
      t.string  :nome_cliente, null: false
      t.string  :telefone_cliente
      t.text    :endereco_entrega, null: false
      t.string  :status, default: "Recebido"
      t.string  :forma_pagamento
      t.decimal :troco, precision: 10, scale: 2, default: 0.00
      t.decimal :valor_total, precision: 10, scale: 2, null: false
      t.text    :observacoes

      t.timestamps
    end
  end
end
