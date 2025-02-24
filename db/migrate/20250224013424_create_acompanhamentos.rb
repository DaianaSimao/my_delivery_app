class CreateAcompanhamentos < ActiveRecord::Migration[8.0]
  def change
    create_table :acompanhamentos do |t|
      t.string :nome
      t.integer :quantidade_maxima

      t.timestamps
    end
  end
end
