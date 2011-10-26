/*
 * 
 * The script given to the constructor
 * is an array of this format:
 * [
 *    { image: "relativeorabs url",
 *      caption: "Wharton" },
 *    { image: ... }
 * ]
 *         
 * The transition styles supported are:
 *    "blackoutfadein": as in Christian's movie:
 *       the prev image blacks out very quickly, but the
 *       next image then fades in slowly and the banner
 *       follows a few seconds behind.
 * 
 * Currently, stretching the image to exactly match the DIV's
 * dimensions is the default behavior.
 */



var CLASSmetrocarousel = Class.extend(
	 {
		  // A map where ID is the image URL and the value is a boolean specifying whether confirmed as loaded or not

		  initialize: function(IDdomdiv, imagebank, configmap)
		  {
				this.$$ = configmap;
				// "marginBelowBanner": num in pixels
				// "transitionstyle": right now this is ignored


            this.IDdomdiv = IDdomdiv;
				this.JQNODEdomdiv = $('#'+IDdomdiv);

				this.JQNODEimageholder = this.JQNODEdomdiv.children(".metrocarousel_image");
				this.JQNODEbanner = this.JQNODEdomdiv.children(".metrocarousel_banner");
				this.JQNODElabeltext = this.JQNODEdomdiv.children(".metrocarousel_labeltext");

				this.imagebank = imagebank;

				this.imageloadstatus = {};
				this.imageloadqueue =  new Array();

				this.asyncloadimages();
		  },

		  asyncloadimages: function() {
				_.each(this.imagebank,
						 function(map) {
							  this.imageloadstatus[map['image']] = null;
							  this.imageloadqueue.push(map['image']);
						 },
						 this);
				this.loadNextImage();
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

				// Place the banner and label appropriately
				this.JQNODEbanner.css(
					 {
						  position: "relative",
						  opacity: "0.0",
						  top: 
 						  String(0-this.JQNODEbanner.height()-12)+"px"
					 }
				);
				this.JQNODElabeltext.css(
					 {
						  position: "relative",
						  opacity: "0.0",
						  top: 
 						  String(0 - (this.JQNODEbanner.height()) - (this.JQNODElabeltext.height()) - 12 -
									((this.JQNODEbanner.height()-this.JQNODElabeltext.height())/2))
								+"px"
					 }
				);

				this.startframe();
		  },



		  startframe: function() {
				var THIS = this;
				var framedata = this.imagebank[this.frameindex];

				// If image not loaded yet for this frame, then delay.
				if (this.imageloadstatus[framedata.image] == null) {
					 setTimeout(function(){THIS.startframe();}, 250);
					 return;
				}

				// Setup the frame at its initial 0% opacity
				var JQimgnode = this.imageloadstatus[framedata.image];
				JQimgnode.css(
					 {opacity: "0.0",
					  width:  this.JQNODEdomdiv.width(),
					  height: this.JQNODEdomdiv.height()
					  });
				this.JQNODEimageholder.empty();
				this.JQNODEimageholder.append(JQimgnode);

				// FADE IN THE IMAGE
				var tweenie = new PennerOpacityTween(
					 JQimgnode.get(0),
					 PennerTween.linear,
					 0, 100, 2);
				tweenie.onMotionFinished = function(){
					 THIS.sleepandthen(6,
											 function(){THIS.proceednextframe();})};
				tweenie.start();


				// FADE IN THE BANNER
				var tweenieBanner = new PennerOpacityTween(
					 this.JQNODEbanner.get(0),
					 PennerTween.linear,
					 0, 40, 3);
				tweenieBanner.start();

				this.JQNODElabeltext.html(framedata.caption);

				var tweenieText = new PennerOpacityTween(
					 this.JQNODElabeltext.get(0),
					 PennerTween.linear,
					 0, 100, 3);
				tweenieText.start();
		  },



		  endframe: function(nextstep) {
				var THIS = this;
				var framedata = this.imagebank[this.frameindex];

				// Setup the frame at its initial 0% opacity
				var JQimgnode = this.imageloadstatus[framedata.image];

				// FADE OUT THE IMAGE
				var tweenie = new PennerOpacityTween(
					 JQimgnode.get(0),
					 PennerTween.linear,
					 100, 0, 1);
				tweenie.onMotionFinished = function(){
					 THIS.sleepandthen(0, nextstep);};
				tweenie.start();


				// FADE OUTTHE BANNER
				var tweenieBanner = new PennerOpacityTween(
					 this.JQNODEbanner.get(0),
					 PennerTween.linear,
					 40, 0, 0.75);
				tweenieBanner.start();

				this.JQNODElabeltext.html(framedata.caption);

				var tweenieText = new PennerOpacityTween(
					 this.JQNODElabeltext.get(0),
					 PennerTween.linear,
					 100, 0, 0.75);
				tweenieText.start();
		  },












		  sleepandthen: function(numsec, arg) {
				var THIS = this;
				setTimeout(function(){arg();}, numsec*1000);
		  },

		  planincrementframeindex: function() {
				this.nextframeindex = this.frameindex+1;
				if (this.nextframeindex >= this.imagebank.length)
					 this.nextframeindex=0;
		  },

		  proceednextframe: function() {
				var THIS = this;

				// If there is only one frame, do nothing; this movie is over, looping makes no sense.
				if (this.imagebank.length == 1)
					 return;

				this.planincrementframeindex();

				// If the next frame's image is not loaded yet, defer
				var nextframedata = this.imagebank[this.nextframeindex];
				if (this.imageloadstatus[nextframedata.image] == null) {
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



$(document).ready
(
	 function()
	 {
		  window.TESTOBJ = new CLASSmetrocarousel 
		  ("testcarousel",
			[
				 {
					  image: "starrynight.jpg",
					  caption: "\"Starry Night\""
				 },
				 {
					  image: "vaportrail.jpg",
					  caption: "\"Vapor Trail\"\""
				 }
			],
			"default",
			5
		  );
	 }
);

