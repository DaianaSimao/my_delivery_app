class Api::V1::PedidosController < ApplicationController
  before_action :set_pedido, only: %i[show update destroy itens atualizar_itens]
  skip_before_action :authenticate_user!, only: %i[create]

  def index
    hoje = Time.now
    inicio_intervalo = (hoje - 3.hours).beginning_of_day + 3.hours
    fim_intervalo = (hoje - 3.hours).end_of_day + 3.hours
    restaurante = current_user.restaurantes.find(current_user.restaurante_ativo)

    @pedidos = Pedido.includes(:cliente, :itens_pedidos, :produtos, :pagamento).all.order(updated_at: :desc).where(restaurante_id: restaurante.id, created_at: inicio_intervalo..fim_intervalo)

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
            only: %i[id nome telefone endereco_id sobrenome],
            include: {
              endereco: {
                only: %i[id rua numero bairro cidade estado cep regiao_entrega_id ponto_referencia tipo complemento]
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

  def listar_pedidos
    restaurante = current_user.restaurantes.find(current_user.restaurante_ativo)

    @pedidos = Pedido.includes(:cliente, :itens_pedidos, :produtos, :pagamento)
                      .where(restaurante_id: restaurante.id)
                      .order(created_at: :desc)

    # Filtros
    if params[:cliente_nome].present?
      @pedidos = @pedidos.joins(:cliente).where("clientes.nome ILIKE ?", "%#{params[:cliente_nome]}%")
    end

    if params[:pedido_id].present?
      @pedidos = @pedidos.where(id: params[:pedido_id])
    end

    if params[:status].present?
      @pedidos = @pedidos.where(status: params[:status])
    end

    # Filtro de data (range)
    if params[:data_inicio].present? && params[:data_fim].present?
      data_inicio = Date.parse(params[:data_inicio])
      data_fim = Date.parse(params[:data_fim]).end_of_day
      @pedidos = @pedidos.where(created_at: data_inicio..data_fim)
    end

    # Paginação
    @pedidos = @pedidos.page(params[:page] || 1).per(params[:per_page] || 10)

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
      ),
      meta: {
        total_pages: @pedidos.total_pages,
        total_count: @pedidos.total_count,
        current_page: @pedidos.current_page
      }
    }
  end

  # GET /api/v1/pedidos/:id/itens
  def itens
    itens_pedido = @pedido.itens_pedidos.includes(:produto, :acompanhamentos_pedidos)
    render json: itens_pedido, include: [:produto, acompanhamentos_pedidos: { include: :item_acompanhamento }]
  end

  # PUT /api/v1/pedidos/:id/itens
  def atualizar_itens
    itens_params = params.require(:itens).map do |item|
      item.permit(:id, :quantidade, acompanhamentos_pedidos_attributes: [:id, :quantidade])
    end

    ActiveRecord::Base.transaction do
      if @pedido.update(itens_pedidos_attributes: itens_params)
        novo_valor_total = @pedido.itens_pedidos.sum do |item|
          valor_item = item.quantidade * item.produto.preco
          valor_acompanhamentos = item.acompanhamentos_pedidos.sum do |acomp|
            acomp.quantidade * acomp.preco_unitario
          end
          taxa_entrega = @pedido.taxa_entrega || 0

          valor_item + valor_acompanhamentos + taxa_entrega
        end

        @pedido.update!(valor_total: novo_valor_total)

        if @pedido.pagamento
          if @pedido.pagamento.metodo == "Dinheiro"
            diferenca = @pedido.pagamento.valor - novo_valor_total
            if diferenca > 0
              novo_troco = @pedido.pagamento.troco - diferenca
              @pedido.pagamento.update!(troco: novo_troco, valor: novo_valor_total)
            else
              @pedido.pagamento.update!(valor: novo_valor_total)
            end
          end
        end

        render json: @pedido, status: :ok
      else
        render json: { errors: @pedido.errors.full_messages }, status: :unprocessable_entity
        raise ActiveRecord::Rollback
      end
    end
  rescue => e
    render json: { error: "Erro ao atualizar pedido: #{e.message}" }, status: :internal_server_error
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
      :restaurante_id, :status, :forma_pagamento, :troco_para, :valor_total, :observacoes, :cliente_id, :forma_entrega,
      pagamento_attributes: [ :metodo, :status, :valor, :troco ],
      itens_pedidos_attributes: [ :id, :quantidade, :preco_unitario, :produto_id, :observacao, :_destroy, acompanhamentos_pedidos_attributes: [ :id, :quantidade, :preco_unitario, :item_acompanhamento_id, :_destroy ] ])
  end
end
