class ApiController < ApplicationController
  def index
    render json: { message: "Hello from Rails API!" }
  end
end
