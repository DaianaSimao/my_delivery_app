class CreateProdutos < ActiveRecord::Migration[6.0]
  def change
    create_table :produtos do |t|
      t.references :restaurante, null: false, foreign_key: true
      t.string  :nome, null: false
      t.text    :descricao
      t.decimal :preco, precision: 10, scale: 2, null: false
      t.string  :imagem_url
      t.boolean :disponivel, default: true

      t.timestamps
    end
  end
end
