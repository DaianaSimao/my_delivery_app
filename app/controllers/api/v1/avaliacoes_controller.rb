class Api::V1::AvaliacoesController < ApplicationController
  def create
    avaliacao = Avaliacao.new(avaliacao_params)
    if avaliacao.save
      render json: avaliacao, status: :created
    else
      render json: { errors: avaliacao.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def avaliacao_params
    params.require(:avaliacao).permit(:pedido_id, :nota, :comentario)
  end
end
