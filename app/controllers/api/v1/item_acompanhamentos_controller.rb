class  Api::V1::ItemAcompanhamentosController < ApplicationController
  before_action :set_item_acompanhamento, only: %i[ show update destroy ]

  # GET /item_acompanhamentos
  def index
    @item_acompanhamentos = ItemAcompanhamento.all

    render json: @item_acompanhamentos
  end

  # GET /item_acompanhamentos/1
  def show
    render json: @item_acompanhamento
  end

  # POST /item_acompanhamentos
  def create
    @item_acompanhamento = ItemAcompanhamento.new(item_acompanhamento_params)

    if @item_acompanhamento.save
      render json: @item_acompanhamento, status: :created, location: @item_acompanhamento
    else
      render json: @item_acompanhamento.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /item_acompanhamentos/1
  def update
    if @item_acompanhamento.update(item_acompanhamento_params)
      render json: @item_acompanhamento
    else
      render json: @item_acompanhamento.errors, status: :unprocessable_entity
    end
  end

  # DELETE /item_acompanhamentos/1
  def destroy
    @item_acompanhamento.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_item_acompanhamento
      @item_acompanhamento = ItemAcompanhamento.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def item_acompanhamento_params
      params.expect(item_acompanhamento: [ :nome, :acompanhamentos_id ])
    end
end
