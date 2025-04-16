Rails.application.config.after_initialize do
  if Rails.env.production?
    configs = ActiveRecord::Base.configurations.configs_for(env_name: 'production')

    configs.each do |config|
      begin
        ActiveRecord::Base.establish_connection(config)
        db_config = ActiveRecord::Base.connection_db_config
        puts "✅ Conexão estabelecida com sucesso para #{config.name} (#{db_config.database})"
      rescue => e
        puts "❌ Falha na conexão com #{config.name}: #{e.message}"
        raise "Database connection failed for #{config.name}"
      end
    end
  end
end