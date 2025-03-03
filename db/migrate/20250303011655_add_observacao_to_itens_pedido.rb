class AddObservacaoToItensPedido < ActiveRecord::Migration[8.0]
  def change
    add_column :itens_pedidos, :observacao, :string
  end
end
