class Api::V1::ProdutosController < ApplicationController
  before_action :set_produto, only: %i[show update destroy]
  skip_before_action :authenticate_user!, only: %i[cardapio show]

  def index
    restaurante = current_user.restaurantes.find(current_user.restaurante_ativo)
    @produtos = Produto.where(restaurante_id: restaurante.id)

    # Filtra os produtos com base no termo de busca
    if params[:search].present?
      @produtos = @produtos.where("nome ILIKE ?", "%#{params[:search]}%")
    end

    @produtos =  @produtos.page(params[:page]).per(params[:per_page])
    render json: {
      data: @produtos,
      meta: {
        total_pages: @produtos.total_pages,
        total_count: @produtos.total_count,
        current_page: @produtos.current_page
      }
    }
  end

  def cardapio
    restaurante = Restaurante.find(params[:restaurante_id])
    @produtos = Produto.includes(produto_acompanhamentos: { acompanhamento: :item_acompanhamentos }).where(restaurante_id: restaurante.id, disponivel: true)

    # Filtra os produtos com base no termo de busca
    if params[:search].present?
      @produtos = @produtos.where("nome ILIKE ?", "%#{params[:search]}%")
    end

    render json: {
      data: @produtos.as_json(
      include: {
          produto_acompanhamentos: {
            include: {
              acompanhamento: {
                include: :item_acompanhamentos
              }
            }
          }
        }
      )
    }
  end

  def show
    produto = Produto.includes(produto_acompanhamentos: { acompanhamento: :item_acompanhamentos }).find(params[:id])
    render json: {
      data: produto.as_json(
        include: {
          produto_acompanhamentos: {
            include: {
              acompanhamento: {
                include: :item_acompanhamentos
              }
            }
          }
        }
      )
    }
  end

  def create
    produto = Produto.new(produto_params)
    produto.restaurante_id = current_user.restaurantes.find(current_user.restaurante_ativo).id

    if produto.save
      render json: ProdutoSerializer.new(produto), status: :created
    else
      render json: { errors: produto.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @produto.update(produto_params)
      render json: ProdutoSerializer.new(@produto)
    else
      render json: { errors: @produto.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @produto.destroy
    head :no_content
  end

  private

  def set_produto
    @produto = Produto.find(params[:id])
  end

  def produto_params
    params.require(:produto).permit(:nome, :descricao, :preco, :imagem_url,
    :disponivel, :restaurante_id, produto_acompanhamentos_attributes: [ :id, :acompanhamento_id, :_destroy ])
  end
end
