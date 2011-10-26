/*
 * 
 * The data bank must be an array:
 * 
 * [
 *    { num: "53", caption: "number of pies" }, ...
 * ]
 *      
 */
var CLASSmetrobignum = Class.extend(CLASSmetrotilebase,
	 {

		  initialize: function(IDdomdiv, script, configmap)
		  {
				// Call the base class initializer
				this.parent(IDdomdiv, script, configmap);
		  },

		  placeactors: function() {

				this.JQNODEbignumtext = this.JQNODEdomdiv.children(".metrobignum_bignum");
				this.JQNODElabeltext = this.JQNODEdomdiv.children(".metrobignum_labeltext");

				// Setup the banner and label appropriately
				this.JQNODEbignumtext.css(
					 {
						  opacity: "0.0"
					 }
				);
				this.JQNODElabeltext.css(
					 {
						  opacity: "0.0"
					 }
				);

		  },



		  startframe: function() {
				var THIS = this;
				var framedata = this.script[this.frameindex];

//				this.JQNODEbignumtext.empty();
				this.JQNODEbignumtext.html(framedata.num);

//				this.JQNODElabeltext.empty();
				this.JQNODElabeltext.html(framedata.caption);

				// FADE IN THE BANNER
				var tweenieBanner = new PennerOpacityTween(
					 this.JQNODEbignumtext.get(0),
					 this.$$["algorithm-fadein-banner"],
					 0, 
					 this.$$["opacity-banner"], 
					 this.$$["duration-fadein-banner"]);
				tweenieBanner.onMotionFinished = function(){
					 THIS.sleepandthen(THIS.$$["duration-hold-on"],
											 function(){THIS.proceednextframe();})};
				tweenieBanner.start();

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


				// FADE OUTTHE BANNER
				var tweenieBanner = new PennerOpacityTween(
					 this.JQNODEbignumtext.get(0),
					 this.$$["algorithm-fadein-banner"],
					 this.$$["opacity-banner"], 
					 0, 
					 this.$$["duration-fadeout-banner"]);
				tweenieBanner.onMotionFinished = function(){
					 THIS.sleepandthen(THIS.$$["duration-hold-off"], nextstep);};
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
				return true;
		  }
	 }
);



