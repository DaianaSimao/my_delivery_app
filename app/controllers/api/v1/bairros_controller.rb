# app/controllers/api/v1/bairros_controller.rb
class Api::V1::BairrosController < ApplicationController
  def index
    cidade = params[:cidade]
    uf = params[:uf]
    bairros = Bairro.where(cidade: cidade, uf: uf).order(:nome)
    render json: bairros
  end

  def cidades
    uf = params[:uf]
    cidades = Bairro.where(uf: uf.upcase).distinct.order(:cidade).pluck(:cidade)
    render json: cidades
  end
end
