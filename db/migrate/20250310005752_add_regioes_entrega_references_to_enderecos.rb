class AddRegioesEntregaReferencesToEnderecos < ActiveRecord::Migration[8.0]
  def change
    add_reference :enderecos, :regioes_entrega, foreign_key: true
  end
end
