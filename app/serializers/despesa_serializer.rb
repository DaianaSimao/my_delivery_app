class DespesaSerializer < ActiveModel::Serializer
  attributes :id, :descricao, :valor, :data, :status, :observacoes, :categoria_despesa_id, :restaurante_id, :created_at, :updated_at

  belongs_to :restaurante
  belongs_to :categoria_despesa
end
