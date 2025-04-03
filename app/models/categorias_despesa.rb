class CategoriasDespesa < ApplicationRecord
  belongs_to :restaurante
  has_many :despesas, dependent: :restrict_with_error

  validates :nome, presence: true
  validates :restaurante_id, presence: true

  scope :ativas, -> { where(ativo: true) }
end
