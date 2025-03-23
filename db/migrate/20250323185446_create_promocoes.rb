class CreatePromocoes < ActiveRecord::Migration[8.0]
  def change
    create_table :promocoes do |t|
      t.string :nome
      t.text :descricao
      t.string :tipo
      t.decimal :valor_de
      t.decimal :valor_para
      t.decimal :desconto_percentual
      t.date :data_inicio
      t.date :data_fim
      t.boolean :ativa

      t.timestamps
    end
  end
end
