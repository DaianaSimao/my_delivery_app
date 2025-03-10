class AddTaxaEntregaToEntregas < ActiveRecord::Migration[8.0]
  def change
    add_column :entregas, :taxa_entrega, :decimal
  end
end
