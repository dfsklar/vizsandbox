/* 
 * Here we look at an example of a model that
 * is directly connected to a server-side script
 * that returns a JSON structure representing a 
 * collection.  Our protocol for JSON structures
 * is:
 * {
 *    success: true/false,
 *    tweets: [
 *        { _id: { $oid: ...},
 *          created_at: ...
 *          retweet_count: 3
 *          id: ____
 *          text: ____
 *        }
 * 
 * Currently, this model handles "success:false"
 * by simply setting up another poll soon.
 * This does NOT yet support partial results.
 * 
 * To use:
 * 1) Create an instance.
 * 2) Set the timeout property: the number of
 *    seconds after which retries should not even
 *    be made and the assumption should be that
 *    the data will never arrive.
 * 3) Set the URL property.
 * 2) Call fetch() to force the retrieval.
 *    This is async; it returns immediately having
 *    set up timers to do one/continuous server polls.
 */


Vz.models.Tweet = Em.Object.extend();

Vz.models.MostRetweetedCollection =
	 Em.ArrayController.extend(
		  {
				content: [],

				init: function()
				{
					 this._super();
				},

				url: "",

				refresh: function() {
					 this.fetch();
				},

				fetch: function() {
					 var THIS = this;
					 $.getJSON(this.url,
								  function(d)
								  {
										if (d.success) {
											 d.tweets.forEach(
												  function(item)
												  {
														THIS.pushObject
														(Vz.models.Tweet.create(item));
												  }
											 );
										}
								  }
								 );
				}.observes("url")
		  }
	 );
