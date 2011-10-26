var CLASSmetrotilebase = Class.extend(
	 {
		  // A map where ID is the image URL and the value is a boolean specifying whether confirmed as loaded or not

		  initialize: function(IDdomdiv, script, configmap)
		  {
				this.$$ = configmap;

            this.IDdomdiv = IDdomdiv;
				this.JQNODEdomdiv = $('#'+IDdomdiv);

				this.script = script;

				this.imageloadstatus = {};
				this.imageloadqueue =  new Array();

				this.asyncloadimages();
		  },

		  asyncloadimages: function() {
				_.each(this.script,
						 function(map) {
							  if (map['image']) {
									this.imageloadstatus[map['image']] = null;
									this.imageloadqueue.push(map['image']);
							  }
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

				this.placeactors();

				this.startframe();
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



