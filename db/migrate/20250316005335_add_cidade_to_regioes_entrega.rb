class AddCidadeToRegioesEntrega < ActiveRecord::Migration[8.0]
  def change
    add_column :regioes_entregas, :cidade, :string
  end
end
