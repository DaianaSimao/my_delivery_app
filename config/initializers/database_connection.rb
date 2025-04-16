Rails.application.config.after_initialize do
  if Rails.env.production?
    ActiveRecord::Base.establish_connection(ENV['DATABASE_PUBLIC_URL'])
    puts "✅ Conexão com PostgreSQL estabelecida em #{ActiveRecord::Base.connection_config[:host]}"
  end
rescue => e
  puts "❌ Falha na conexão: #{e.message}"
  raise
end
