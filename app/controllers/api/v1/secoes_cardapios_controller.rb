class  Api::V1::SecoesCardapiosController < ApplicationController
  before_action :set_secao, only: [:show, :update, :destroy]

  # GET /secoes_cardapio
  def index
    restaurante = current_user.restaurantes.find(current_user.restaurante_ativo)
    @secoes_cardapios = SecoesCardapio.where(restaurante_id: restaurante.id)
    if params[:search].present?
      @secoes_cardapios = @secoes_cardapios.where("nome ILIKE ?", "%#{params[:search]}%")
    end

    @secoes_cardapios = @secoes_cardapios.page(params[:page]).per(params[:per_page])

    render json: {
      data: @secoes_cardapios.as_json,
      meta: {
        total_pages: @secoes_cardapios.total_pages,
        total_count: @secoes_cardapios.total_count,
        current_page: @secoes_cardapios.current_page
      }
    }
  end

  # GET /secoes_cardapio/1
  def show
    render json: @secao
  end

  # POST /secoes_cardapio
  def create
    @secao = SecoesCardapio.new(secao_params)

    if @secao.save
      render json: @secao, status: :created
    else
      render json: @secao.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /secoes_cardapio/1
  def update
    if @secao.update(secao_params)
      render json: @secao
    else
      render json: @secao.errors, status: :unprocessable_entity
    end
  end

  # DELETE /secoes_cardapio/1
  def destroy
    @secao.destroy
    head :no_content
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_secao
    @secao = SecoesCardapio.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def secao_params
    params.require(:secao_cardapio).permit(:nome, :ordem, :restaurante_id)
  end
end