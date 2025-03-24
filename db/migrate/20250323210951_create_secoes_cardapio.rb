class CreateSecoesCardapio < ActiveRecord::Migration[8.0]
  def change
    create_table :secoes_cardapios do |t|
      t.string :nome
      t.references :restaurante, null: false, foreign_key: true
      t.string :ordem

      t.timestamps
    end
  end
end
