module Api
  module V1
    class CategoriasDespesasController < ApplicationController
      before_action :set_restaurante
      before_action :set_categoria_despesa, only: [ :show, :update, :destroy ]

      def index
        @categorias_despesas = @restaurante.categorias_despesas

        if params[:search].present?
          @categorias_despesas = @categorias_despesas.where("nome ILIKE ?", "%#{params[:search]}%")
        end

        @categorias_despesas = @categorias_despesas.page(params[:page]).per(params[:per_page])

        render json: {
          data: @categorias_despesas.as_json,
          meta: {
            total_pages: @categorias_despesas.total_pages,
            total_count: @categorias_despesas.total_count,
            current_page: @categorias_despesas.current_page
          }
        }
      end

      def lista
        @categorias_despesas = @restaurante.categorias_despesas
        render json: @categorias_despesas
      end

      def show
        render json: @categoria
      end

      def create
        @categoria = @restaurante.categorias_despesas.build(categoria_despesa_params)

        if @categoria.save
          render json: @categoria, status: :created
        else
          render json: { errors: @categoria.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @categoria.update(categoria_despesa_params)
          render json: @categoria
        else
          render json: { errors: @categoria.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        if @categoria.destroy
          render json: { message: "Categoria de despesa removida com sucesso" }, status: :ok
        else
          render json: { errors: @categoria.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def set_restaurante
        @restaurante = Restaurante.find(params[:restaurante_id])
      end

      def set_categoria_despesa
        @categoria = @restaurante.categorias_despesas.find(params[:id])
      end

      def categoria_despesa_params
        params.require(:categorias_despesa).permit(:nome, :descricao, :ativo)
      end
    end
  end
end
