# app/controllers/api/v1/cardapio_controller.rb

class Api::V1::CardapioController < ApplicationController
  skip_before_action :authenticate_user!
  def mais_pedidos
    restaurante = Restaurante.find(params[:id])
    mais_pedidos = restaurante.produtos
                              .joins(:itens_pedidos)
                              .where(disponivel: true)
                              .group('produtos.id')
                              .order('COUNT(itens_pedidos.id) DESC')
                              .limit(4)

    produtos_com_promocao = aplicar_promocoes(mais_pedidos, restaurante)
    render json: { data: produtos_com_promocao }
  end

  def secoes_cardapio
    restaurante = Restaurante.find(params[:id])
    secoes = SecoesCardapio.where(restaurante_id: restaurante.id)
                            .includes(:produtos)
                            .order(:ordem)

    dados_formatados = secoes.map do |secao|
      produtos = aplicar_promocoes(secao.produtos.where(disponivel: true), restaurante)
      {
        id: secao.id,
        nome: secao.nome,
        produtos: produtos
      }
    end

    render json: { data: dados_formatados }
  end

  def produto_cardapio
    # Carrega o produto com todos os relacionamentos necessários
    produto = Produto.includes(
      :produto_acompanhamentos, # Inclui os produto_acompanhamentos
      produto_acompanhamentos: [:acompanhamento] # E para cada produto_acompanhamento, inclui o acompanhamento
    ).find(params[:id])

    # Carrega os item_acompanhamentos para cada acompanhamento
    acompanhamentos_ids = produto.produto_acompanhamentos.map { |pa| pa.acompanhamento.id }
    item_acompanhamentos = ItemAcompanhamento.where(acompanhamento_id: acompanhamentos_ids)

    # Associa os item_acompanhamentos aos seus acompanhamentos
    produto.produto_acompanhamentos.each do |pa|
      pa.acompanhamento.item_acompanhamentos = item_acompanhamentos.select { |ia| ia.acompanhamento_id == pa.acompanhamento.id }
    end

    # Busca promoções ativas
    promocoes_ativas = Promocao.where(
      restaurante_id: produto.restaurante_id,
      ativa: true
    ).where('data_inicio <= ? AND data_fim >= ?', Date.current, Date.current)

    # Verifica se há promoção para este produto
    promocao = promocoes_ativas.joins(:produtos).where(produtos: { id: produto.id }).first

    # Prepara os dados para o JSON
    produto_data = {
      id: produto.id,
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco.to_f,
      preco_original: produto.preco.to_f,
      imagem_url: produto.imagem_url,
      disponivel: produto.disponivel,
      restaurante_id: produto.restaurante_id,
      produto_acompanhamentos: produto.produto_acompanhamentos.map do |pa|
        {
          id: pa.id,
          acompanhamento: {
            id: pa.acompanhamento.id,
            nome: pa.acompanhamento.nome,
            quantidade_maxima: pa.acompanhamento.quantidade_maxima,
            item_acompanhamentos: pa.acompanhamento.item_acompanhamentos.map do |ia|
              {
                id: ia.id,
                nome: ia.nome,
                preco: ia.preco.to_f,
              }
            end
          }
        }
      end
    }

    # Aplica promoção se existir
    if promocao
      produto_data[:preco] = calcular_preco_promocional(produto_data[:preco], promocao).round(2)
      produto_data[:preco_original] = produto.preco.to_f
      produto_data[:promocao] = {
        tipo: promocao.tipo,
        valor_de: promocao.valor_de.to_f,
        valor_para: promocao.valor_para.to_f,
        desconto_percentual: promocao.desconto_percentual.to_f,
        nome: promocao.nome
      }
    end

    render json: { data: produto_data }
  end

  def promocoes_cardapio
    restaurante = Restaurante.find(params[:restaurante_id])
    
    promocoes = Promocao.where(restaurante_id: restaurante.id, ativa: true)
                        .where('data_inicio <= ? AND data_fim >= ?', Date.current, Date.current)
                        .includes(:produtos)

    produtos = promocoes.flat_map do |promocao|
      promocao.produtos.map do |produto|
        preco_final = calcular_preco_promocional(produto.preco, promocao)

        {
          id: produto.id,
          nome: produto.nome,
          descricao: produto.descricao,
          preco_original: produto.preco,
          preco: preco_final.round(2),
          promocao: {
            tipo: promocao.tipo,
            valor_de: promocao.valor_de,
            valor_para: promocao.valor_para,
            desconto_percentual: promocao.desconto_percentual,
            nome: promocao.nome
          },
          imagem_url: produto.imagem_url
        }
      end
    end

    render json: { data: produtos }
  end

  private

  def calcular_preco_promocional(preco_original, promocao)
    case promocao.tipo
    when 'de_para' then promocao.valor_para.to_f
    when 'desconto_percentual' then preco_original * (1 - promocao.desconto_percentual.to_f / 100)
    else preco_original
    end
  end

  def aplicar_promocoes(produtos, restaurante)
    promocoes = Promocao.where(restaurante_id: restaurante.id, ativa: true)
                        .where('data_inicio <= ? AND data_fim >= ?', Date.current, Date.current)
                        .includes(:produtos)

    produtos.map do |produto|
      promocao = promocoes.find { |p| p.produtos.include?(produto) }
      promocao ? calcular_precos(produto, promocao) : produto.as_json
    end
  end

  def calcular_precos(produto, promocao)
    preco_final = case promocao.tipo
                  when 'de_para' then promocao.valor_para
                  when 'desconto_percentual' then produto.preco * (1 - promocao.desconto_percentual / 100)
                  else produto.preco
                  end

    produto.as_json.merge(
      preco_original: produto.preco,
      preco: preco_final.round(2),
      promocao: promocao.as_json(only: [:tipo, :valor_de, :valor_para, :desconto_percentual, :nome])
    )
  end
end
