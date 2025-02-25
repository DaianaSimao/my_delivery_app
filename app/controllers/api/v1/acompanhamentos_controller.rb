class  Api::V1::AcompanhamentosController < ApplicationController
  before_action :set_acompanhamento, only: %i[ show update destroy ]

  # GET /acompanhamentos
  def index
    @acompanhamentos = Acompanhamento.includes(:item_acompanhamentos) # Carrega os itens de acompanhamento
    # Filtra os acompanhamentos com base no termo de busca
    if params[:search].present?
      @acompanhamentos = @acompanhamentos.where("nome ILIKE ?", "%#{params[:search]}%")
    end

    @acompanhamentos = @acompanhamentos.page(params[:page]).per(params[:per_page])

    render json: {
      data: @acompanhamentos.as_json(include: :item_acompanhamentos), # Inclui os itens de acompanhamento
      meta: {
        total_pages: @acompanhamentos.total_pages,
        total_count: @acompanhamentos.total_count,
        current_page: @acompanhamentos.current_page
      }
    }
  end

  # GET /acompanhamentos/1
  def show
    acompanhamento = Acompanhamento.includes(:item_acompanhamentos).find(params[:id])
    render json: {
      data: acompanhamento.as_json(include: :item_acompanhamentos)
    }
  end

  # POST /acompanhamentos
  def create
    @acompanhamento = Acompanhamento.new(acompanhamento_params)

    if @acompanhamento.save
      render json: @acompanhamento, status: :created
    else
      render json: @acompanhamento.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /acompanhamentos/1
  def update
    if @acompanhamento.update(acompanhamento_params)
      render json: @acompanhamento
    else
      render json: @acompanhamento.errors, status: :unprocessable_entity
    end
  end

  # DELETE /acompanhamentos/1
  def destroy
    @acompanhamento.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_acompanhamento
      @acompanhamento = Acompanhamento.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def acompanhamento_params
      params.require(:acompanhamento).permit(
        :nome,
        :quantidade_maxima,
        item_acompanhamentos_attributes: [ :id, :nome, :preco, :_destroy ]
      )
    end
end
