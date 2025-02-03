class CreateRestaurantes < ActiveRecord::Migration[6.0]
  def change
    create_table :restaurantes do |t|
      t.string  :nome, null: false
      t.text    :descricao
      t.string  :categoria
      t.decimal :taxa_entrega, precision: 10, scale: 2, default: 0.00
      t.integer :tempo_medio_entrega
      t.decimal :avaliacao, precision: 3, scale: 2, default: 0.0
      t.boolean :ativo, default: true

      t.timestamps
    end
  end
end
