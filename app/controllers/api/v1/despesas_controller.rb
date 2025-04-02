module Api
  module V1
    class DespesasController < ApplicationController
      before_action :set_restaurante
      before_action :set_despesa, only: [ :show, :update, :destroy ]

      def index
        @despesas = @restaurante.despesas

        @despesas = @despesas.por_periodo(params[:data_inicio], params[:data_fim]) if params[:data_inicio] && params[:data_fim]
        @despesas = @despesas.por_categoria(params[:categoria_id]) if params[:categoria_id]
        @despesas = @despesas.where(status: params[:status]) if params[:status]

        @despesas = @despesas.order(data: :desc)
        @despesas =  @despesas.page(params[:page]).per(params[:per_page])

        render json: {
          data: @despesas.as_json,
          meta: {
            total_pages: @despesas.total_pages,
            total_count: @despesas.total_count,
            current_page: @despesas.current_page
          }
        }
      end

      def show
        render json: @despesa
      end

      def create
        @despesa = @restaurante.despesas.build(despesa_params)

        if @despesa.save
          render json: @despesa, status: :created
        else
          render json: { errors: @despesa.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @despesa.update(despesa_params)
          render json: @despesa
        else
          render json: { errors: @despesa.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        if @despesa.destroy
          render json: { message: "Despesa removida com sucesso" }, status: :ok
        else
          render json: { errors: @despesa.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def relatorio
        data_inicio = params[:data_inicio] || Date.today.beginning_of_month
        data_fim = params[:data_fim] || Date.today.end_of_month

        # Despesas do período
        despesas = @restaurante.despesas.por_periodo(data_inicio, data_fim)
        total_despesas = despesas.sum(:valor)

        # Receitas do período (pedidos)
        receitas = @restaurante.pedidos.where(created_at: data_inicio.beginning_of_day..data_fim.end_of_day)
        total_receitas = receitas.sum(:valor_total)

        # Despesas por categoria
        despesas_por_categoria = despesas.group(:categoria_despesa_id)
                                      .joins(:categoria_despesa)
                                      .select("categorias_despesas.nome, SUM(despesas.valor) as total")
                                      .order("total DESC")

        # Despesas por status
        despesas_por_status = despesas.group(:status)
                                    .select("status, COUNT(*) as quantidade, SUM(valor) as total")

        render json: {
          periodo: {
            inicio: data_inicio,
            fim: data_fim
          },
          resumo: {
            total_receitas: total_receitas,
            total_despesas: total_despesas,
            saldo: total_receitas - total_despesas
          },
          despesas_por_categoria: despesas_por_categoria,
          despesas_por_status: despesas_por_status
        }
      end

      private

      def set_restaurante
        @restaurante = Restaurante.find(params[:restaurante_id])
      end

      def set_despesa
        @despesa = @restaurante.despesas.find(params[:id])
      end

      def despesa_params
        params.require(:despesa).permit(:descricao, :valor, :data, :status, :observacoes, :categorias_despesa_id, :restaurante_id)
      end
    end
  end
end
