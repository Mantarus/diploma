class Strategy < ApplicationRecord
  belongs_to :user

  def full_title
    user.full_name + ' - ' + title
  end
end
