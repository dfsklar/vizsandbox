$(document).ready
(
	 function()
	 {
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

				 "margin-below-banner": 18 //in pixels
			}
		  );
	 }
);

