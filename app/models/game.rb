class Game < ApplicationRecord
  belongs_to :user
  has_one :strategy, :foreign_key => 'strategy1_id'
  has_one :strategy, :foreign_key => 'strategy2_id'

  def log_with_linebreaks
    return nil if not game_log

    arr = game_log.split("\n")
    new_arr = []

    arr[0..-2].each do |line|
      new_arr.append(line + ';\\')
    end
    new_arr.append(arr[-1])

    inspect
    new_arr.join
  end
end
