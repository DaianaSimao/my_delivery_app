class CategoriaDespesaSerializer
  include FastJsonapi::ObjectSerializer

  attributes :id, :nome, :descricao, :ativo, :restaurante_id, :created_at, :updated_at

  belongs_to :restaurante
  has_many :despesas
end
