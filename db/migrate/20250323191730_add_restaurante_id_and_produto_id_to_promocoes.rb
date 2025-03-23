class AddRestauranteIdAndProdutoIdToPromocoes < ActiveRecord::Migration[8.0]
  def change
    add_column :promocoes, :restaurante_id, :integer
    add_column :promocoes, :produto_id, :integer
  end
end
