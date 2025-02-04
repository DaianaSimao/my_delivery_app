Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  get "hello", to: "api#index"

  namespace :api do
    namespace :v1 do
      resources :restaurantes
      resources :produtos
      resources :pedidos
      resources :pagamentos
      resources :entregas
      resources :entregadores
      resources :itens_pedidos
      resources :avaliacoes
      resources :enderecos
      resources :clientes
    end
  end
end
