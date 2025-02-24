Rails.application.routes.draw do
  devise_for :users, defaults: { format: :json }, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }

  devise_scope :user do
    post 'login', to: 'users/sessions#create'
    delete 'logout', to: 'users/sessions#destroy'
  end

  get "up" => "rails/health#show", as: :rails_health_check
  get "hello", to: "api#index"

  mount Rswag::Api::Engine => '/api-docs'
  mount Rswag::Ui::Engine => '/api-docs'

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
      resources :produto_acompanhamentos
      resources :item_acompanhamentos
      resources :acompanhamentos
    end
  end
end
