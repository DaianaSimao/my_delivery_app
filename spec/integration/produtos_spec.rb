require "swagger_helper"

RSpec.describe "Produtos", type: :request do
  path '/api/v1/produtos' do
    get 'Lista produtos' do
      tags 'Produtos'
      produces 'application/json'
      response '200', 'Lista de produtos' do
        schema type: :array,
                items: {
                  type: :object,
                  properties: {
                    id: { type: :integer },
                    restaurante_id: { type: :integer },
                    descricao: { type: :string },
                    disponivel: { type: :boolean },
                    nome: { type: :string },
                    preco: { type: :number }
                  },
                  required: %w[id restaurante_id descricao disponivel nome preco]
                }

        run_test!
      end
    end
  end

  # path "/produtos/{id}" do
  #   get "Retorna um produto" do
  #     tags "Produtos"
  #     produces "application/json"
  #     parameter name: :id, in: :path, type: :integer

  #     response "200", "Retorna um produto" do
  #       schema type: :object,
  #         properties: {
  #           id: { type: :integer },
  #           restaurante_id: { type: :integer },
  #           descricao: { type: :string },
  #           disponivel: { type: :boolean },
  #           nome: { type: :string },
  #           preco: { type: :number }
  #         },
  #         required: ["id", "restaurante_id", "descricao", "disponivel", "nome", "preco"]
  #       let(:id) { Produto.create(nome: "Produto 1", preco: 10.0).id }
  #       run_test!
  #     end

  #     response "404", "Produto não encontrado" do
  #       let(:id) { -1 }
  #       run_test!
  #     end
  #   end
  # end

  # path "/produtos" do
  #   post "Cria um produto" do
  #     tags "Produtos"
  #     consumes "application/json"
  #     parameter name: :produto, in: :body, schema: {
  #       type: :object,
  #       properties: {
  #         id: { type: :integer },
  #         restaurante_id: { type: :integer },
  #         descricao: { type: :string },
  #         disponivel: { type: :boolean },
  #         nome: { type: :string },
  #         preco: { type: :number }
  #       },
  #       required: ["id", "restaurante_id", "descricao", "disponivel", "nome", "preco"]
  #     }

  #     response "201", "Produto criado" do
  #       let(:produto) { { nome: "Produto 1", preco: 10.0 } }
  #       run_test!
  #     end

  #     response "422", "Unprocessable entity" do
  #       let(:produto) { { nome: "Produto 1" } }
  #       run_test!
  #     end
  #   end
  # end

  # path "/produtos/{id}" do
  #   put "Atualiza um produto" do
  #     tags "Produtos"
  #     consumes "application/json"
  #     parameter name: :id, in: :path, type: :integer
  #     parameter name: :produto, in: :body, schema: {
  #       type: :object,
  #       properties: {
  #         id: { type: :integer },
  #         restaurante_id: { type: :integer },
  #         descricao: { type: :string },
  #         disponivel: { type: :boolean },
  #         nome: { type: :string },
  #         preco: { type: :number }
  #       },
  #       required: ["id", "restaurante_id", "descricao", "disponivel", "nome", "preco"]
  #     }

  #     response "200", "Produto atualizado" do
  #       let(:id) { Produto.create(nome: "Produto 1", preco: 10.0).id }
  #       let(:produto) { { nome: "Produto 2", preco: 20.0 } }
  #       run_test!
  #     end

  #     response "404", "Produto não encontrado" do
  #       let(:id) { -1 }
  #       let(:produto) { { nome: "Produto 2", preco: 20.0 } }
  #       run_test!
  #     end
  #   end
  # end

  # path "/produtos/{id}" do
  #   delete "Deleta um produto" do
  #     tags "Produtos"
  #     parameter name: :id, in: :path, type: :integer

  #     response "204", "Produto deletado" do
  #       let(:id) { Produto.create(nome: "Produto 1", preco: 10.0).id }
  #       run_test!
  #     end

  #     response "404", "Produto não encontrado" do
  #       let(:id) { -1 }
  #       run_test!
  #     end
  #   end
  # end
end