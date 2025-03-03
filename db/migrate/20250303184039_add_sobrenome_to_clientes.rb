class AddSobrenomeToClientes < ActiveRecord::Migration[8.0]
  def change
    add_column :clientes, :sobrenome, :string
  end
end
