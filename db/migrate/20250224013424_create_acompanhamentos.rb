class CreateAcompanhamentos < ActiveRecord::Migration[8.0]
  def change
    create_table :acompanhamentos do |t|
      t.string :nome

      t.timestamps
    end
  end
end
