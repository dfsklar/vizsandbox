Handlebars.registerHelper('testhelper', function(property,arg2,arg3) {
  var value = Ember.getPath(this, property);
  return new Handlebars.SafeString('<span class="highlight">'+value+'</span>');
});



Vz.views.CreateViewTweetsMostRetweeted = function()
{
	 Vz.views.tweetsMostRetweeted =
		  Ember.View.create({
										templateName: 'EMBTPLtweetcoll',
										name: "emberView_TwitterMostRetweeted",
										
										// This binding need only be an event, not a deep copy, since
										// we could have the template draw directly from the model.
										// I need to find out if this is a deep copy!
										contentBinding: "Vz.models.tweetsMostRetweeted.content",

										render: function()
										{
											 // At this point, this.content is available and populated
											 this.content.forEach
											 (
												  function(item){
														// WORKS: letting each per-item view have a "content" property:
														//      content: item
														//   and have the template access {{content.text}} for example.
														//   This is NOT true binding so no automated updates.
														// MAYBE: I will try using contentBinding but no way to pass it
														//   a string, so have no idea what to pass it.
														//     FAILED:  contentBinding: item
														// WORKS: Use templateContext: item as that is supposedly
														//   the recommended way to control the content passed to the template.
														var viewonetweet =
															 Ember.View.create(
																  {
																		templateName: 'EMBTPLtweet',
																		templateContext: item
																  });
														viewonetweet.append();
												  },
												  this
											 );
										}
								  });
	 Vz.views.tweetsMostRetweeted.append();
};
