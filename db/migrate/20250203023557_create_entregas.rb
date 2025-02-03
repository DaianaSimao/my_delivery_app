class CreateEntregas < ActiveRecord::Migration[6.0]
  def change
    create_table :entregas do |t|
      t.references :pedido, null: false, foreign_key: true
      t.references :entregador, foreign_key: true
      t.string :status, default: "Aguardando"

      t.timestamps
    end
  end
end
