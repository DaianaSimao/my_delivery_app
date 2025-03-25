class Api::V1::PromocoesController < ApplicationController
  before_action :set_promocao, only: [:show, :update, :destroy]
  skip_before_action :authenticate_user!, only: [:show]

  def index
    restaurante = Restaurante.find(current_user.restaurante_ativo)
    @promocoes = Promocao.where(restaurante_id: restaurante.id)

    @promocoes =  @promocoes.page(params[:page]).per(params[:per_page])

    render json: {
      data: @promocoes,
      meta: {
        total_pages: @promocoes.total_pages,
        total_count: @promocoes.total_count,
        current_page: @promocoes.current_page
      }
    }
  end

  def show
    @promocao = Promocao.includes(:produtos).find(params[:id])
    render json: @promocao, include: [:produtos]
  end

  def create
    @promocao = Promocao.new(promocao_params)
    @promocao.restaurante_id = current_user.restaurante_ativo
    binding.pry
    if @promocao.save
      render json: @promocao, status: :created
    else
      render json: @promocao.errors, status: :unprocessable_entity
    end
  end


  def update
    if @promocao.update(promocao_params)
      render json: @promocao
    else
      render json: @promocao.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @promocao.destroy
    head :no_content
  end

  private

  def set_promocao
    @promocao = Promocao.find(params[:id])
  end

  def promocao_params
    params.require(:promocao).permit(
      :nome, :descricao, :tipo, :valor_de, :valor_para, :desconto_percentual,
      :data_inicio, :data_fim, :ativa, :restaurante_id, produto_ids: []
    )
  end
end
