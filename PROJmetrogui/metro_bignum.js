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

		  initialize: function(IDdomdiv, data, configmap)
		  {
				// Call the base class initializer
				this.parent(IDdomdiv, new Array(), configmap);

				this.databank = data;
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
				var framedata = this.databank[this.frameindex];

//				this.JQNODE.bignumtext.empty();
				this.JQNODE.bignumtext.html(framedata.num);

//				this.JQNODE.labeltext.empty();
				this.JQNODE.labeltext.html(framedata.num);

				// FADE IN THE BANNER
				var tweenieBanner = new PennerOpacityTween(
					 this.JQNODEbignumtext.get(0),
					 this.$$["algorithm-fadein-banner"],
					 0, 
					 this.$$["opacity-banner"], 
					 this.$$["duration-fadein-banner"]);
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
				var framedata = this.imagebank[this.frameindex];


				// FADE OUTTHE BANNER
				var tweenieBanner = new PennerOpacityTween(
					 this.JQNODEbignumtext.get(0),
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
				return true;
		  }
	 }
);



