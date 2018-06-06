class AddDetailsToGames < ActiveRecord::Migration[5.2]
  def change
    add_column :games, :success, :boolean
    add_column :games, :winner, :string
    add_column :games, :game_log, :text
    add_column :games, :game_error, :text
  end
end
