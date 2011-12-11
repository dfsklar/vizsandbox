// SINGLETON
var SINGLETONhtml5audio = null;


var CLASShtml5audio = Class.extend(
	 {

		  // CODE WILL BE STOLEN FROM:
		  //   view-source:http://soundjs.com/examples/TestSuite.html
		  //   view-source:http://soundjs.com/examples/TestSuite.html
		  //   view-source:http://soundjs.com/examples/TestSuite.html
		  //   view-source:http://soundjs.com/examples/TestSuite.html
		  //   view-source:http://soundjs.com/examples/TestSuite.html
		  //   view-source:http://soundjs.com/examples/TestSuite.html
		  //   view-source:http://soundjs.com/examples/TestSuite.html
		  //   view-source:http://soundjs.com/examples/TestSuite.html
		  //   view-source:http://soundjs.com/examples/TestSuite.html
		  //   view-source:http://soundjs.com/examples/TestSuite.html
		  //   view-source:http://soundjs.com/examples/TestSuite.html
		  //   view-source:http://soundjs.com/examples/TestSuite.html
		  //   view-source:http://soundjs.com/examples/TestSuite.html
		  //   view-source:http://soundjs.com/examples/TestSuite.html
		  //   view-source:http://soundjs.com/examples/TestSuite.html
		  //   view-source:http://soundjs.com/examples/TestSuite.html
		  //   view-source:http://soundjs.com/examples/TestSuite.html



		  // Each value in the array must be a map having these values:
		  //    name: an arbitrary string to use as a lookup ID
		  //    src: a URL
		  //    instances: optional, default 1
		  initialize: function(ARRsoundstoload)
		  {
				if (SINGLETONhtml5audio)
					 return;
				SINGLETONhtml5audio = this;

				this.ARRsounds = ARRsoundstoload;
				SoundJS.addBatch(this.ARRsounds);
				SoundJS.onLoadQueueComplete = alert;
				SoundJS.onSoundLoadComplete = alert;
				SoundJS.onProgress = alert;
				//SINGLETONhtml5audio.handleAllComplete;
		  },




		  "FIN": "FIN"
	 }
);
