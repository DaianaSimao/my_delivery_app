class Api::V1::RelatoriosController < ApplicationController
  def dashboard
    restaurante = current_user.restaurantes.find(current_user.restaurante_ativo)
    hoje = Time.now

    inicio_intervalo = (hoje - 3.hours).beginning_of_day + 3.hours
    fim_intervalo = (hoje - 3.hours).end_of_day + 3.hours

    @pedidos_do_dia = Pedido.includes(:cliente, :pagamento).all.order(created_at: :desc).where(restaurante_id: restaurante.id, created_at: inicio_intervalo..fim_intervalo)
    @pedidos_do_dia_anterior = Pedido.includes(:cliente, :pagamento).all.order(created_at: :desc).where(restaurante_id: restaurante.id, created_at: inicio_intervalo - 1.day..fim_intervalo - 1.day)
    @entregas_do_dia = Entrega.where(pedido_id: @pedidos_do_dia.ids).where(status: "Entregue")
    @entregas_do_dia_anterior = Entrega.where(pedido_id: @pedidos_do_dia_anterior.ids).where(status: "Entregue")

    vendas_do_dia = @pedidos_do_dia.sum(:valor_total).to_f
    vendas_do_dia_anterior = @pedidos_do_dia_anterior.sum(:valor_total)

    crescimento_vendas = calcular_crescimento(vendas_do_dia, vendas_do_dia_anterior)
    pedidos_total = @pedidos_do_dia.count
    pedidos_total_anterior = @pedidos_do_dia_anterior.count
    crescimento_pedidos = calcular_crescimento(pedidos_total, pedidos_total_anterior)
    entregas_total = @entregas_do_dia.count
    entregas_total_anterior = @entregas_do_dia_anterior.count
    crescimento_entregas = calcular_crescimento(entregas_total, entregas_total_anterior)
    ticket_medio = (vendas_do_dia / pedidos_total).round(2)
    ticket_medio_anterior = pedidos_total_anterior.zero? ? 0 : (vendas_do_dia_anterior / pedidos_total_anterior.to_f).round(2)
    crescimento_ticket_medio = calcular_crescimento(ticket_medio, ticket_medio_anterior)

    # Dados para os gráficos
    vendas_semanais = calcular_vendas_semanais(restaurante.id)
    pedidos_semanais = calcular_pedidos_semanais(restaurante.id)
    entregas_semanais = calcular_entregas_semanais(restaurante.id)

    render json: {
      data: {
        vendas_do_dia: vendas_do_dia,
        vendas_do_dia_anterior: vendas_do_dia_anterior,
        crescimento_vendas: crescimento_vendas,
        pedidos_total: pedidos_total,
        pedidos_total_anterior: pedidos_total_anterior,
        crescimento_pedidos: crescimento_pedidos,
        entregas_total: entregas_total,
        entregas_total_anterior: entregas_total_anterior,
        crescimento_entregas: crescimento_entregas,
        ticket_medio: ticket_medio,
        ticket_medio_anterior: ticket_medio_anterior,
        crescimento_ticket_medio: crescimento_ticket_medio,
        vendas_semanais: vendas_semanais,
        pedidos_semanais: pedidos_semanais,
        entregas_semanais: entregas_semanais
      }
    }
  end

  private

  def calcular_crescimento(atual, anterior)
    if anterior == 0 && atual == 0
      0
    elsif anterior == 0
      100
    else
      (((atual - anterior) / anterior) * 100).round(2)
    end
  end

  def calcular_vendas_semanais(restaurante_id)
    hoje = Time.now
    inicio_semana = (hoje - 3.hours).beginning_of_week + 3.hours
    fim_semana = (hoje - 3.hours).end_of_week + 3.hours

    vendas_por_dia = (0..6).map do |i|
      inicio_dia = inicio_semana + i.days
      fim_dia = inicio_dia.end_of_day
      Pedido.where(restaurante_id: restaurante_id, created_at: inicio_dia..fim_dia).sum(:valor_total).to_f
    end

    vendas_por_dia
  end

  def calcular_pedidos_semanais(restaurante_id)
    hoje = Time.now
    inicio_semana = (hoje - 3.hours).beginning_of_week + 3.hours
    fim_semana = (hoje - 3.hours).end_of_week + 3.hours

    pedidos_por_dia = (0..6).map do |i|
      inicio_dia = inicio_semana + i.days
      fim_dia = inicio_dia.end_of_day
      Pedido.where(restaurante_id: restaurante_id, created_at: inicio_dia..fim_dia).count
    end

    pedidos_por_dia
  end

  def calcular_entregas_semanais(restaurante_id)
    hoje = Time.now
    inicio_semana = (hoje - 3.hours).beginning_of_week + 3.hours
    fim_semana = (hoje - 3.hours).end_of_week + 3.hours

    entregas_por_dia = (0..6).map do |i|
      inicio_dia = inicio_semana + i.days
      fim_dia = inicio_dia.end_of_day
      Entrega.joins(:pedido).where(pedidos: { restaurante_id: restaurante_id }, created_at: inicio_dia..fim_dia, status: "Entregue").count
    end

    entregas_por_dia
  end
end
