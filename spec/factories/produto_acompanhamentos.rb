FactoryBot.define do
  factory :produto_acompanhamento do
    produto { nil }
    acompanhamento { nil }
    quantidade_maxima { 1 }
  end
end
