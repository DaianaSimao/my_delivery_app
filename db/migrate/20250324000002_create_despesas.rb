class CreateDespesas < ActiveRecord::Migration[8.0]
  def change
    create_table :despesas do |t|
      t.string :descricao, null: false
      t.decimal :valor, precision: 10, scale: 2, null: false
      t.date :data, null: false
      t.string :status, default: 'Pendente'
      t.text :observacoes
      t.references :categorias_despesa, null: false, foreign_key: true
      t.references :restaurante, null: false, foreign_key: true

      t.timestamps
    end
  end
end
