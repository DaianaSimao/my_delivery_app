class Api::V1::ClientesController < ApplicationController
  before_action :set_cliente, only: %i[show update]
  skip_before_action :authenticate_user!
  def index
    @cliente = Cliente.find_by(telefone: params[:whatsapp])
    render json: @cliente.as_json
  end

  def endereco
    @endereco = Endereco.find(params[:endereco_id])
    render json: @endereco.as_json
  end

  def show
    @cliente = Cliente.find_by(telefone: params[:telefone])
    render json: @cliente
  end

  def update
    if @cliente.update(cliente_params)
      render json: @cliente
    else
      render json: @cliente.errors, status: :unprocessable_entity
    end
  end

  private

  def set_cliente
    @cliente = Cliente.find(params[:id])
  end

  def cliente_params
    params.require(:cliente).permit(:nome, :telefone, :sobrenome)
  end
end
