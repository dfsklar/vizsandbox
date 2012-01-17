
// Create a namespace bucket
// this must be done only once!
window.metrotile = {
};


// Awkwardnesses here:
// 1) The way I implement waiting for the singleton instance to be ready.
// 2) My use of "THIS" to somehow send context to the .load callback.


// A singleton class used to preload any resources
// needed by all metro tiles.  Each tile will suspend
// its execution until this singleton states that all is well.


window.metrotile.CLASSmetrotilebase_static = Ember.Object.extend(
	 {
		  readyforuse: false,

		  slipcoverimage: null,

		  existingTiles: {},

		  // Sklar is guessing that init will be auto-invoked: HE WAS RIGHT but was not documented by Ember doc.
		  // We now know that "init" will not receive any params.
		  // But "this" already has any properties sent in the hashtable sent to "create".
		  init: function()
		  {
				var THIS = this;
				this.curscreen = "HOME";
				this.intransition = false;
				this.slipcoverimage = new Image();
				this.slipcoverimage.src = this.urlSlipcoverimage;

				// This next line adds a onLoaded event handler via JQuery
				// Note the awkward need for "THIS" for passing scope.
				// Note also that the DOM IMG "load" event is not reliable in actuality!
				if (true) {
					 // THIS WORKS
					 // THIS WORKS
					 // THIS WORKS
					 $(this.slipcoverimage).load
					 (
						  function(ev){
								THIS.markAsReady();
						  }
					 );
				}

				// Let's try DOJO's technique for connecting events without awkward "THIS""
				if (false) {
					 // THIS FAILS
					 // THIS FAILS
					 // THIS FAILS
					 alert("About to try to do a DOJO connect");
					 require(["dojo/_base/connect"], 
						  function(connect)
						  {
								alert("About to actually connect");
								connect.connect(this.slipcoverimage, "onLoad", this, this.markAsReady);
								alert("conn made");
						  }
						 );
				}
		  },

		  markAsReady: function() {
				alert("the image bitmap has been loaded");
				this.readyforuse = true;
		  },


		  // SCREEN STATE
		  screentypes: ["HOME", // the tile set, i.e. not on a detail screen
							 "linkedin-basics", // linked-in timeline, board table, overview, skillset
							 "twitter-topics"  // the topic swimlane, top tweeters
							],

		  curscreen: null,
		  intransition: null
	 }
);

var SINGLETONmetrotilebase_static = null;  // GLOBAL


function INITCLASSmetrotilebase(slipcoverimage)
{
	 SINGLETONmetrotilebase_static = window.metrotile.CLASSmetrotilebase_static.create({urlSlipcoverimage: slipcoverimage});
}


// ******************************************




