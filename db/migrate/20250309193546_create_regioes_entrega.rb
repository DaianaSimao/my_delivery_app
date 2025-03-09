class CreateRegioesEntrega < ActiveRecord::Migration[8.0]
  def change
    create_table :regioes_entregas do |t|
      t.integer :restaurante_id
      t.string :bairro
      t.decimal :taxa_entrega

      t.timestamps
    end
  end
end
