class Api::V1::PedidosController < ApplicationController
  before_action :set_pedido, only: %i[show update destroy]
  skip_before_action :authenticate_user!, only: %i[create]

  def index
    hoje = Time.now
    inicio_intervalo = (hoje - 3.hours).beginning_of_day + 3.hours
    fim_intervalo = (hoje - 3.hours).end_of_day + 3.hours
    restaurante = current_user.restaurantes.find(current_user.restaurante_ativo)

    @pedidos = Pedido.includes(:cliente, :itens_pedidos, :produtos, :pagamento).all.order(updated_at: :desc).where(restaurante_id: restaurante.id)
    binding.pry 
    @pedidos = @pedidos.where(created_at: inicio_intervalo..fim_intervalo)

    if params[:search].present?
      @pedidos = @pedidos.joins(:cliente).where("clientes.nome ILIKE ?", "%#{params[:search]}%")
    end

    if params[:pedido_id].present?
      @pedidos = @pedidos.where(id: params[:pedido_id])
    end

    render json: {
      data: @pedidos.as_json(
        include: {
          cliente: {
            only: %i[id nome telefone endereco_id],
            include: {
              endereco: {
                only: %i[id rua numero bairro cidade estado cep]
              }
            }
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
              },
              acompanhamentos_pedidos: {
                only: %i[quantidade preco_unitario],
                include: {
                  item_acompanhamento: {
                    only: %i[id nome quantidade_maxima],
                    include: {
                      acompanhamento: {
                        only: %i[id nome quantidade_maxima]
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
    pedido = Pedido.includes(:cliente, :itens_pedidos, :produtos, :pagamento).find(params[:id])

    render json: {
      data: pedido.as_json(
        include: {
          cliente: {
            only: %i[id nome telefone],
            include: {
              endereco: {
                only: %i[id rua numero bairro cidade estado cep]
              }
            }
          },
          itens_pedidos: {
            only: %i[id quantidade preco_total],
            include: {
              produto: {
                only: %i[id nome preco] },
              acompanhamentos_pedidos: {
                only: %i[quantidade preco_unitario],
                include: {
                  item_acompanhamento: {
                    only: %i[id nome quantidade_maxima],
                    include: {
                      acompanhamento: {
                        only: %i[id nome quantidade_maxima]
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
    @pedido = Pedido.new(pedido_params)

    if @pedido.save
      @pedido = Pedido.includes(:cliente, :itens_pedidos, :produtos, :pagamento).find(@pedido.id)
      render json: {
        data: @pedido.as_json(
          include: {
            cliente: {
              only: %i[id nome telefone],
              endereco: {
                only: %i[id rua numero bairro cidade estado cep]
              }
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
                },
                acompanhamentos_pedidos: {
                  only: %i[quantidade preco_unitario],
                  include: {
                    item_acompanhamento: {
                      only: %i[id nome quantidade_maxima],
                      include: {
                        acompanhamento: {
                          only: %i[id nome quantidade_maxima]
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

  def update
    if @pedido.update(pedido_params)
      @pedido = Pedido.includes(:cliente, :itens_pedidos, :produtos, :pagamento).find(@pedido.id)
      render json: {
        data: @pedido.as_json(
          include: {
            cliente: {
              only: %i[id nome telefone],
              endereco: {
                only: %i[id rua numero bairro cidade estado cep]
              }
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
                },
                acompanhamentos_pedidos: {
                  only: %i[quantidade preco_unitario],
                  include: {
                    item_acompanhamento: {
                      only: %i[id nome quantidade_maxima],
                      include: {
                        acompanhamento: {
                          only: %i[id nome quantidade_maxima]
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
    params.require(:pedido).permit(
      :restaurante_id, :status, :forma_pagamento, :troco, :valor_total, :observacoes, :cliente_id, :forma_entrega,
      pagamento_attributes: [ :metodo, :status, :valor, :troco ],
      itens_pedidos_attributes: [ :id, :quantidade, :preco_unitario, :produto_id, :observacao, :_destroy, acompanhamentos_pedidos_attributes: [ :id, :quantidade, :preco_unitario, :item_acompanhamento_id, :_destroy ] ])
  end
end
