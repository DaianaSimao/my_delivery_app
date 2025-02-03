class CreateAvaliacoes < ActiveRecord::Migration[6.0]
  def change
    create_table :avaliacoes do |t|
      t.references :pedido, null: false, foreign_key: true
      t.decimal    :nota, precision: 3, scale: 2, null: false, default: 0.0
      t.text       :comentario

      t.timestamps
    end
  end
end
