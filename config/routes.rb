Rails.application.routes.draw do
  devise_for :users, defaults: { format: :json }, controllers: {
    sessions: "users/sessions",
    registrations: "users/registrations"
  }

  devise_scope :user do
    post "login", to: "users/sessions#create"
    delete "logout", to: "users/sessions#destroy"
    post "sign_up", to: "users/registrations#create"
  end

  get "up" => "rails/health#show", as: :rails_health_check
  get "hello", to: "api#index"

  
  if Rails.env.development? || Rails.env.test?
    mount Rswag::Api::Engine => "/api-docs"
    mount Rswag::Ui::Engine => "/api-docs"
  end

  namespace :api do
    namespace :v1 do
      resources :restaurantes do
        resources :categorias_despesas do
          collection do
            get "lista", to: "categorias_despesas#lista"
          end
        end
        resources :despesas
        get "despesas/relatorio", to: "despesas#relatorio"
      end
      resources :relatorios do
        collection do
          get "dashboard"
        end
      end

      resources :financeiro do
        collection do
          get "relatorio_entradas_saidas"
        end
      end
      resources :produtos
      resources :pedidos do
        collection do
          get "listar_pedidos"
          get "rastreio_pedido/:id", to: "pedidos#rastreio_pedido"
        end
        member do
          get "itens", to: "pedidos#itens"
          put "atualizar_itens", to: "pedidos#atualizar_itens"
          get "pagamento", to: "pedidos#pagamento"
        end
      end
      resources :pagamentos
      resources :entregas do
        collection do
          get "listar_entregas"
        end
      end
      resources :entregadores do
        collection do
          get "listar_entregadores"
        end
      end
      resources :itens_pedidos
      resources :avaliacoes
      resources :enderecos
      resources :clientes do
        collection do
          get "carregar_cliente/:id", to: "clientes#carregar_cliente"
        end
      end
      resources :produto_acompanhamentos
      resources :item_acompanhamentos
      resources :acompanhamentos
      resources :acompanhamentos_pedidos
      resources :bairros do
        collection do
          get "cidades"
        end
      end
      resources :promocoes
      resources :secoes_cardapios

      get "restaurantes/:id/mais_pedidos", to: "cardapio#mais_pedidos"
      get "restaurantes/:id/secoes", to: "cardapio#secoes_cardapio"
      get "restaurantes/:restaurante_id/promocoes", to: "cardapio#promocoes_cardapio"
      get "cardapio/produto/:id", to: "cardapio#produto_cardapio"
      post "switch_restaurant", to: "restaurantes#switch_restaurant"
      get "restaurantes_ativos", to: "restaurantes#restaurantes_ativos"
      get "cardapio/:restaurante_id", to: "produtos#cardapio"
      get "clientes/endereco/:endereco_id", to: "clientes#endereco"
      get "clientes/buscar_cliente/:id", to: "clientes#buscar_cliente"
      get "restaurantes/regioes_entrega/:id", to: "restaurantes#regioes_entrega"
    end
  end
end
