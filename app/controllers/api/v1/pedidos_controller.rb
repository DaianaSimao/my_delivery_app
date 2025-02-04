class Api::V1::PedidosController < ApplicationController
  before_action :set_pedido, only: %i[show update destroy]

  def index
    pedidos = Pedido.all
    render json: PedidoSerializer.new(pedidos)
  end

  def show
    render json: PedidoSerializer.new(@pedido)
  end

  def create
    pedido = Pedido.new(pedido_params)
    if pedido.save
      render json: PedidoSerializer.new(pedido), status: :created
    else
      render json: { errors: pedido.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @pedido.update(pedido_params)
      render json: PedidoSerializer.new(@pedido)
    else
      render json: { errors: @pedido.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @pedido.destroy
    head :no_content
  end

  private

  def set_pedido
    @pedido = Pedido.find(params[:id])
  end

  def pedido_params
    params.require(:pedido).permit(:restaurante_id, :cliente_id, :status, :forma_pagamento, :troco, :valor_total, :observacoes, :endereco_id)
  end
end
