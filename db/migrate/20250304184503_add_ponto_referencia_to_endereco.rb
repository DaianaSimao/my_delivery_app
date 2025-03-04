class AddPontoReferenciaToEndereco < ActiveRecord::Migration[8.0]
  def change
    add_column :enderecos, :ponto_referencia, :string
  end
end
