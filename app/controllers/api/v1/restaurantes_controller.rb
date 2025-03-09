class Api::V1::RestaurantesController < ApplicationController
  before_action :set_restaurante, only: %i[show update destroy]
  skip_before_action :authenticate_user!, only: %i[show]

  def index
    @restaurantes = current_user.restaurantes
    @restaurantes =  @restaurantes.page(params[:page]).per(params[:per_page])
    render json: {
      data: @restaurantes,
      meta: {
        total_pages: @restaurantes.total_pages,
        total_count: @restaurantes.total_count,
        current_page: @restaurantes.current_page
      }
    }
  end

  def restaurantes_ativos
    @restaurantes = current_user.restaurantes.where(ativo: true).includes(:endereco)
    render json: RestauranteSerializer.new(@restaurantes).serializable_hash.to_json
  end

  def show
    @restaurante = Restaurante.includes(:endereco, :regioes_entrega).find(params[:id])
    render json: {
      data: @restaurante.as_json(include:[ :regioes_entrega,:endereco]),}
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
    params.require(:restaurante).permit(:id, :nome, :descricao, :categoria, :taxa_entrega,
                                        :tempo_medio_entrega, :avaliacao, :ativo,
                                        :abertura, :fechamento, :cnpj, :telefone, :email, :dias_funcionamento, :pedido_minimo,
                                        endereco_attributes: [:id, :rua, :numero, :complemento, :bairro, :cidade, :estado, :cep, :ponto_referencia, :tipo],
                                        regioes_entrega_attributes: [:id, :bairro, :taxa_entrega, :_destroy, :ativo, :restaurante_id]
    )
  end
end
