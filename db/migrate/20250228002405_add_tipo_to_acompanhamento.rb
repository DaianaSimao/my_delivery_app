class AddTipoToAcompanhamento < ActiveRecord::Migration[8.0]
  def change
    add_column :acompanhamentos, :tipo, :string
  end
end
