# Configuração específica para o AWS SDK com Backblaze B2
require "aws-sdk-s3"

# Configuração global do AWS SDK
Aws.config.update({
  region: "us-east-005",
  endpoint: "https://s3.us-east-005.backblazeb2.com",
  credentials: Aws::Credentials.new(
    Rails.application.credentials.dig(:aws, :access_key_id),
    Rails.application.credentials.dig(:aws, :secret_access_key)
  ),
  # Desativa a verificação de checksum
  compute_checksums: false,
  # Configura o cliente para usar path-style URLs
  force_path_style: true
})

# Configuração específica para o cliente S3
Aws::S3::Client.class_eval do
  def put_object(params = {})
    # Remove o parâmetro de checksum se estiver presente
    params.delete(:checksum_algorithm) if params.key?(:checksum_algorithm)
    params.delete(:checksum_mode) if params.key?(:checksum_mode)

    # Continua com o upload normal
    super(params)
  end
end
