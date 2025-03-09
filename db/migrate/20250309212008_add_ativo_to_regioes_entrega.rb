class AddAtivoToRegioesEntrega < ActiveRecord::Migration[8.0]
  def change
    add_column :regioes_entregas, :ativo, :boolean
  end
end
