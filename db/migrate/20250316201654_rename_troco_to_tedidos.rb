class RenameTrocoToTedidos < ActiveRecord::Migration[8.0]
  def change
    rename_column :pedidos, :troco, :troco_para
  end
end
