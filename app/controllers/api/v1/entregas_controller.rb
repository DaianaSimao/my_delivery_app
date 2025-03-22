class Api::V1::EntregasController < ApplicationController
  before_action :set_entrega, only: %i[show update destroy]

  def index
    hoje = Time.now
    inicio_intervalo = (hoje - 3.hours).beginning_of_day + 3.hours
    fim_intervalo = (hoje - 3.hours).end_of_day + 3.hours

    restaurante = current_user.restaurantes.find(current_user.restaurante_ativo)
    @entregas = Entrega.includes(:pedido, :entregador).where(pedidos: { restaurante_id: restaurante.id }, created_at: inicio_intervalo..fim_intervalo)

    if params[:entregador_nome].present?
      @entregas = @entregas.joins(:entregador
      ).where(
        "entregadores.nome ILIKE :entregador_nome",
        entregador_nome: "%#{params[:entregador_nome]}%"
      )
    end


    if params[:pedido_id].present?
      @entregas = @entregas.where(pedido_id: params[:pedido_id])
    end

    if params[:search].present?
      @entregas = @entregas.joins(pedido: :cliente
      ).where("clientes.nome ILIKE :search ",
              search: "%#{params[:search]}%")
    end

    render json: @entregas.as_json(
      include: {
        pedido: {
          only: %i[id status forma_pagamento valor_total observacoes],
          include: {
            cliente: {
              only: %i[id nome email telefone endereco_id],
              include: {
                endereco: {
                  only: %i[id rua numero bairro cidade estado cep]
                }
              }
            }
          }
        },
        entregador: {
          only: %i[id nome telefone veiculo]
        }
      }
    )
  end

  def listar_entregas
    restaurante = current_user.restaurantes.find(current_user.restaurante_ativo)
    @entregas = Entrega.includes(:pedido, :entregador).where(pedidos: { restaurante_id: restaurante.id }).order(created_at: :desc)

    if params[:entregador_nome].present?
      @entregas = @entregas.joins(:entregador
      ).where(
        "entregadores.nome ILIKE :entregador_nome",
        entregador_nome: "%#{params[:entregador_nome]}%"
      )
    end


    if params[:entrega_id].present?
      @entregas = @entregas.find(params[:pedido_id])
    end

    if params[:search].present?
      @entregas = @entregas.joins(pedido: :cliente
      ).where("clientes.nome ILIKE :search ",
              search: "%#{params[:search]}%")
    end

    if params[:status].present?
      @entregas = @entregas.where(status: params[:status])
    end

    # Filtro de data (range)
    if params[:data_inicio].present? && params[:data_fim].present?
      data_inicio = Date.parse(params[:data_inicio])
      data_fim = Date.parse(params[:data_fim]).end_of_day
      @entregas = @entregas.where(created_at: data_inicio..data_fim)
    end

    @entregas = @entregas.page(params[:page] || 1).per(params[:per_page] || 10)

    render json: {
      data: @entregas.as_json(
        include: {
          pedido: {
            only: %i[id status forma_pagamento valor_total observacoes],
            include: {
              cliente: {
                only: %i[id nome email telefone endereco_id],
                include: {
                  endereco: {
                    only: %i[id rua numero bairro cidade estado cep]
                  }
                }
              }
            }
          },
          entregador: {
            only: %i[id nome telefone veiculo]
          }
        }
      ),
      meta: {
        total_pages: @entregas.total_pages,
        total_count: @entregas.total_count,
        current_page: @entregas.current_page
      }
    }
  end

  def show
    render json: EntregaSerializer.new(@entrega)
  end

  def create
    entrega = Entrega.new(entrega_params)
    if entrega.save
      render json: EntregaSerializer.new(entrega), status: :created
    else
      render json: { errors: entrega.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    status_antigo = @entrega.status

    if @entrega.update(entrega_params)
      if status_antigo != @entrega.status # Verifica se o status mudou
        case @entrega.status
        when "Entregue"
          @entrega.pedido.update(status: "Entregue")
        when "Em entrega"
          @entrega.pedido.update(status: "Em entrega")
        end
      end

      @entrega = Entrega.includes(:pedido, :entregador).find(@entrega.id)

      render json: @entrega.as_json(
        include: {
          pedido: {
            only: %i[id status forma_pagamento valor_total observacoes],
            include: {
              cliente: {
                only: %i[id nome email telefone endereco_id],
                include: {
                  endereco: {
                    only: %i[id rua numero bairro cidade estado cep]
                  }
                }
              }
            }
          },
          entregador: {
            only: %i[id nome telefone veiculo]
          }
        }
      )
    else
      render json: { errors: @entrega.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @entrega.destroy
    head :no_content
  end

  private

  def set_entrega
    @entrega = Entrega.find(params[:id])
  end

  def entrega_params
    params.require(:entrega).permit(:pedido_id, :entregador_id, :status)
  end
end
