class SessionsController < ApplicationController
  def create
    
    auth = request.env["omniauth.auth"]
    user = User.find_by_provider_and_uid(auth["provider"], auth["uid"]) || User.create_with_omniauth(auth)
    session[:user_id] = user.id

    token = auth['credentials']['token']
    token_expires_at = auth['credentials']['expires_at']
    user.token = token
    user.token_expires_at = token_expires_at
    user.save!
    
    redirect_to mintyreddit_path, :notice => "Signed in!"
  end

  def destroy
    session[:user_id] = nil
    redirect_to mintyreddit_path, :notice => "Signed out!"
  end
end