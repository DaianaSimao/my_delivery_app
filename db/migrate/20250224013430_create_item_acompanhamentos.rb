class CreateItemAcompanhamentos < ActiveRecord::Migration[8.0]
  def change
    create_table :item_acompanhamentos do |t|
      t.string :nome
      t.decimal :preco
      t.references :acompanhamento, null: false, foreign_key: true

      t.timestamps
    end
  end
end
