# Configuração para desativar jobs em segundo plano do Active Storage
Rails.application.config.after_initialize do
  # Desativa o processamento em segundo plano para o Active Storage
  ActiveStorage::Analyzer::ImageAnalyzer.class_eval do
    def metadata
      # Retorna um hash vazio para evitar o processamento em segundo plano
      {}
    end
  end

  # Desativa o processamento em segundo plano para o Active Storage
  ActiveStorage::Analyzer::VideoAnalyzer.class_eval do
    def metadata
      # Retorna um hash vazio para evitar o processamento em segundo plano
      {}
    end
  end

  # Desativa o processamento em segundo plano para o Active Storage
  ActiveStorage::Analyzer::AudioAnalyzer.class_eval do
    def metadata
      # Retorna um hash vazio para evitar o processamento em segundo plano
      {}
    end
  end
end
