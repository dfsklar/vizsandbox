
var CLASSmetrocarousel = Class.extend(CLASSmetrotilebase,
	 {

		  initialize: function(IDdomdiv, script, configmap)
		  {
				// Call the base class initializer
				this.parent(IDdomdiv, script, configmap);

		  },

		  placeactors: function() {

				this.JQNODEimageholder = this.JQNODEdomdiv.children(".metrocarousel_image");
				this.JQNODEbanner = this.JQNODEdomdiv.children(".metrocarousel_banner");
				this.JQNODElabeltext = this.JQNODEdomdiv.children(".metrocarousel_labeltext");

				// Autosize the DIV that directly holds the image to match the root div
				this.JQNODEimageholder.css(
					 {
						  width: String(this.JQNODEdomdiv.width())+"px",
						  height: String(this.JQNODEdomdiv.height())+"px"
					 });
					 
				// Place the banner and label appropriately
				this.JQNODEbanner.css(
					 {
						  position: "relative",
						  opacity: "0.0",
						  top: 
 						  String(0-this.JQNODEbanner.height()-this.$$["margin-below-banner"])+"px"
					 }
				);
				this.JQNODElabeltext.css(
					 {
						  position: "relative",
						  opacity: "0.0",
						  top: 
 						  String(0 - (this.JQNODEbanner.height()) - (this.JQNODElabeltext.height()) - 
									this.$$["margin-below-banner"] -
									((this.JQNODEbanner.height()-this.JQNODElabeltext.height())/2))
								+"px"
					 }
				);

		  },



		  startframe: function() {
				var THIS = this;
				var framedata = this.script[this.frameindex];

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
					 this.$$["algorithm-fadein-image"],
					 0, 
					 this.$$["opacity-image"],
					 this.$$["duration-fadein-image"]);
				tweenie.onMotionFinished = function(){
					 THIS.sleepandthen(THIS.$$["duration-hold-on"],
											 function(){THIS.proceednextframe();})};
				tweenie.start();


				// FADE IN THE BANNER
				var tweenieBanner = new PennerOpacityTween(
					 this.JQNODEbanner.get(0),
					 this.$$["algorithm-fadein-banner"],
					 0, 
					 this.$$["opacity-banner"], 
					 this.$$["duration-fadein-banner"]);
				tweenieBanner.start();

				this.JQNODElabeltext.html(framedata.caption);

				var tweenieText = new PennerOpacityTween(
					 this.JQNODElabeltext.get(0),
					 this.$$["algorithm-fadein-text"],
					 0,
					 this.$$["opacity-text"], 
					 this.$$["duration-fadein-text"]);
				tweenieText.start();
		  },



		  endframe: function(nextstep) {
				var THIS = this;
				var framedata = this.script[this.frameindex];

				// Setup the frame at its initial 0% opacity
				var JQimgnode = this.imageloadstatus[framedata.image];

				// FADE OUT THE IMAGE
				var tweenie = new PennerOpacityTween(
					 JQimgnode.get(0),
					 this.$$["algorithm-fadein-image"],
					 this.$$["opacity-image"],
					 0, 
					 this.$$["duration-fadeout-image"]);
				tweenie.onMotionFinished = function(){
					 THIS.sleepandthen(THIS.$$["duration-hold-off"], nextstep);};
				tweenie.start();


				// FADE OUTTHE BANNER
				var tweenieBanner = new PennerOpacityTween(
					 this.JQNODEbanner.get(0),
					 this.$$["algorithm-fadein-banner"],
					 this.$$["opacity-banner"], 
					 0, 
					 this.$$["duration-fadeout-banner"]);
				tweenieBanner.start();

				var tweenieText = new PennerOpacityTween(
					 this.JQNODElabeltext.get(0),
					 this.$$["algorithm-fadein-text"],
					 this.$$["opacity-text"], 
					 0,
					 this.$$["duration-fadeout-text"]);
				tweenieText.start();
		  },



		  readyforframe: function(framenum) {
				// If the next frame's image is not loaded yet, defer
				var nextframedata = this.script[framenum];
				return  ! (this.imageloadstatus[nextframedata.image] == null);
		  }
	 }
);



