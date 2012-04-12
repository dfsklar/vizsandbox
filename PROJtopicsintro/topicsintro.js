$(document).ready(function() {
	 setTimeout(MAIN, 500);
});


function MAIN()
{
	 vz.colors.load();

    var prepCanvasRenderEngine = function($jqcanv) {
        var canvasEl = $jqcanv.get(0);
        canvasEl.width = $jqcanv.width();
        canvasEl.height = $jqcanv.height();
    };

	 var $canvas = $('canvas');
	 prepCanvasRenderEngine($canvas);
	 
	 var stage = new Stage($canvas.get(0));

	 var baseY = 100;


	 var opacitySpeed = -0.1;

	 var cometSpeed = 50;

	 function RandomizeInt(num, percentage)
	 {
		  var ret = Math.round (num + ((Math.random()-0.5)*num*percentage));
		  return ret;
	 }

	 var targetRadius = 50;

	 var startX = 50;
	 var targetX = 800;

	 var rangeX = targetX-startX;

	 var numColorSteps = 100;
    var colors = new vz.Color("#AA0000").stepColorTo(new vz.Color("#FFFF00"), numColorSteps);


	 var isDirty = false;

	 function CreateFadingCircle(x,y) {
		  var theshape = new Shape();

		  var radius = RandomizeInt(targetRadius, 0.25/*percentage*/);

		  var idx = Math.min(numColorSteps-1, Math.round(numColorSteps*(x-startX)/targetX));
		  var coreColor = colors[idx];

		  theshape.graphics
				.setStrokeStyle(0)
				.beginLinearGradientFill(["#000000", coreColor.hex(), "#000000"],[0,0.5,1], 0,-radius,   0,radius)
				.drawCircle(0,0,radius);
		  theshape.x = x;
		  theshape.y = y;
		  theshape.alpha = 0.6;
		  stage.addChild(theshape);
		  isDirty = true;
		  var func = function() {
				theshape.alpha += opacitySpeed;
				isDirty = true;
				if (theshape.alpha > 0) {
					 setTimeout(func, 160);
				}else{
					 stage.removeChild(theshape);
					 console.log("Removing a shape.  The children length is now:");
					 console.log(stage.children.length);
				}
		  };
		  setTimeout(func, 160);
	 }

	 function ExtendJetStream(curx, baseY, spawnDoneYet) {
		  curx += cometSpeed;
		  CreateFadingCircle(curx, baseY);
		  if (curx < targetX) {
				setTimeout(function(){
					 ExtendJetStream(curx,baseY,spawnDoneYet);
				}, 40);
				if ((curx > 300) && (curx < targetX)) {
					 spawnDoneYet = true;
					 if (baseY < 400)
						  ExtendJetStream(startX, baseY+120, false);
				}
		  }
	 }
	 
	 ExtendJetStream(startX, baseY, false);

	 function Refresher() {
		  if (isDirty) {
				stage.update();
				isDirty = false;
				$('#count').text(stage.children.length);
		  }
		  setTimeout(function(){Refresher();},
						 40);
	 }

	 Refresher();
	 
}
