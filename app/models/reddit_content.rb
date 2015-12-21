class RedditContent < ActiveRecord::Base
  include HTTParty

  def self.get_top params
    query = { "count" => 25, "raw_json" => 1 }
    query[:after] = params['after'] if params['after']
    query[:before] = params['before'] if params['before']
    payload = get("https://www.reddit.com/top.json?", :query => query)
    if payload.success?
      payload
    else
      raise payload.response  
    end
  end

  def self.get_user_top current_user, params
    headers = { "Authorization" => "Bearer #{current_user.token}", "User-Agent" => "web.com.mintyquinty.mintyreddit:v0.0.9 (by /u/mintyquinty)" }
    query = { "count" => 25, "raw_json" => 1 }
    query[:after] = params['after'] if params['after']
    query[:before] = params['before'] if params['before']
    payload = get("https://oauth.reddit.com/top.json", :query => query, :headers => headers)
    if payload.success?
      payload
    else
      raise payload.response  
    end
  end
  
  def self.get_user_saved current_user, params
    headers = { "Authorization" => "Bearer #{current_user.token}", "User-Agent" => "web.com.mintyquinty.mintyreddit:v0.0.9 (by /u/mintyquinty)" }
    query = { "count" => 25, "raw_json" => 1 }
    query[:after] = params['after'] if params['after']
    query[:before] = params['before'] if params['before']
    payload = get("https://oauth.reddit.com/user/#{current_user.name}/saved.json", :query => query, :headers => headers)
    if payload.success?
      payload
    else
      raise payload.response  
    end
  end
  
end