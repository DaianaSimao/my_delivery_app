class AddUfToEndereco < ActiveRecord::Migration[8.0]
  def change
    add_column :enderecos, :uf, :string
  end
end
