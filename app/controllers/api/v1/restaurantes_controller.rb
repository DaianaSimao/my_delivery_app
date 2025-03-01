class Api::V1::RestaurantesController < ApplicationController
  before_action :set_restaurante, only: %i[show update destroy]

  def index
    restaurantes = current_user.restaurantes
    render json: RestauranteSerializer.new(restaurantes).serializable_hash.to_json
  end

  def show
    render json: RestauranteSerializer.new(@restaurante).serializable_hash.to_json
  end

  def create
    restaurante = Restaurante.new(restaurante_params)
    if restaurante.save
      render json: RestauranteSerializer.new(restaurante).serializable_hash.to_json, status: :created
    else
      render json: { errors: restaurante.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @restaurante.update(restaurante_params)
      render json: RestauranteSerializer.new(@restaurante).serializable_hash.to_json
    else
      render json: { errors: @restaurante.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @restaurante.destroy
    head :no_content
  end

  def switch_restaurant
    restaurante = current_user.restaurantes.find(params[:restaurante_id])
    if restaurante
      current_user.update(restaurante_ativo: restaurante.id)
      render json: { message: "Restaurante alterado com sucesso!", restaurante_ativo: restaurante }
    else
      render json: { error: "Restaurante não encontrado ou não associado ao usuário." }, status: :unprocessable_entity
    end
  end

  private

  def set_restaurante
    @restaurante = Restaurante.find(params[:id])
  end

  def restaurante_params
    params.require(:restaurante).permit(:nome, :descricao, :categoria, :taxa_entrega, :tempo_medio_entrega, :avaliacao, :ativo, :endereco_id)
  end
end
