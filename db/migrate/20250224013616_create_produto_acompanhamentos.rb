class CreateProdutoAcompanhamentos < ActiveRecord::Migration[8.0]
  def change
    create_table :produto_acompanhamentos do |t|
      t.references :produto, null: false, foreign_key: true
      t.references :acompanhamento, null: false, foreign_key: true

      t.timestamps
    end
  end
end
