$(document).ready
(
	 function()
	 {

		  // Required before using any metro-tile classes: set up the entire engine.		  
		  // Pass the relative URL of the image containing the triangular "slipcover".
		  INITCLASSmetrotilebase("triangle.png");

		  new CLASSmetrocarousel 
		  ("testcarousel",
			[
				 {
					  image: "starrynight.jpg",
					  caption: "Starry Night"
				 },
				 {
					  image: "http://imgc.allpostersimages.com/images/P-473-488-90/21/2110/278ED00Z/posters/vincent-van-gogh-the-cafe-terrace-on-the-place-du-forum-arles-at-night-c1888.jpg",
					  caption: "Cafe in Arles"
				 },
				 {
					  image: "http://imgc.allpostersimages.com/images/P-473-488-90/21/2107/SA3ED00Z/posters/vincent-van-gogh-almond-branches-in-bloom-san-remy-c1890.jpg",
					  caption: "Almond Tree, San Remy"
				 },
				 {
					  image: "http://imgc.allpostersimages.com/images/P-473-488-90/27/2744/FEBTD00Z/posters/vincent-van-gogh-vase-of-fifteen-sunflowers-c1889.jpg",
					  caption: "Vase of 15 Sunflowers"
				 }
			],
			{
				 "behavior-at-end": "loop",

				 "duration-fadein-image":  3,
				 "duration-fadein-banner": 3,
				 "duration-fadein-text":   3,

				 "algorithm-fadein-image":  PennerTween.linear,
				 "algorithm-fadein-banner": PennerTween.linear,
				 "algorithm-fadein-text":   PennerTween.linear,

				 "duration-fadeout-image":  1,
				 "duration-fadeout-banner": 1,
				 "duration-fadeout-text":   1,

				 "opacity-image":  100, // in percent
				 "opacity-banner": 45,
				 "opacity-text": 100,

				 "duration-hold-on": 3,
				 "duration-hold-off": 0,

				 "duration-slipcover-movement": 2,

				 "margin-below-banner": 18 //in pixels
			}
		  );




		  new CLASSmetrobignum
		  ("testbignum",
			[
				 { 
					  num: "50M",
					  caption: "TweetSheets built today"
				 },
				 {
					  num: "99",
					  caption: "bottles of beer on the wall"
				 },
				 {
					  num: "10",
					  caption: "Commandments"
				 },
				 {
					  num: "5",
					  caption: "golden rings"
				 },
				 {
					  num: "8",
					  caption: "'... days a week'"
				 },
				 {
					  num: "9,892",
					  caption: "... but who's counting?"
				 },
				 {
					  num: "12",
					  caption: "days of Christmas"
				 }
			],
			{
				 "behavior-at-end": "loop",

				 "duration-fadein-image":  0.5,
				 "duration-fadein-banner": 0.5,
				 "duration-fadein-text":   0.5,

				 "algorithm-fadein-image":  PennerTween.linear,
				 "algorithm-fadein-banner": PennerTween.linear,
				 "algorithm-fadein-text":   PennerTween.linear,

				 "duration-fadeout-image":  0.01,
				 "duration-fadeout-banner": 0.01,
				 "duration-fadeout-text":   0.01,

				 "opacity-image":  100, // in percent
				 "opacity-banner": 100,
				 "opacity-text": 100,

				 "duration-slipcover-movement": 1.8,

				 "duration-hold-on": 2,
				 "duration-hold-off": 0
			}
		  );


		  new CLASSmetrotilebase
		  ("testcustom",
			[
			],
			{
				 "duration-slipcover-movement": 1.8
			}
		  );





	 }
);

