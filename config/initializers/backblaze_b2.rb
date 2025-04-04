# require "aws-sdk-s3"

# Aws.config.update(
#   region: "us-east-005",
#   credentials: Aws::Credentials.new(
#     Rails.application.credentials.dig(:aws, :access_key_id),
#     Rails.application.credentials.dig(:aws, :secret_access_key)
#   ),
#   endpoint: "https://s3.us-east-005.backblazeb2.com",
#   force_path_style: true
# )

# Rails.application.config.active_storage.service = :amazon
