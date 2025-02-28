class AcompanhamentosPedidosController < ApplicationController
  before_action :set_acompanhamentos_pedido, only: %i[ show update destroy ]

  # GET /acompanhamentos_pedidos
  def index
    @acompanhamentos_pedidos = AcompanhamentosPedido.all

    render json: @acompanhamentos_pedidos
  end

  # GET /acompanhamentos_pedidos/1
  def show
    render json: @acompanhamentos_pedido
  end

  # POST /acompanhamentos_pedidos
  def create
    @acompanhamentos_pedido = AcompanhamentosPedido.new(acompanhamentos_pedido_params)

    if @acompanhamentos_pedido.save
      render json: @acompanhamentos_pedido, status: :created, location: @acompanhamentos_pedido
    else
      render json: @acompanhamentos_pedido.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /acompanhamentos_pedidos/1
  def update
    if @acompanhamentos_pedido.update(acompanhamentos_pedido_params)
      render json: @acompanhamentos_pedido
    else
      render json: @acompanhamentos_pedido.errors, status: :unprocessable_entity
    end
  end

  # DELETE /acompanhamentos_pedidos/1
  def destroy
    @acompanhamentos_pedido.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_acompanhamentos_pedido
      @acompanhamentos_pedido = AcompanhamentosPedido.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def acompanhamentos_pedido_params
      params.expect(acompanhamentos_pedido: [ :item_acompanhamento_id, :itens_pedido_id, :quantidade, :preco_unitario ])
    end
end
