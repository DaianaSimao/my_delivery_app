class Despesa < ApplicationRecord
  belongs_to :restaurante
  belongs_to :categorias_despesa

  validates :descricao, presence: true
  validates :valor, presence: true, numericality: { greater_than: 0 }
  validates :data, presence: true
  validates :categorias_despesa_id, presence: true
  validates :restaurante_id, presence: true

  scope :por_periodo, ->(data_inicio, data_fim) { where(data: data_inicio..data_fim) }
  scope :por_categoria, ->(categoria_id) { where(categoria_despesa_id: categoria_id) }
  scope :pendentes, -> { where(status: "Pendente") }
  scope :pagas, -> { where(status: "Paga") }
  scope :canceladas, -> { where(status: "Cancelada") }
end
