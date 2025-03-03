class AddEnderecoToClientes < ActiveRecord::Migration[8.0]
  def change
    add_reference :clientes, :endereco, foreign_key: true
  end
end
