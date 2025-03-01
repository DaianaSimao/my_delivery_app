namespace :dev do
  desc "Popula o banco de dados com dados fictícios"
  task populate: :environment do
    require "faker"

    puts "Limpando banco de dados..."
    [ Avaliacao, Entrega, Pagamento, ItensPedido, Pedido, Produto, Restaurante, Endereco, Cliente, Entregador, AcompanhamentosPedido, Acompanhamento, ItemAcompanhamento, ProdutoAcompanhamento, UserRestaurante ].each(&:delete_all)

    puts "Criando endereços..."
    10.times do
      Endereco.create!(
        rua: Faker::Address.street_name,
        numero: Faker::Address.building_number,
        complemento: Faker::Address.secondary_address,
        bairro: Faker::Address.community,
        cidade: Faker::Address.city,
        estado: Faker::Address.state_abbr,
        cep: Faker::Address.zip
      )
    end

    puts "Criando clientes..."
    10.times do
      Cliente.create!(
        nome: Faker::Name.name,
        telefone: Faker::PhoneNumber.cell_phone
      )
    end

    puts "Criando entregadores..."
    5.times do
      Entregador.create!(
        nome: Faker::Name.name,
        telefone: Faker::PhoneNumber.cell_phone,
        veiculo: %w[Moto Carro Bicicleta].sample
      )
    end

    puts "Criando restaurantes..."
    1.times do
      Restaurante.create!(
        nome: Faker::Restaurant.name,
        descricao: Faker::Restaurant.description,
        categoria: Faker::Restaurant.type,
        taxa_entrega: rand(5.0..15.0).round(2),
        tempo_medio_entrega: rand(20..60),
        endereco_id: Endereco.all.sample.id
      )
    end

    puts "Criando acompanhamentos e adicionais..."
    10.times do
      acompanhamento = Acompanhamento.create!(
        nome: Faker::Food.ingredient,
        quantidade_maxima: rand(1..3),
        tipo: %w[Adicional Acompanhamento].sample
      )

      3.times do
        if acompanhamento.tipo == "Acompanhamento"
          ItemAcompanhamento.create!(
            acompanhamento_id: acompanhamento.id,
            nome: Faker::Food.spice
          )
        else
          ItemAcompanhamento.create!(
            acompanhamento_id: acompanhamento.id,
            nome: Faker::Food.ingredient,
            preco: rand(1.0..5.0).round(2)
          )
        end
      end
    end

    puts "Criando produtos..."
    Restaurante.all.each do |restaurante|
      5.times do
        Produto.create!(
          restaurante_id: restaurante.id,
          nome: Faker::Food.dish,
          descricao: Faker::Food.description,
          preco: rand(10.0..100.0).round(2),
          imagem_url: Faker::LoremFlickr.image,
          disponivel: [true, false].sample
        )
      end

      Produto.all.each do |produto|
        if [true, false].sample
          acompanhamento = Acompanhamento.all.sample
          produto.acompanhamentos << acompanhamento
        end
      end
    end

    puts "Criando pedidos..."
    2.times do
      pedido = Pedido.create!(
        restaurante_id: Restaurante.first.id,
        cliente_id: Cliente.all.sample.id,
        endereco_id: Endereco.all.sample.id,
        forma_pagamento: %w[Cartão Dinheiro PIX].sample,
        troco: rand(0.0..50.0).round(2),
        valor_total: 0.0,
        status: "Recebido"
      )

      total = 0
      2.times do
        produto = Produto.all.sample
        quantidade = rand(1..3)
        preco_unitario = produto.preco
        total += preco_unitario * quantidade

        item_pedido = ItensPedido.create!(
          pedido_id: pedido.id,
          produto_id: produto.id,
          quantidade: quantidade,
          preco_unitario: preco_unitario
        )

        if [true, false].sample
          rand(1..3).times do
            AcompanhamentosPedido.create!(
              itens_pedido_id: item_pedido.id,
              item_acompanhamento_id: ItemAcompanhamento.all.sample.id,
              quantidade: rand(1..2),
              preco_unitario: rand(1.0..10.0).round(2)
            )
          end
        end
      end

      pedido.update(valor_total: total)
    end

    puts "Criando pagamentos..."
    Pedido.all.each do |pedido|
      Pagamento.create!(
        pedido_id: pedido.id,
        metodo: %w[Cartão Dinheiro PIX].sample,
        status: %w[Pendente Pago Cancelado].sample,
        valor: pedido.valor_total
      )
    end

    puts "Criando entregas..."
    Pedido.all.each do |pedido|
      Entrega.create!(
        pedido_id: pedido.id,
        entregador_id: Entregador.all.sample.id,
        status: %w[Aguardando Em\ entrega Entregue].sample
      )
    end

    puts "Criando avaliações..."
    Pedido.all.each do |pedido|
      next unless [true, false].sample

      Avaliacao.create!(
        pedido_id: pedido.id,
        nota: rand(1.0..5.0).round(1),
        comentario: Faker::Restaurant.review
      )
    end

    puts "Banco de dados populado com sucesso!"
  end

  desc "Popula tabela acompanhamentos pedidos"
  task populate_acompanhamentos_pedidos: :environment do
    itens_pedidos  = ItensPedido.all
    itens_pedidos.each do |itens_pedido|
      acompanhanentos = itens_pedido.produto.acompanhamentos
      acompanhanentos.each do |acompanhamento|
        acompanhamento.item_acompanhamentos.each do |item_acompanhamento|
          AcompanhamentosPedido.create!(
            itens_pedido_id: itens_pedido.id,
            item_acompanhamento_id: item_acompanhamento.id,
            quantidade: rand(1..3),
            preco_unitario: item_acompanhamento.preco
          )
        end
      end
    end
  end
end