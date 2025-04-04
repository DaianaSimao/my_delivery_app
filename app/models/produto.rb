class Produto < ApplicationRecord
  belongs_to :restaurante

  has_many :promocoes_produtos
  has_many :promocoes, through: :promocoes_produtos
  has_many :produto_acompanhamentos, dependent: :destroy
  has_many :acompanhamentos, through: :produto_acompanhamentos
  has_many :itens_pedidos
  has_many :produto_secoes
  has_many :secoes_cardapio, through: :produto_secoes

  has_one_attached :imagem

  accepts_nested_attributes_for :produto_acompanhamentos, allow_destroy: true
  accepts_nested_attributes_for :produto_secoes, allow_destroy: true

  def imagem_url
    return self[:imagem_url] unless imagem.attached?

    Rails.application.routes.url_helpers.rails_blob_url(
      imagem, 
      host: Rails.application.config.active_storage.default_url_options[:host],
      port: Rails.application.config.active_storage.default_url_options[:port]
    )
  end
end
