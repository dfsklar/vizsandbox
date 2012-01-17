// You can "require" a module as often as desired.
// A later requirement of dojo/dom will simply immediately
// be fulfilled.
require(
	 [
		  "dojo/dom",
        "dojo/parser",
		  "dojo/domReady!"
	 ], 
	 function(dom, parser, tiles){
		  alert("dojo modules loaded, and DOM ready!");
		  dojo.ready(
				function(){
					 // Init an Ember application
					 alert("About to launch vizify app and init the tile engine");
					 window.VizifyApp = Ember.Application.create();
					 INITCLASSmetrotilebase("http://www.cityofsouthlake.com/SiteContent/70/images/CityDepartments/PublicWorks/water%20construction.jpg");
				}
		  );
    }
);
