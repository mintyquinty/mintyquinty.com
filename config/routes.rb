Mintyquinty::Application.routes.draw do
	root :controller => 'static', :action => '/'
  
  # top
  match "/mintyreddit" => "reddit_views#index"
  
  # saved
  match "/myreddit" => "reddit_views#saved"
  
  # oauth2 routes
  match "/auth/reddit/callback" => "sessions#create"
  match "/signout" => "sessions#destroy", :as => :signout

end
