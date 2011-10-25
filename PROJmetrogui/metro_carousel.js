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
		  imageloadstatus: {},
		  imageloadqueue: [],

		  initialize: function(IDdomdiv, imagebank, transitionstyle, secsperimage)
		  {
            this.IDdomdiv = IDdomdiv;
				this.JQNODEdomdiv = $('#'+IDdomdiv);
				
				this.imagebank = imagebank;

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
					 imgN.metrobj = this;
					 var JQNODEimg = $(imgN);
					 this.JQNODEdomdiv.append(JQNODEimg);
					 JQNODEimg.css("opacity","1.0");
					 $(imgN).load(function(ev){
											// FUNCTION HAS LOST THE this CONTEXT!
											// TODO: Ask Jeff how to use binding to handle this kind of situation.
											var THIS = ev.target.metrobj;
											THIS.imageloadstatus[ev.currentTarget.attributes["src"].nodeValue] = true;
											THIS.loadNextImage();
									  });
				}else{
					 if (this.EVHNDLallImagesLoaded) 
						  this.EVHNDLallImagesLoaded();
				}
		  },

		  startmovie: function() {
				
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

