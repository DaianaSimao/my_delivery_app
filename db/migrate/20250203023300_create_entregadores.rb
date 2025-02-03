class CreateEntregadores < ActiveRecord::Migration[6.0]
  def change
    create_table :entregadores do |t|
      t.string  :nome, null: false
      t.string  :telefone, null: false, unique: true
      t.string  :veiculo
      t.boolean :ativo, default: true

      t.timestamps
    end
  end
end
