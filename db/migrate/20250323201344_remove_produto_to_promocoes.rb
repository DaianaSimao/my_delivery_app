class RemoveProdutoToPromocoes < ActiveRecord::Migration[8.0]
  def change
    remove_column :promocoes, :produto_id, :bigint
  end
end
