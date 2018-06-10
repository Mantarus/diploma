class User < ApplicationRecord
  # Подключаемые модули для авторизации
  devise :database_authenticatable,
         :registerable,
         :recoverable,
         :rememberable,
         :validatable

  # Связи с другими моделями
  has_many :strategies
  has_many :games
end
