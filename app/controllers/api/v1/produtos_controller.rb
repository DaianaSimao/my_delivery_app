class Api::V1::ProdutosController < ApplicationController
  before_action :set_produto, only: %i[show update destroy]

  def index
    @produtos = Produto.all

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

  def show
    render json: ProdutoSerializer.new(@produto)
  end

  def create
    produto = Produto.new(produto_params)
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
    :disponivel, :restaurante_id, produto_acompanhamentos_attributes: [ :acompanhamento_id ])
  end
end
