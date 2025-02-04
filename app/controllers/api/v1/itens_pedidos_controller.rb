class Api::V1::ItensPedidosController < ApplicationController
  def create
    item = ItensPedido.new(itens_pedido_params)
    if item.save
      render json: item, status: :created
    else
      render json: { errors: item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def itens_pedido_params
    params.require(:itens_pedido).permit(:pedido_id, :produto_id, :quantidade, :preco_unitario)
  end
end
