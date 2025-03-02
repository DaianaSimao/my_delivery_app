class AddColumnsToRestaurante < ActiveRecord::Migration[8.0]
  def change
    add_column :restaurantes, :abertura, :time
    add_column :restaurantes, :fechamento, :time
    add_column :restaurantes, :cnpj, :string
    add_column :restaurantes, :telefone, :string
    add_column :restaurantes, :email, :string
  end
end
