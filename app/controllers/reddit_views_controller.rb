class RedditViewsController < ApplicationController
  
  def index
    if current_user
      Rails.logger.info "I am logged in."
      @top = RedditContent.get_user_top current_user, params
    else
      @top = RedditContent.get_top params
    end
    
    respond_to do |format|
      format.html # index.html.erb
      format.json
    end
  end
  
end
