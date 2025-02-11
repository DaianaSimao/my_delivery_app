class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  def sign_up(resource_name, resource)
  end

  private

  def respond_with(resource, _opts = {})
    token = resource.generate_jwt

    if resource.persisted?
      render json: { user: resource, token: token }, status: :created
    else
      render json: { error: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end
end
