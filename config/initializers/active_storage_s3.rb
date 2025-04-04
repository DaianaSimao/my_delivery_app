# Configuração específica para o Active Storage com Backblaze B2
Rails.application.config.after_initialize do
  # Verifica se o serviço S3 está disponível
  if defined?(ActiveStorage::Service::S3Service)
    # Desativa a verificação de checksum para o serviço S3 (Backblaze B2)
    ActiveStorage::Service::S3Service.class_eval do
      def upload(key, io, checksum: nil, **options)
        # Ignora o checksum para evitar problemas com o Backblaze B2
        options.delete(:checksum) if options.key?(:checksum)

        # Continua com o upload normal
        object_for(key).put(body: io, **options)
      end
    end
  elsif defined?(ActiveStorage::Service::S3)
    # Alternativa para versões mais antigas do Rails
    ActiveStorage::Service::S3.class_eval do
      def upload(key, io, checksum: nil, **options)
        # Ignora o checksum para evitar problemas com o Backblaze B2
        options.delete(:checksum) if options.key?(:checksum)

        # Continua com o upload normal
        object_for(key).put(body: io, **options)
      end
    end
  else
    # Log de aviso se nenhum dos serviços estiver disponível
    Rails.logger.warn "Não foi possível encontrar o serviço S3 do Active Storage para configurar o Backblaze B2"
  end
end
