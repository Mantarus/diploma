class AddUserRefToStrategies < ActiveRecord::Migration[5.2]
  def change
    add_reference :strategies, :user, foreign_key: true
  end
end
