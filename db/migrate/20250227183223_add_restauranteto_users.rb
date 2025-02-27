class AddRestaurantetoUsers < ActiveRecord::Migration[8.0]
  def change
    add_reference :users, :restaurante, foreign_key: true
  end
end
