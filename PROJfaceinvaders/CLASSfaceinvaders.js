// FRIENDLY BULLET (i.e. bullet shot by player *towards* the aliens
var CLASSfaceinvFriendlyBullet = Class.extend(
	 {
		  shape: null,
		  x: 0,
		  y: 0,
		  game: null,
		  CFG: null,

		  initialize: function(x)
		  {
				this.game = GAME;
				this.CFG = this.game.CFG;
				this.x = x;
				this.y = this.CFG.YtopOfShooter;

				this.shape = new Shape();
				this.shape.graphics
					 .beginStroke("black")
					 .setStrokeStyle(1.2/*thickness*/, "round")
					 .moveTo(0,0)
					 .lineTo(0,3);
				this.shape.x = this.x;
				this.shape.y = this.y;
				this.game.stage.addChild(this.shape);
				this.game.stage.update();
		  },


		  // This is called once per "game fast-increment cycle"
		  step: function()
		  {
				this.shape.y -= this.CFG.friendlyBulletUnitsPerFastStep;
				if (this.shape.y < -10) {
					 // This bullet is now well offscreen (flew off the top) so delete it.
					 this.game.activeFriendlyBullets.remove(this);
				}
				this.game.stage.update();
		  },
		  

		  fin: "fin"
	 }
);







// ALIEN MONSTER
var CLASSfaceinvAlien = Class.extend(
	 {
		  shape: null,
		  x: 0,
		  y: 0,
		  game: null,
		  CFG: null,

		  initialize: function(leftx,topy)
		  {
				this.game = GAME;
				this.CFG = this.game.CFG;
				this.x = leftx;
				this.y = topy;

				this.shape = new Shape();
				this.shape.graphics
					 .beginFill("black")
					 .drawRect(0,0,
								  this.CFG.widthAlienShip, this.CFG.heightAlienShip)
					 .endFill();
				this.shape.x = leftx;
				this.shape.y = topy;
				this.game.stage.addChild(this.shape);
				this.game.stage.update();
		  },


		  // This is called once per "alien shift cycle"
		  step: function()
		  {
				if (this.game.thisAlienShiftShouldDescend) {
					 this.shape.y += this.CFG.alienShiftVertUnitsPerDescent;
				}
				else {
					 this.shape.x += this.game.directionAlienShift 
						  * this.CFG.alienShiftHorizUnitsPerStep;
				}

				//Check for this alien being too close to left/right edge of canvas
				if (this.game.directionAlienShift < 0) 
				{
					 if (this.shape.x < this.CFG.alienShiftHorizUnitsPerStep) {
						  this.game.nextAlienShiftShouldDescend = true;
					 }
				}
				else 
				{
					 if (				
						  (
								this.game.canvasWidth -
									 (this.shape.x + this.CFG.widthAlienShip)
						  )
						  <
						  this.CFG.alienShiftHorizUnitsPerStep
					 )
					 {
						  this.game.nextAlienShiftShouldDescend = true;
					 }
				}
				this.game.stage.update();
		  },
		  

		  fin: "fin"
	 }
);






