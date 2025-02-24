class  Api::V1::ProdutoAcompanhamentosController < ApplicationController
  before_action :set_produto_acompanhamento, only: %i[ show update destroy ]

  # GET /produto_acompanhamentos
  def index
    @produto_acompanhamentos = ProdutoAcompanhamento.all

    render json: @produto_acompanhamentos
  end

  # GET /produto_acompanhamentos/1
  def show
    render json: @produto_acompanhamento
  end

  # POST /produto_acompanhamentos
  def create
    @produto_acompanhamento = ProdutoAcompanhamento.new(produto_acompanhamento_params)

    if @produto_acompanhamento.save
      render json: @produto_acompanhamento, status: :created, location: @produto_acompanhamento
    else
      render json: @produto_acompanhamento.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /produto_acompanhamentos/1
  def update
    if @produto_acompanhamento.update(produto_acompanhamento_params)
      render json: @produto_acompanhamento
    else
      render json: @produto_acompanhamento.errors, status: :unprocessable_entity
    end
  end

  # DELETE /produto_acompanhamentos/1
  def destroy
    @produto_acompanhamento.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_produto_acompanhamento
      @produto_acompanhamento = ProdutoAcompanhamento.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def produto_acompanhamento_params
      params.expect(produto_acompanhamento: [ :produto_id, :acompanhamento_id, :quantidade_maxima ])
    end
end
