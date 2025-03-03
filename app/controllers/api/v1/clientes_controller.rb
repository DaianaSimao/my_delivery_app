class Api::V1::ClientesController < ApplicationController
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

  private

  def cliente_params
    params.require(:cliente).permit(:nome, :telefone, :sobrenome)
  end
end
