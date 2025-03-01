class AddActiveRestauranteToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :restaurante_ativo, :integer
  end
end
