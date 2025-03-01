class CreateUserRestaurantes < ActiveRecord::Migration[8.0]
  def change
    create_table :user_restaurantes do |t|
      t.references :user, null: false, foreign_key: true
      t.references :restaurante, null: false, foreign_key: true
      
      t.timestamps
    end
  end
end
