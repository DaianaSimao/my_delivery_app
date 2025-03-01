class AddRestauranteToAcompanhamentos < ActiveRecord::Migration[8.0]
  def change
    add_reference :acompanhamentos, :restaurante, null: true, foreign_key: true
  end
end