window.metrotile.CLASSmetrotilebase = Ember.Object.extend(
	 {
		  // A map where ID is the image URL and the value is a boolean specifying whether confirmed as loaded or not

		  init: function() /*Caller must mixin these: IDdomdiv, script, configmap*/
		  {
				var THIS = this;
				if ( ! SINGLETONmetrotilebase_static.readyforuse) {
					 // We must delay until the entire engine is ready for use.
					 setTimeout(
						  function(){
								THIS.init();
						  }
						  , 250);
				}else{
					 alert("Hey, we have a go-ahead to proceed!");
					 this._initialize();
				}
		  },



		  // Make the tile infinitely manipulable by taking it out of its geometric
		  // context, making it absolutely positioned, changing its parentage to the
		  // window as a whole (or the body?) and readying it for movement anywhere.
		  absolutize: function() {
				var tile = this.JQNODEdomdiv;
				// Abs position is: tile.offset().left or .top
				tile.css(
					 {
						  position: "absolute",
						  left: tile.offset().left,
						  top: tile.offset().top
					 });
				$("body").append(tile);
		  },



		  handleMouseEnter: function() {
				if ( ! SINGLETONmetrotilebase_static.intransition)
					 if (SINGLETONmetrotilebase_static.curscreen == "HOME") {
						  this.JQNODEdomdiv.css
						  (
								{border: "1px dotted rgb(256,256,256)"}
						  );
					 }
		  },


		  handleMouseLeave: function() {
				this.JQNODEdomdiv.css
				(
					 {border: "1px dotted rgba(5,5,5,0)"}
				);
		  },



		  handleMouseClick: function() {
		  },


		  _initialize: function() { 
				var IDdomdiv = this.IDdomdiv;
				var script = this.script;
				var configmap = this.configmap;
				
				var THIS = this;

				SINGLETONmetrotilebase_static.existingTiles[IDdomdiv] = THIS;

				this.$$ = configmap;

            this.IDdomdiv = IDdomdiv;
				this.JQNODEdomdiv = $('#'+IDdomdiv);
				this.JQNODEdomdiv.css("overflow","hidden");
				this.JQNODEdomdiv.attr("data-semantics","metrotileroot");
				this.JQNODEdomdiv.data("metrotile", this);

				// This initializes the one-pixel border used for highlighting the
				// "currently in-focus" tile.
				this.handleMouseLeave();

				// Register the event handlers
				this.JQNODEdomdiv.mouseenter(
					 function(){
						  THIS.handleMouseEnter();
					 }
				);
				this.JQNODEdomdiv.mouseleave(
					 function(){
						  THIS.handleMouseLeave();
					 }
				);
				this.JQNODEdomdiv.click(
					 function(){
						  THIS.handleMouseClick();
					 }
				);
				

				this.placeactors();

				this.JQNODEslipcover = this.JQNODEdomdiv.children('.slipcover');
				// The JQNODEslipcover.offset() will return absolute position values for top and left, NOT relative!
				// Subtract the domdiv's offsets to get the correct values for moving the slipcover.
				if (this.JQNODEslipcover.length > 0) {
					 var deltatorepos = (this.JQNODEslipcover.offset().top - this.JQNODEdomdiv.offset().top);
					 this.JQNODEslipcover.css(
						  {
								"position": "relative",
								"z-index": "30",
								"top": String(0-deltatorepos)+"px"
						  }
					 );
					 this.sliptweenie = new PennerTween(
						  this.JQNODEslipcover.get(0).style,
						  "top",
						  PennerTween.linear,
						  0-deltatorepos,
						  0-deltatorepos-1000,
						  this.$$["duration-slipcover-movement"],
						  "px"
					 );
					 this.sliptweenie.start();
				}

				// The slipcover should now be in its initial position,
				// so it's OK to let the root div be seen.
				this.JQNODEdomdiv.css("opacity","1.0");

				this.script = script;

				this.imageloadstatus = {};
				this.imageloadqueue =  new Array();

				this.asyncloadimages();
		  },


		  asyncloadimages: function() {
				// This "each" loop initializes the queue of images to be loaded,
				// but does not init any loading activity.
				_.each(this.script,
						 function(map) {
							  if (map['image']) {
									this.imageloadstatus[map['image']] = null;
									this.imageloadqueue.push(map['image']);
							  }
						 },
						 this);
				//
				// TODO: The loading of images is sequential currently!
				// This simply starts the loading of the first image in the queue.
				this.loadNextImage();
				//
				// TODO: this really shouldn't occur until the first image is loaded!
				//    (with special consideration for tiles that don't involve images).
				this.startmovie();
		  },



		  loadNextImage: function() {
				if (this.imageloadqueue.length > 0) {
					 var imgN = new Image();
					 imgN.src = this.imageloadqueue.shift();
					 console.log(imgN.src);
					 imgN.metrobj = this;
					 var JQNODEimg = $(imgN);
					 JQNODEimg.css("opacity","1.0");
					 $(imgN).load(function(ev){
											// FUNCTION HAS LOST THE this CONTEXT!
											// TODO: Ask Jeff how to use binding to handle this kind of situation.
											var THIS = ev.target.metrobj;
											THIS.imageloadstatus[ev.currentTarget.attributes["src"].nodeValue] = 
												 $(ev.currentTarget);
											THIS.loadNextImage();
									  });
				}else{
					 if (this.EVHNDLallImagesLoaded) 
						  this.EVHNDLallImagesLoaded();
				}
		  },

		  startmovie: function() {
				this.frameindex = 0;

				this.startframe();
		  },


		  placeactors: function() {
				// This is just a stub to be overridden.
		  },
		  startframe: function() {
				// This is just a stub to be overridden.
		  },
		  endframe: function() {
				// This is just a stub to be overridden.
		  },


		  sleepandthen: function(numsec, arg) {
				var THIS = this;
				setTimeout(function(){arg();}, numsec*1000);
		  },


		  // returns false if the animation should be stopped immediately, i.e. do not move to any "next frame"
		  planincrementframeindex: function() {
				this.nextframeindex = this.frameindex+1;
				if (this.nextframeindex >= this.script.length) {
					 if (this.$$["behavior-at-end"] == "loop")
						  this.nextframeindex=0;
					 else
						  return false;
				}
				return true;
		  },

		  proceednextframe: function() {
				var THIS = this;

				// If there is only one frame, do nothing; this movie is over, looping makes no sense.
				if (this.script.length == 1)
					 return;

				if ( ! this.planincrementframeindex()) {
					 return;
				}

				if ( ! this.readyforframe(this.nextframeindex)) {
					 setTimeout(function(){THIS.proceednextframe();}, 250);
					 return;
				}

				// Fade out the current frame, and ensure the increment process proceeds thereafter
				var THIS=this;
				THIS.endframe(
					 function(){
						  THIS.frameindex = THIS.nextframeindex;
						  THIS.startframe();
					 });
		  }
	 }
);
