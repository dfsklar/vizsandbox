$(document).ready(function() {
	 setTimeout(MAIN, 500);
});


/*

TAGS:

varycolor-varyradius-circleonly

singlecolor-varyoval-varygradient
   Each lane has a single color, so we can
   match the colors of the circles on that lane.
   Each obj starts out as a circle, but then
   stretches into an oval as it fades out.

*/



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

	 var baseY = 70;

	 var opacitySpeed = -0.03;

	 var cometSpeed = 15;
	 var ellipseStretchSpeed = 8;

	 function RandomizeInt(num, percentage)
	 {
		  var ret = Math.round (num + ((Math.random()-0.5)*num*percentage));
		  return ret;
	 }

	 var targetRadius = 70;

	 var startX = 50;
	 var targetX = 800;

	 var rangeX = targetX-startX;

	 var numColorSteps = 4;
    var colors = new vz.Color("#FF0000").stepColorTo(new vz.Color("#FFFF00"), numColorSteps);

	 var isDirty = false;

	 function CreateFadingCircle(x,y,coreColor) {
		  var theshape = new Shape();

		  var radius;
				// varying the ellipses's height proved disastrous
				// instead we'll vary its gradient
				// = RandomizeInt(targetRadius, 0.15/*percentage*/);
		  radius = targetRadius;
		  
		  var gradientMileposts = 
				[
					 coreColor.darken(85),
					 coreColor,
					 coreColor.darken(85)
				];

		  var thelength = RandomizeInt(targetRadius, 0.15/*percentage*/);

		  var RND = function() {
				return Math.round(Math.random()*20);
		  }

		  var drawme = function() {
				theshape.graphics
					 .clear()
					 .setStrokeStyle(0)
					 .beginLinearGradientFill(
						  [
								gradientMileposts[0].darken(RND()).saturate(RND()).hex(),
								gradientMileposts[1].darken(RND()).saturate(RND()).hex(),
								gradientMileposts[2].darken(RND()).saturate(RND()).hex()
						  ]
						  ,[0.5,0.75,1], 0,-radius, 0,radius)
					 .drawEllipse(0,0,thelength,radius);
		  }


// CIRCLES:  the gradient fill ratios work correctly for circles but not ellipses
//					 .beginLinearGradientFill(["#FF0000", "#00FF00"],[0,1], 0,-radius,   0,radius)
//					 .drawCircle(0,0,radius);

// BUG in drawEllipse: the top of the ellipse is ratio 0.5

		  theshape.x = x;
		  theshape.y = y;

		  theshape.alpha = 0.6;

		  stage.addChild(theshape);
		  isDirty = true;
		  var func = function() {
				thelength += ellipseStretchSpeed;
				drawme();
				theshape.alpha += opacitySpeed;
				isDirty = true;
				if (theshape.alpha > 0) {
					 setTimeout(function(){func();}, 160);
				}else{
					 stage.removeChild(theshape);
				}
		  };
		  setTimeout(function(){func();}, 160);
	 }

	 var redcolor = new vz.Color("#FF0000");
	 function ExtendJetStream(curx, baseY, idxColor, spawnDoneYet) {
		  curx += cometSpeed;
		  CreateFadingCircle(curx, baseY, colors[idxColor]);
		  if (curx < targetX) {
				setTimeout(function(){
					 ExtendJetStream(curx,baseY,idxColor,spawnDoneYet);
				}, 40);
				if (!spawnDoneYet) {
					 if ((curx > 300) && (curx < targetX)) {
						  spawnDoneYet = true;
						  if (baseY < 400)
								ExtendJetStream(startX, baseY+100, idxColor+1, false);
					 }
				}
		  }
	 }
	 
	 
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


	 ExtendJetStream(startX, baseY, 0/*idxColorForLanes*/, false);
}
