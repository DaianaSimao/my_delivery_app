class CreateBairro < ActiveRecord::Migration[8.0]
  def change
    create_table :bairros do |t|
      t.string :uf
      t.string :nome
      t.string :cidade

      t.timestamps
    end
  end
end
