class Api::V1::ClientesController < ApplicationController
  before_action :set_cliente, only: %i[show update buscar_cliente]
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
    render json: @cliente.as_json
  end

  def buscar_cliente
    render json: @cliente.as_json
  end

  def update
    if @cliente.update(cliente_params)
      render json: @cliente.as_json
    else
      render json: @cliente.errors, status: :unprocessable_entity
    end
  end

  def create
    @cliente = Cliente.new(cliente_params)
    if @cliente.save
      render json: @cliente, status: :created
    else
      render json: @cliente.errors, status: :unprocessable_entity
    end
  end

  private

  def set_cliente
    @cliente = Cliente.find(params[:id])
  end

  def cliente_params
    params.require(:cliente).permit(:nome, :telefone, :sobrenome, :endereco_id)
  end
end
