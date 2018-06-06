class AddUserRefToGames < ActiveRecord::Migration[5.2]
  def change
    add_reference :games, :user, foreign_key: true
    add_column :games, :strategy1_id, :integer
    add_column :games, :strategy2_id, :integer
  end
end
