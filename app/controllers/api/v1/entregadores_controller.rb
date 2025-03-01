class Api::V1::EntregadoresController < ApplicationController
  before_action :set_entregador, only: %i[show update destroy]

  def index
    restaurante = current_user.restaurantes.find(params[:restaurante_id])
    @entregadores = Entregador.where(restaurante_id: restaurante.id)
    render json: @entregadores.as_json
  end

  def show
    render json: EntregadorSerializer.new(@entregador)
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
    params.require(:entregador).permit(:nome, :telefone, :veiculo, :ativo)
  end
end
