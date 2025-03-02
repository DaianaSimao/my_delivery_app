class AddRestauranteToEntregadores < ActiveRecord::Migration[8.0]
  def change
    add_reference :entregadores, :restaurante, foreign_key: true
  end
end
