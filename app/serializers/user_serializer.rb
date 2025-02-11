class UserSerializer
  include FastJsonapi::ObjectSerializer
  
  attributes :id, :email, :password, :password_confirmation
end
