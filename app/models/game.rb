class Game < ApplicationRecord
  belongs_to :user
  has_one :strategy1, class: "Strategy"
  has_one :strategy2, class: "Strategy"
end
