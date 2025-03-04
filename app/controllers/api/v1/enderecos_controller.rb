class Api::V1::EnderecosController < ApplicationController
  before_action :set_endereco, only: %i[show update]
  skip_before_action :authenticate_user!, only: %i[update index show]
  def index
    @enderecos = Endereco.where(cliente_id: params[:cliente_id])
    render json: @enderecos.as_json
  end

  def show
    render json: @endereco.as_json
  end

  def create
    endereco = Endereco.new(endereco_params)
    if endereco.save
      render json: EnderecoSerializer.new(endereco), status: :created
    else
      render json: { errors: endereco.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    binding.pry
    if @endereco.update(endereco_params)
      render json: @endereco.as_json
    else
      render json: { errors: @endereco.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @endereco.destroy
    head :no_content
  end

  private

  def set_endereco
    @endereco = Endereco.find(params[:id])
  end

  def endereco_params
    params.require(:endereco).permit(:rua, :numero, :complemento, :bairro, :cidade, :estado, :cep, :tipo, :ponto_referencia)
  end
end
