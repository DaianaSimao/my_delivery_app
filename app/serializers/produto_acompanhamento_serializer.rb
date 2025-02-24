class ProdutoAcompanhamentoSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :produto_id, :acompanhamento_id
  belongs_to :produto
  belongs_to :acompanhamento
end
