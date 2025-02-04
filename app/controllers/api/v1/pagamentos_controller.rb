class Api::V1::PagamentosController < ApplicationController
  before_action :set_pagamento, only: %i[show update destroy]

  def index
    render json: PagamentoSerializer.new(Pagamento.all)
  end

  def show
    render json: PagamentoSerializer.new(@pagamento)
  end

  def create
    pagamento = Pagamento.new(pagamento_params)
    if pagamento.save
      render json: PagamentoSerializer.new(pagamento), status: :created
    else
      render json: { errors: pagamento.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @pagamento.update(pagamento_params)
      render json: PagamentoSerializer.new(@pagamento)
    else
      render json: { errors: @pagamento.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @pagamento.destroy
    head :no_content
  end

  private

  def set_pagamento
    @pagamento = Pagamento.find(params[:id])
  end

  def pagamento_params
    params.require(:pagamento).permit(:pedido_id, :metodo, :status, :valor)
  end
end
