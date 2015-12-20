module RedditViewsHelper
  
  def get_image_source path
    src = 'mintyreddit.png'
    case path
    when 'nsfw'
      src = 'mintyreddit_nsfw.png'
    when 'self'
      src = 'mintyreddit.png'
    when ''
      src = 'mintyreddit.png'
    else
      src = path
    end
    src
  end
  
end
