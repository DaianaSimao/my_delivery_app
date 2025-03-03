class AddInformacoesRestaurante < ActiveRecord::Migration[8.0]
  def change
    add_column :restaurantes, :dias_funcionamento, :string
    add_column :restaurantes, :pedido_minimo, :decimal
  end
end
