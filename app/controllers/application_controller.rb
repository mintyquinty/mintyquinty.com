class ApplicationController < ActionController::Base
  protect_from_forgery

  helper_method :current_user

  private

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
    if @current_user && Time.at(@current_user.token_expires_at) > Time.now
      @current_user
    else
      nil
    end
    
  end

end