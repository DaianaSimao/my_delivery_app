FactoryBot.define do
  factory :promocao do
    nome { "MyString" }
    descricao { "MyText" }
    tipo { "MyString" }
    valor_de { "9.99" }
    valor_para { "9.99" }
    desconto_percentual { "9.99" }
    data_inicio { "2025-03-23" }
    data_fim { "2025-03-23" }
    ativa { false }
  end
end
