class RedditViewsController < ApplicationController
  
  def index
    @top = RedditContent.get_top current_user, params
    
    respond_to do |format|
      format.html # index.html.erb
      format.json
    end
  end
  
  def saved
    if current_user
      @saved = RedditContent.get_saved current_user, params
    
      respond_to do |format|
        format.html
        format.json
      end
    else
      redirect_to mintyreddit_path, :notice => "You need to sign into reddit first."
    end
  end
  
end
