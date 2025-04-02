class Api::V1::FinanceiroController < ApplicationController
  def relatorio_entradas_saidas
    restaurante_id = params[:restaurante_id] || current_user.restaurante_ativo
    data_inicio = params[:data_inicio] ? Date.parse(params[:data_inicio]) : Date.today.beginning_of_month
    data_fim = params[:data_fim] ? Date.parse(params[:data_fim]) : Date.today
    categoria_despesa_id = params[:categoria_despesa_id]

    # Buscar pedidos (entradas)
    pedidos = Pedido.where(
      restaurante_id: restaurante_id,
      created_at: data_inicio.beginning_of_day..data_fim.end_of_day
    ).where("status != 'Cancelado'")
    # Buscar despesas (saídas)
    despesas_query = Despesa.where(
      restaurante_id: restaurante_id,
      data: data_inicio..data_fim
    )
    
    # Filtrar por categoria se especificado
    despesas_query = despesas_query.where(categorias_despesa_id: categoria_despesa_id) if categoria_despesa_id.present?
    
    # Agrupar despesas por categoria
    despesas_por_categoria = despesas_query.joins(:categorias_despesa)
                                         .group('categorias_despesas.nome')
                                         .sum(:valor)
    
    # Agrupar entradas e saídas por dia
    # Garantir que temos entradas para cada dia no período
    entradas_por_dia = {}
    (data_inicio..data_fim).each do |date|
      entradas_por_dia[date] = 0
    end
    # Adicionar os valores reais de entradas
    pedidos.group_by_day(:created_at, range: data_inicio.beginning_of_day..data_fim.end_of_day)
           .sum(:valor_total).each do |date, value|
      # Converter para Date para garantir compatibilidade com as chaves
      data_formatada = date.to_date
      entradas_por_dia[data_formatada] = value
    end
    
    # Garantir que temos saídas para cada dia no período
    saidas_por_dia = {}
    (data_inicio..data_fim).each do |date|
      saidas_por_dia[date] = 0
    end
    
    # Adicionar os valores reais de saídas
    despesas_query.group_by_day(:data, range: data_inicio..data_fim)
                 .sum(:valor).each do |date, value|
      saidas_por_dia[date] = value
    end
    
    # Calcular totais
    total_entradas = pedidos.sum(:valor_total)
    total_saidas = despesas_query.sum(:valor)
    saldo = total_entradas - total_saidas
    
    # Preparar dados para o gráfico
    dias = (data_inicio..data_fim).map { |date| date.strftime('%d/%m/%Y') }

    dados_grafico = dias.map do |dia|
      data = Date.strptime(dia, '%d/%m/%Y')
      
      # Garantir que estamos acessando os valores corretos
      entrada_valor = entradas_por_dia[data] || 0
      saida_valor = saidas_por_dia[data] || 0
      
      {
        data: dia,
        entradas: entrada_valor,
        saidas: saida_valor,
        saldo: entrada_valor - saida_valor
      }
    end
    
    # Retornar os dados formatados
    render json: {
      periodo: {
        data_inicio: data_inicio,
        data_fim: data_fim
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
end
