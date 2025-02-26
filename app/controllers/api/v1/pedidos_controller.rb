class Api::V1::PedidosController < ApplicationController
  before_action :set_pedido, only: %i[show update destroy]

  def index
    @pedidos = Pedido.includes(:cliente, :endereco, :itens_pedidos, :produtos, :pagamento).all
    render json: {
      data: @pedidos.as_json(
        include: {
          cliente: {
            only: %i[id nome telefone]
          },
          endereco: {
            only: %i[id rua numero bairro cidade estado cep]
          },
          itens_pedidos: {
            only: %i[id quantidade preco_total],
            include: {
              produto: {
                only: %i[id nome preco],
                include: {
                  acompanhamentos: {
                    only: %i[id nome quantidade_maxima],
                    include: {
                      item_acompanhamentos: {
                        only: %i[id nome preco]
                      }
                    }
                  }
                }
              }
            }
          },
          pagamento: {
            only: %i[id metodo status valor]
          }
        }
      )
    }
  end

  def show
    pedido = Pedido.includes(:cliente, :endereco, :itens_pedidos, :produtos, :pagamento).find(params[:id])

    render json: {
      data: pedido.as_json(
        include: {
          cliente: {
            only: %i[id nome telefone]
          },
          endereco: {
            only: %i[id rua numero bairro cidade estado cep]
          },
          itens_pedidos: {
            only: %i[id quantidade preco_total],
            include: {
              produto: {
                only: %i[id nome preco],
                include: {
                  acompanhamentos: {
                    only: %i[id nome quantidade_maxima],
                    include: {
                      itens_acompanhamentos: {
                        only: %i[id nome preco]
                      }
                    }
                  }
                }
              }
            }
          },
          pagamento: {
            only: %i[id metodo status valor]
          }
        }
      )
    }
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
      @pedido = Pedido.includes(:cliente, :endereco, :itens_pedidos, :produtos, :pagamento).find(@pedido.id)
      # Renderiza o JSON seguindo o mesmo padrão do `index`
      render json: {
        data: @pedido.as_json(
          include: {
            cliente: {
              only: %i[id nome telefone]
            },
            endereco: {
              only: %i[id rua numero bairro cidade estado cep]
            },
            itens_pedidos: {
              only: %i[id quantidade preco_total],
              include: {
                produto: {
                  only: %i[id nome preco],
                  include: {
                    acompanhamentos: {
                      only: %i[id nome quantidade_maxima],
                      include: {
                        item_acompanhamentos: {
                          only: %i[id nome preco]
                        }
                      }
                    }
                  }
                }
              }
            },
            pagamento: {
              only: %i[id metodo status valor]
            }
          }
        )
      }
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
