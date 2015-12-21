app.views.reddit.RedditContentsView = Backbone.View.extend({

  events: {
    'click a.save-me': 'saveThisThing'
  },

  initialize: function(options) {
	  this.options = options;
	  this.token = options.token;
	  this.post_url = 'https://oauth.reddit.com/api/';
  },

  saveThisThing: function(e) {
	  e && e.preventDefault();
	  var $e = $(e.currentTarget).closest('a');
	  var state = $e.html();
      var self = this;
	  $.ajax({ url: self.post_url + state,
		  type: 'POST',
		  beforeSend: function(xhr) {xhr.setRequestHeader('Authorization', 'Bearer ' + self.token)},
		  dataType: 'json',
		  data: {
			  category: $e.attr('data-category'), 
			  id: $e.attr('data-kind') + '_' + $e.attr('data-id')
		  },
		  success: function(jsonobj) {
			  if (state == 'save') {
				  $e.html('unsave');
			  } else {
				  $e.html('save');
			  }
		  },
		  error: function(jqXHR, textStatus, errorThrown) {
			  console.log('Thing could not be ' + state + 'd: ' + errorThrown);
		  }
	  });
  }
  
});




