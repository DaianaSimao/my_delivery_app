class UserSerializer
  include FastJsonapi::ObjectSerializer
  
  attributes :id, :email, :password, :password_confirmation, :restaurante_id, :jti, :created_at, :updated_at
end