var CLASSfaceinvaders = Class.extend(
	 {

		  CFG: 
		  {
				"marginBottom": 5,
				"widthShooter": 12,
				"heightShooter": 9,
				"YtopOfShooter": null,
				"heightAlienRow": 17,
 				"heightAlienShip": 10,
				"widthAlienShip": 20,
				"horizPaddingAlienShip": 10,  /* num of units between two aliens on same row */
				"numAliensPerRow": 9,
				"numAlienRows": 3,    /* does not count the reserved superalien row at very top */

				"friendlyBulletUnitsPerFastStep": 5,
				"alienShiftHorizUnitsPerStep": 7,
				"alienShiftVertUnitsPerDescent": 9,

				"millisecPerFastStep": 80,
				"millisecPerAlienShift": 200,

				"FIN":"FIN"
		  },

		  nextAlienShiftShouldDescend: false,		  
		  directionAlienShift: 1,  // +1 means shift right, -1 means shift left


		  initialize: function(IDofCanvasDomnode)
		  {
				// This is a singleton, so initialize the global handle.
				GAME = this;

				if (IDofCanvasDomnode) {
					 this.IDofCanvasDomnode = IDofCanvasDomnode;
				}

				// CONSTRUCT THE STAGE
				this.jqcanv = $JQ('#'+this.IDofCanvasDomnode);  //'CanvasBarChartGame'
				this.canvas = this.jqcanv.get(0);
				this.gleanCanvasDimensions();
				this.stage = new Stage(this.canvas);

				
				// CONSTRUCT THE SHOOTER in its own modeling coordsys
				// 0,0 is the tip of the shooter, and its base is in positive-y territory
				this.gameobjShooter = new Shape();
				var GOBJ = this.gameobjShooter;
				var x = 5;
				GOBJ.graphics.beginFill("#3F352A")
					 .moveTo(0,0)
					 .lineTo(-this.CFG.widthShooter/2, this.CFG.heightShooter)
					 .lineTo( this.CFG.widthShooter/2, this.CFG.heightShooter)
					 .lineTo(0,0)
					 .endFill();
				//
				// Now place the shooter in the world coordinates
				GOBJ.x = (this.canvasWidth/2);
				GOBJ.y = (this.canvasHeight - this.CFG.marginBottom - this.CFG.heightShooter);
				this.CFG.YtopOfShooter = GOBJ.y;
				this.stage.addChild(GOBJ);





				// CONSTRUCT THE ALIENS
				this.alienRows = new Array();
				// index 0 is reserved for the superalien
				this.alienRows.push(new Array());  // for the superalien
				// index 1 is therefore the topmost row of regular aliens
				// each member of the array is itself an array
				this.constructAlienRow(1);
				this.constructAlienRow(2);
				this.constructAlienRow(3);



				this.activeFriendlyBullets = new $SET();
				this.activeEnemyBullets = new $SET();

				this.stage.update();

				this.stepfast();
				this.stepalienshift();
		  },

		  constructAlienRow: function(rownum) 
		  {
				var newrow = new Array();
				this.alienRows.push(newrow);
				for (i=0; i<this.CFG.numAliensPerRow; i++) {
					 newrow.push(this.constructAlien(rownum,i));
				}
		  },

		  // Returns the object representing a single alien
		  constructAlien: function(rownum,indexwithinrow) 
		  {
				var x = 
					 new CLASSfaceinvAlien(
						  indexwithinrow*(this.CFG.widthAlienShip+
												this.CFG.horizPaddingAlienShip),
						  this.CFG.heightAlienRow*rownum
					 );
				return x;
		  },

		  callstepmethod: function(theobj, theobjuuid)
		  {
				theobj.step();
		  },

		  stepfast: function()
		  {
				_.each(this.activeFriendlyBullets,
						 this.callstepmethod,
						 this);
				this.timerFast = 
					 setTimeout('GAME.stepfast()', this.CFG.millisecPerFastStep);
		  },

		  stepalienshift: function()
		  {
				if (this.nextAlienShiftShouldDescend) {
					 this.directionAlienShift *= -1;
					 this.thisAlienShiftShouldDescend = true;
					 this.nextAlienShiftShouldDescend = false;
				}
				for (var i=1; i<=this.CFG.numAlienRows; i++) 
				{
					 _.each(this.alienRows[i],
							  this.callstepmethod,
							  this);
				}
				this.thisAlienShiftShouldDescend = false;
				this.timerAlienShift = 
					 setTimeout('GAME.stepalienshift()', this.CFG.millisecPerAlienShift);
		  },

		  adjustToWidth: function() 
		  {
				// The width of the entire "client area" of the browser
				this.WIDTHwindow = this.jqcanv.get(0).width = window.innerWidth;
				var width = this.WIDTHwindow;
		  },


		  gleanCanvasDimensions: function()
		  {
				this.canvasWidth = this.jqcanv.get(0).width;
				this.canvasHeight = this.jqcanv.get(0).height;
		  },



		  handleEvent_KEYDOWN: function(evt)
		  {
				switch (evt.keyCode) {
				case 38:  /* Up arrow was pressed */
					 break;
				case 40:  /* Down arrow was pressed */
					 break;
				case 37:  /* Left arrow was pressed */
					 this.gameobjShooter.x -= 2;
					 this.stage.update();
					 break;
				case 39:  /* Right arrow was pressed */
					 this.gameobjShooter.x += 2;
					 this.stage.update();
					 break;
				case 32: /* spacebar */
					 this.activeFriendlyBullets.add
					 (
						  new CLASSfaceinvFriendlyBullet(this.gameobjShooter.x)
					 );
					 break;
				default:
					 //					 alert(evt.keyCode);
				}
		  },






		  fin: "fin"
	 }
);


