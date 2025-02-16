FactoryBot.define do
  factory :jwt_denylist do
    jti { "MyString" }
    exp { "2025-02-12 10:25:01" }
  end
end
