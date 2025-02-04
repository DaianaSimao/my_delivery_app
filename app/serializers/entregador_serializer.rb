class EntregadorSerializer
  include FastJsonapi::ObjectSerializer

  attributes :id, :nome, :telefone, :veiculo, :ativo

  has_many :entregas
end

