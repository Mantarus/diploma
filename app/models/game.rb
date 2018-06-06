class Game < ApplicationRecord
  belongs_to :user
  has_one :strategy, :foreign_key => 'strategy1_id'
  has_one :strategy, :foreign_key => 'strategy2_id'
end
