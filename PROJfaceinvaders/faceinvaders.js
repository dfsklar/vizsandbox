$(document).ready
(
	 function()
	 {
		  // PROGRAM INITIALIZATION GOETH HERE.
		  // PROGRAM INITIALIZATION GOETH HERE.
		  // PROGRAM INITIALIZATION GOETH HERE.

		  $JQ = $;


		  // CREATES A SINGLETON so no need to capture the object handle:
		  new CLASShtml5audio(
				[
					 {
						  name: "shootfriendlybullet",
						  src: "shootfriendlybullet.mp3"
					 },
					 {
						  name: "killalien",
						  src: "killalien.mp3"
					 }
				]
		  );


		  window.GAME = new CLASSfaceinvaders ("thecanvas");
		  window.addEventListener('keydown',
										  function(evt){
												window.GAME.handleEvent_KEYDOWN(evt);
										  },
										  true);
	 }
);
