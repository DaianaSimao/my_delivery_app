class ItemAcompanhamento < ApplicationRecord
  belongs_to :acompanhamento

  validates :nome, presence: true
  validates :preco, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
end
