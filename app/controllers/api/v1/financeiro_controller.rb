class Api::V1::FinanceiroController < ApplicationController
  # GET /api/v1/financeiro/relatorio_entradas_saidas
  def relatorio_entradas_saidas
    @restaurante_id = params[:restaurante_id] || current_user.restaurante_ativo
    @data_inicio = params[:data_inicio] ? Date.parse(params[:data_inicio]) : Date.today.beginning_of_month
    @data_fim = params[:data_fim] ? Date.parse(params[:data_fim]) : Date.today
    @categoria_despesa_id = params[:categoria_despesa_id]

    pedidos = buscar_pedidos
    despesas = buscar_despesas

    despesas_por_categoria = calcular_despesas_por_categoria(despesas)
    entradas_por_dia = calcular_entradas_por_dia(pedidos)
    saidas_por_dia = calcular_saidas_por_dia(despesas)

    total_entradas = pedidos.sum(:valor_total)
    total_saidas = despesas.sum(:valor)
    saldo = total_entradas - total_saidas

    dados_grafico = preparar_dados_grafico(entradas_por_dia, saidas_por_dia)

    render json: {
      periodo: {
        data_inicio: @data_inicio,
        data_fim: @data_fim
      },
      totais: {
        entradas: total_entradas,
        saidas: total_saidas,
        saldo: saldo
      },
      despesas_por_categoria: despesas_por_categoria,
      dados_diarios: dados_grafico
    }
  end

  private

  def buscar_pedidos
    Pedido.where(
      restaurante_id: @restaurante_id,
      created_at: @data_inicio.beginning_of_day..@data_fim.end_of_day
    ).where("status != 'Cancelado'")
  end

  def buscar_despesas
    despesas = Despesa.where(
      restaurante_id: @restaurante_id,
      data: @data_inicio..@data_fim
    )

    if @categoria_despesa_id.present?
      despesas = despesas.where(categorias_despesa_id: @categoria_despesa_id)
    end

    despesas
  end

  def calcular_despesas_por_categoria(despesas)
    despesas.joins(:categorias_despesa)
            .group("categorias_despesas.nome")
            .sum(:valor)
  end

  def calcular_entradas_por_dia(pedidos)
    entradas_por_dia = inicializar_hash_por_dia

    pedidos.group_by_day(:created_at, range: @data_inicio.beginning_of_day..@data_fim.end_of_day)
           .sum(:valor_total).each do |date, value|
      entradas_por_dia[date.to_date] = value
    end

    entradas_por_dia
  end

  def calcular_saidas_por_dia(despesas)
    saidas_por_dia = inicializar_hash_por_dia

    despesas.group_by_day(:data, range: @data_inicio..@data_fim)
            .sum(:valor).each do |date, value|
      saidas_por_dia[date] = value
    end

    saidas_por_dia
  end

  def inicializar_hash_por_dia
    hash = {}
    (@data_inicio..@data_fim).each do |date|
      hash[date] = 0
    end
    hash
  end

  def preparar_dados_grafico(entradas_por_dia, saidas_por_dia)
    dias = (@data_inicio..@data_fim).map { |date| date.strftime("%d/%m/%Y") }

    dias.map do |dia|
      data = Date.strptime(dia, "%d/%m/%Y")
      entrada_valor = entradas_por_dia[data] || 0
      saida_valor = saidas_por_dia[data] || 0

      {
        data: dia,
        entradas: entrada_valor,
        saidas: saida_valor,
        saldo: entrada_valor - saida_valor
      }
    end
  end
end
