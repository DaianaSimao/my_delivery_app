class UserRestaurante < ApplicationRecord
  belongs_to :user
  belongs_to :restaurante
end
