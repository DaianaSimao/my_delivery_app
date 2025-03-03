class AddTipoToEndereco < ActiveRecord::Migration[8.0]
  def change
    add_column :enderecos, :tipo, :string
  end
end
