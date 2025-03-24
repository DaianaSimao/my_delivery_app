class CreateProdutoSecoes < ActiveRecord::Migration[8.0]
  def change
    create_table :produto_secoes do |t|
      t.references :produto, null: false, foreign_key: true
      t.references :secoes_cardapio, null: false, foreign_key: true

      t.timestamps
    end
  end
end
