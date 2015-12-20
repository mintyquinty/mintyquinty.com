Mintyquinty::Application.routes.draw do
	root :controller => 'static', :action => '/'
  
  match "/mintyreddit" => "reddit_views#index"
  
  match "/auth/reddit/callback" => "sessions#create"
  
  match "/signout" => "sessions#destroy", :as => :signout

end
