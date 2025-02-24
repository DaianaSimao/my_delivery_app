class  Api::V1::AcompanhamentosController < ApplicationController
  before_action :set_acompanhamento, only: %i[ show update destroy ]

  # GET /acompanhamentos
  def index
    @acompanhamentos = Acompanhamento.all

    render json: @acompanhamentos
  end

  # GET /acompanhamentos/1
  def show
    render json: @acompanhamento
  end

  # POST /acompanhamentos
  def create
    @acompanhamento = Acompanhamento.new(acompanhamento_params)

    if @acompanhamento.save
      render json: @acompanhamento, status: :created, location: @acompanhamento
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
      @acompanhamento = Acompanhamento.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def acompanhamento_params
      params.expect(acompanhamento: [ :nome ])
    end
end
