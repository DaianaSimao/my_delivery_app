
if Rails.env.development? || Rails.env.test?
  Rswag::Ui.configure do |c|
    c.openapi_endpoint "/api-docs/v1/swagger.yaml", "API V1 Docs"
  end
end
