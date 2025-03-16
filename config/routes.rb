Rails.application.routes.draw do
  devise_for :users, defaults: { format: :json }, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }

  devise_scope :user do
    post 'login', to: 'users/sessions#create'
    delete 'logout', to: 'users/sessions#destroy'
    post 'sign_up', to: 'users/registrations#create'
  end

  get "up" => "rails/health#show", as: :rails_health_check
  get "hello", to: "api#index"

  mount Rswag::Api::Engine => '/api-docs'
  mount Rswag::Ui::Engine => '/api-docs'

  namespace :api do
    namespace :v1 do
      resources :restaurantes
      resources :relatorios do
        collection do
          get "dashboard"
        end
      end
      resources :produtos
      resources :pedidos do
        collection do
          get "listar_pedidos"
        end
        member do
          get "itens", to: "pedidos#itens"
          put "atualizar_itens", to: "pedidos#atualizar_itens"
        end
      end
      resources :pagamentorons
      resources :entregas
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
      post "switch_restaurant", to: "restaurantes#switch_restaurant"
      get "restaurantes_ativos", to: "restaurantes#restaurantes_ativos"
      get "cardapio/:restaurante_id", to: "produtos#cardapio"
      get "clientes/endereco/:endereco_id", to: "clientes#endereco"
      get "clientes/buscar_cliente/:id", to: "clientes#buscar_cliente"
      get "restaurantes/regioes_entrega/:id", to: "restaurantes#regioes_entrega"
    end
  end
end
