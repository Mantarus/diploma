class CreateStrategies < ActiveRecord::Migration[5.2]
  def change
    create_table :strategies do |t|
      t.string :title
      t.text :code

      t.timestamps
    end
  end
end
