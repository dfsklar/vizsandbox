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

		  initialize: function(IDdomdiv, imagebank, transitionstyle, secsperimage)
		  {
            this.IDdomdiv = IDdomdiv;
				this.JQNODEdomdiv = $('#'+IDdomdiv);

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
					 // this.JQNODEdomdiv.append(JQNODEimg);
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
				this.gotoframe();
		  },

		  gotoframe: function() {
				var THIS = this;
				var framedata = this.imagebank[this.frameindex];

				// If image not loaded yet for this frame, then delay.
				if (this.imageloadstatus[framedata.image] == null) {
					 setTimeout(function(){THIS.gotoframe();}, 250);
					 return;
				}

				// Setup the frame at its initial 0% opacity
				var JQimgnode = this.imageloadstatus[framedata.image];
				JQimgnode.css("opacity", "0.0");
				JQimgnode.css("width", this.JQNODEdomdiv.width());
				JQimgnode.css("height", this.JQNODEdomdiv.height());
				this.JQNODEdomdiv.append(JQimgnode);

				var tweenie = new PennerOpacityTween(
					 JQimgnode.get(0),
					 PennerTween.linear,
					 0, 100, 2);
				tweenie.onMotionFinished = function(){
					 THIS.proceednextframe();};
				tweenie.start();
		  },

		  proceednextframe: function() {
				alert("WOW");
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
					  caption: "NUMBER 1"
				 },
				 {
					  image: "vaportrail.jpg",
					  caption: "NUMBER 2"
				 }
			],
			"default",
			5
		  );
	 }
);

