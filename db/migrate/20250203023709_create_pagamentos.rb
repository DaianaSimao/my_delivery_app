class CreatePagamentos < ActiveRecord::Migration[6.0]
  def change
    create_table :pagamentos do |t|
      t.references :pedido, null: false, foreign_key: true
      t.string  :metodo
      t.string  :status, default: "Pendente"
      t.decimal :valor, precision: 10, scale: 2, null: false

      t.timestamps
    end
  end
end
