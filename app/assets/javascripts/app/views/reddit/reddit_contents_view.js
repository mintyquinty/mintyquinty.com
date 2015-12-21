app.views.reddit.RedditContentsView = Backbone.View.extend({

  events: {
    'click a.save-me': 'saveThisThing'
  },

  initialize: function(options) {
	  this.options = options;
	  this.token = options.token;
	  this.post_url = 'https://oauth.reddit.com/api/';
  },

  render: function() {
	 /*
	  hmmm....
	  */
  },

  saveThisThing: function(e) {
	  e && e.preventDefault();
	  var $e = $(e.currentTarget);
	  var state = $e.closest('a').html();
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
				  $e.closest('a').html('unsave');
			  } else {
				  $e.closest('a').html('save');
			  }
		  },
		  error: function(jqXHR, textStatus, errorThrown) {
			  console.log('Thing could not be ' + state + 'd: ' + errorThrown);
		  }
	  });

  }
});




