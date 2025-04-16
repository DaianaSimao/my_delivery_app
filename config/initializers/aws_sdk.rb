# Configuração específica para o AWS SDK com Backblaze B2
require "aws-sdk-s3"

# Configuração global do AWS SDK
Aws.config.update({
  region: ENV.fetch('AWS_REGION'),
  endpoint: ENV.fetch('AWS_ENDPOINT'),
  credentials: Aws::Credentials.new(
    ENV.fetch('AWS_ACCESS_KEY_ID'),
    ENV.fetch('AWS_SECRET_ACCESS_KEY')
  ),
  compute_checksums: false,
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
