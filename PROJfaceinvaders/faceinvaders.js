$(document).ready
(
	 function()
	 {
		  // PROGRAM INITIALIZATION GOETH HERE.
		  // PROGRAM INITIALIZATION GOETH HERE.
		  // PROGRAM INITIALIZATION GOETH HERE.

		  $JQ = $;


		  window.GAME = new CLASSfaceinvaders ("thecanvas");
		  window.addEventListener('keydown',
										  function(evt){
												window.GAME.handleEvent_KEYDOWN(evt);
										  },
										  true);
	 }
);
