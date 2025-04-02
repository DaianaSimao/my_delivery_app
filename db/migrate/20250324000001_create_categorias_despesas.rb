class CreateCategoriasDespesas < ActiveRecord::Migration[8.0]
  def change
    create_table :categorias_despesas do |t|
      t.string :nome, null: false
      t.text :descricao
      t.boolean :ativo, default: true
      t.references :restaurante, null: false, foreign_key: true

      t.timestamps
    end
  end
end
