class Api::V1::EntregadoresController < ApplicationController
  before_action :set_entregador, only: %i[show update destroy]

  def index
    restaurante = Restaurante.find(current_user.restaurante_ativo)
    @entregadores = Entregador.where(restaurante_id: restaurante.id)
    @entregadores =  @entregadores.page(params[:page]).per(params[:per_page])
    render json: {
      data: @entregadores,
      meta: {
        total_pages: @entregadores.total_pages,
        total_count: @entregadores.total_count,
        current_page: @entregadores.current_page
      }
    }
  end

  def listar_entregadores
    restaurante = Restaurante.find(current_user.restaurante_ativo)
    @entregadores = Entregador.where(restaurante_id: restaurante.id)
    render json: @entregadores.as_json
  end

  def show
    render json: @entregador.as_json
  end

  def create
    entregador = Entregador.new(entregador_params)
    if entregador.save
      render json: EntregadorSerializer.new(entregador), status: :created
    else
      render json: { errors: entregador.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @entregador.update(entregador_params)
      render json: EntregadorSerializer.new(@entregador)
    else
      render json: { errors: @entregador.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @entregador.destroy
    head :no_content
  end

  private

  def set_entregador
    @entregador = Entregador.find(params[:id])
  end

  def entregador_params
    params.require(:entregador).permit(:nome, :telefone, :veiculo, :ativo, :placa, :restaurante_id)
  end
end
