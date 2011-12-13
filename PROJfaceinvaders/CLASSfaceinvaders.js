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
					 .beginStroke("#00FF00")
					 .setStrokeStyle(1.5/*thickness*/, "round")
					 .moveTo(0,0)
					 .lineTo(0,5);
				this.shape.x = this.x;
				this.shape.y = this.y;
				this.game.stage.addChild(this.shape);
				this.game.stage.update();

				SoundJS.play("shootfriendlybullet", 1, 1, false);
		  },


		  // This is called once per "game fast-increment cycle"
		  step: function()
		  {
				this.shape.y -= this.CFG.friendlyBulletUnitsPerFastStep;
				if (this.shape.y < -14) {
					 // This bullet is now well offscreen (flew off the top) so delete it.
					 this.game.activeFriendlyBullets.remove(this);
				}
				this.game.stage.update();
				this.checkForAlienHit();
		  },

		  // This determines if this bullet has entered the
		  // body of an alien.
		  // If it has murdered an alien, not only is the alien destroyed
		  // but this bullet also must be destroyed.
		  // TODO: We will optimize this function, but its first incarnation is brute-force!
		  checkForAlienHit: function()
		  {
				for (var i=0; i<=(this.CFG.numAlienRows+2); i++) 
				{
					 _.each(this.game.alienRows[i],
							  this.callhitdetectmethod,
							  this);
				}
		  },
		  callhitdetectmethod: function(theobj)
		  {
				if (theobj.hitdetected(this.shape.x, this.shape.y)) {
					 this.registerAlienMurder(theobj);
				}
		  },
		  
		  registerAlienMurder: function(thealien)
		  {
				thealien.destructor();
				this.destructor();
		  },

		  destructor: function()
		  {
				this.game.activeFriendlyBullets.remove(this);
				this.game.stage.removeChild(this.shape);
		  },

		  fin: "fin"
	 }
);







// ALIEN MONSTER (regular kind, not zuckership)
// The zuckership will be subclassed from this
var CLASSfaceinvAlien = Class.extend(
	 {
		  shape: null,
		  width: null,
		  game: null,
		  CFG: null,

		  isAlive: true,

		  destructor: function()
		  {
				this.isAlive = false;
				this.game.stage.removeChild(this.shape);
				SoundJS.play("killalien", 1, 1, false);
		  },

		  hitdetected: function(x,y)
		  {
				if (!this.isAlive)
					 return false;

				if ( (x > this.shape.x) && (x < this.shape.x+this.CFG.widthAlienShip) )
					 if ( (y > this.shape.y) && (y < this.shape.y+this.CFG.heightAlienShip) )
						  {
								return true;
						  }

				return false;
		  },


		  initialize: function(leftx,topy, options)
		  {
				this.game = GAME;
				this.CFG = this.game.CFG;
				this.x = leftx;
				this.y = topy;

				this.constructModel(options);

				this.shape.x = leftx;
				this.shape.y = topy;

				this.game.stage.addChild(this.shape);
				this.game.stage.update();
		  },

		  constructModel: function(options)
		  {
				this.slingimage = new Image();
				this.slingimage.src = options.bitmap;
				this.shape = new Bitmap(this.slingimage);
				this.shape.compositeOperation = "lighter";
				this.width = this.CFG.widthAlienShip;

				// Let's scale this down
				this.shape.scaleX = 0.5;
				this.shape.scaleY = 0.5;
		  },

		  constructModel_RECT: function()
		  {
				this.shape = new Shape();
				this.shape.graphics
					 .beginFill("white")
					 .drawRect(0,0,
								  this.CFG.widthAlienShip, this.CFG.heightAlienShip)
					 .endFill();
				this.width = this.CFG.widthAlienShip;
		  },


		  // This is called once per "alien shift cycle"
		  step: function()
		  {
				if (!this.isAlive)
					 return;

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



var CLASSfaceinvZuckership = Class.extend(
	 CLASSfaceinvAlien,
	 {
		  
		  direction: 1,  // set to negative to have it go in left dir

		  constructModel: function(options)
		  {
				this.slingimage = new Image();
				this.slingimage.src = "zuckship.png";
				this.shape = new Bitmap(this.slingimage);
				this.width = 76;

				// Let's scale this down
				this.shape.scaleX = 0.5;
				this.shape.scaleY = 0.5;
				SoundJS.play("zucker", 1, 1, true);
		  },

		  destructor: function()
		  {
				this.isAlive = false;
				this.game.stage.removeChild(this.shape);
				
				SoundJS.stop("zucker");

				GAME.alienRows[0].length = 0;  // recommended way to empty an array!

				// Let's set up the next zuckership in a few seconds' time
				// TODO: randomize this!
				setTimeout('GAME.launchZucker()', 10000);
		  },

		  
		  step: function() {

				if (!this.isAlive) return;

				this.shape.x += 3.2 * this.direction;
				this.game.stage.update();
				
				if (this.shape.x > this.game.canvasWidth) {
					 this.destructor();
					 return;
				}
				if (this.shape.x < ( 0 - this.width) ) {
					 this.destructor();
					 return;
				}

				this.timer = 
					 setTimeout('GAME.alienRows[0][0].step()', this.CFG.millisecPerFastStep);
		  },

		  "FIN": "FIN"
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
				"heightAlienRow": 28,
 				"heightAlienShip": 18,
				"widthAlienShip": 30,
				"horizPaddingAlienShip": 3,  /* num of units between two aliens on same row */
				"numAliensPerRow": 11,
				"numAlienRows": 5,    /* does not count the reserved two rows at very top */

				"friendlyBulletUnitsPerFastStep": 7,
				"alienShiftHorizUnitsPerStep": 7,
				"alienShiftVertUnitsPerDescent": 9,

				"millisecPerFastStep": 70,
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
				GOBJ.graphics
					 .beginFill("#00FF00")
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




				// CONSTRUCT THE REGULAR ALIENS (rows 2 through (2+numAlienRows-1))
				this.alienRows = new Array();
				// index 0 is reserved for the superalien, when present
				// index 1 is reserved to be left blank (a "margin" row, per orig game)
				this.alienRows.push(new Array());  // for the superalien
				this.alienRows.push(new Array());  // to be left blank
				// index 2 is therefore the topmost row of regular aliens
				// each member of the array is itself an array
				for (var currownum=2; currownum < (this.CFG.numAlienRows+2); currownum++) {
					 this.constructAlienRow(currownum);
				}

				this.activeFriendlyBullets = new $SET();
				this.activeEnemyBullets = new $SET();

				this.stage.update();

				this.stepfast();
				this.stepalienshift();
				
				// For testing, immediately construct and launch a zuckership
				setTimeout('GAME.launchZucker()', 1000);
		  },


		  launchZucker: function() 
		  {
				// Hardwired currently to start from left side, for testing
				var zucker = new CLASSfaceinvZuckership(0, 10);
				this.alienRows[0].push(zucker);
				zucker.step();
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
						  (this.CFG.heightAlienRow*rownum)
						  ,  
						  {
								bitmap: 
								(rownum > 3) ? "row1and2.png" : "row4and3.png"
						  }
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
				for (var i=2; i<=(2+this.CFG.numAlienRows); i++) 
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


