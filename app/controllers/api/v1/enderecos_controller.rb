class Api::V1::EnderecosController < ApplicationController
  before_action :set_endereco, only: %i[show update]
  skip_before_action :authenticate_user!, only: %i[update index show create]

  def index
    @enderecos = Endereco.where(cliente_id: params[:cliente_id])
    render json: @enderecos.as_json
  end

  def show
    render json: @endereco.as_json
  end

  def create
    params[:regioes_entrega_id] == 0 ? nil : params[:endereco][:regioes_entrega_id]
    endereco = Endereco.new(endereco_params)

    if endereco.regioes_entrega_id == 0
        endereco.regioes_entrega_id = nil
    end

    if endereco.save
      render json: endereco.as_json, status: :created
    else
      render json: { errors: endereco.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
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
    params.require(:endereco).permit(:rua, :numero, :complemento, :bairro, :cidade, :estado, :cep, :tipo, :ponto_referencia, :regioes_entrega_id)
  end
end
