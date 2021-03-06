// You can "require" a module as often as desired.
// A later requirement of dojo/dom will simply immediately
// be fulfilled.
require(
	 [
		  "dojo/dom",
		  "dojo/domReady!"
	 ], 
	 function(dom){
		  //		  alert("dojo modules loaded, and DOM ready!");
		  // Init an Ember application
		  //		  alert("About to launch vizify app and init the tile engine");
		  Vz.EmberApp = Em.Application.create(
				{
					 name: "Vizume",
					 ready: function()
					 {
						  setTimeout(
								function()
								{
									 Vz.models.tweetsMostRetweeted =
										  Vz.models.MostRetweetedCollection.create();
									 Vz.models.tweetsMostRetweeted.set
									 ("url","twitterdata_mostretweeted_14830916.json");
									 
									 // THIS IS INDEED TRICKY
									 // This cannot be done too early.
									 // Except perhaps if we use only dynamic templates, not in-body-at-load-time templates,
									 // then maybe we're ok.
									 Ember.Handlebars.bootstrap();

									 // VIEW CREATION
									 Vz.views.CreateViewTweetsMostRetweeted();
								},
								2000
						  );
						  this._super();
					 }
				}
		  );

		  INITCLASSmetrotilebase("triangle.png");

		  window.metrotile.CLASSmetrobignum.create( 
				{
					 IDdomdiv: "testbignum",
					 script:
					 [
						  { 
								num: "50M",
								caption: "TweetSheets built today"
						  },
						  {
								num: "99",
								caption: "bottles of beer on the wall"
						  },
						  {
								num: "10",
								caption: "Commandments"
						  },
						  {
								num: "5",
								caption: "golden rings"
						  },
						  {
								num: "8",
								caption: "'... days a week'"
						  },
						  {
								num: "9,892",
								caption: "... but who's counting?"
						  },
						  {
								num: "12",
								caption: "days of Christmas"
						  }
					 ],
					 configmap:
					 {
						  "behavior-at-end": "loop",
						  
						  "duration-fadein-image":  0.5,
						  "duration-fadein-banner": 0.5,
						  "duration-fadein-text":   0.5,

						  "algorithm-fadein-image":  PennerTween.linear,
						  "algorithm-fadein-banner": PennerTween.linear,
						  "algorithm-fadein-text":   PennerTween.linear,

						  "duration-fadeout-image":  0.01,
						  "duration-fadeout-banner": 0.01,
						  "duration-fadeout-text":   0.01,

						  "opacity-image":  100, // in percent
						  "opacity-banner": 100,
						  "opacity-text": 100,

						  "duration-slipcover-movement": 1.8,

						  "duration-hold-on": 2,
						  "duration-hold-off": 0
					 }
				}
		  );
	 }
);
