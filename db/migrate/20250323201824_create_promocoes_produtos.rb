class CreatePromocoesProdutos < ActiveRecord::Migration[8.0]
  def change
    create_table :promocoes_produtos do |t|
      t.references :promocao, null: false, foreign_key: true
      t.references :produto, null: false, foreign_key: true

      t.timestamps
    end
  end
end
