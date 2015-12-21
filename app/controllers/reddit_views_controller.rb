class RedditViewsController < ApplicationController
  
  def index
    if current_user
      @top = RedditContent.get_user_top current_user, params
    else
      @top = RedditContent.get_top params
    end
    
    respond_to do |format|
      format.html # index.html.erb
      format.json
    end
  end
  
  def saved
    if current_user
      @saved = RedditContent.get_user_saved current_user, params
    
      respond_to do |format|
        format.html
        format.json
      end
    else
      redirect_to mintyreddit_path, :notice => "You need to sign into reddit first."
    end
  end
  
end
