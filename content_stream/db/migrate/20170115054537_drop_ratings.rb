class DropRatings < ActiveRecord::Migration[5.0]
  def change
     drop_table :ratings
  end
end
