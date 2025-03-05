class AddTrocoToPagamentos < ActiveRecord::Migration[8.0]
  def change
    add_column :pagamentos, :troco, :decimal, precision: 10, scale: 2
  end
end
