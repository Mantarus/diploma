Rails.application.routes.draw do
  devise_for :users, :controllers => { registrations: 'registrations' }

  get 'persons/profile'
  get 'main/index'

  get 'persons/profile', as: 'user_root'

  resources :strategies
  resources :games

  root 'main#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
