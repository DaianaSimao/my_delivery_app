class ProdutoSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :restaurante_id, :nome, :descricao, :preco, :disponivel
  belongs_to :restaurante

  attribute :imagem_url do |produto|
    if produto.imagem.attached?
      Rails.application.routes.url_helpers.rails_blob_url(
        produto.imagem,
        host: Rails.application.config.active_storage.default_url_options[:host],
        port: Rails.application.config.active_storage.default_url_options[:port]
      )
    else
      produto.imagem_url
    end
  end
end
