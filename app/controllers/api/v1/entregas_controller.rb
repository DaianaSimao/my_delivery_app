class Api::V1::EntregasController < ApplicationController
  before_action :set_entrega, only: %i[show update destroy]

  def index
    render json: EntregaSerializer.new(Entrega.all)
  end

  def show
    render json: EntregaSerializer.new(@entrega)
  end

  def create
    entrega = Entrega.new(entrega_params)
    if entrega.save
      render json: EntregaSerializer.new(entrega), status: :created
    else
      render json: { errors: entrega.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @entrega.update(entrega_params)
      render json: EntregaSerializer.new(@entrega)
    else
      render json: { errors: @entrega.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @entrega.destroy
    head :no_content
  end

  private

  def set_entrega
    @entrega = Entrega.find(params[:id])
  end

  def entrega_params
    params.require(:entrega).permit(:pedido_id, :entregador_id, :status)
  end
end
