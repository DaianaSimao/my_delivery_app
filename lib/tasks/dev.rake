namespace :dev do
  desc "Popula o banco de dados com dados fictícios"
  task populate: :environment do
    require 'faker'

    puts "Limpando banco de dados..."
    [Avaliacao, Entrega, Pagamento, ItensPedido, Pedido, Produto, Restaurante, Endereco, Cliente, Entregador].each(&:delete_all)

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
    5.times do
      Restaurante.create!(
        nome: Faker::Restaurant.name,
        descricao: Faker::Restaurant.description,
        categoria: Faker::Restaurant.type,
        taxa_entrega: rand(5.0..15.0).round(2),
        tempo_medio_entrega: rand(20..60),
        endereco_id: Endereco.all.sample.id
      )
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
    end

    puts "Criando pedidos..."
    20.times do
      pedido = Pedido.create!(
        restaurante_id: Restaurante.all.sample.id,
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

        ItensPedido.create!(
          pedido_id: pedido.id,
          produto_id: produto.id,
          quantidade: quantidade,
          preco_unitario: preco_unitario
        )
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
end