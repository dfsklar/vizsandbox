var CLASSfaceinvFriendlyBullet = Class.extend(
	 {
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
				this.shape.y -= 3;
				if (this.shape.y < -10) {
					 // This bullet is now well offscreen (flew off the top) so delete it.
					 this.game.activeFriendlyBullets.remove(this);
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
				"widthShooter": 6,
				"heightShooter": 7,
				"YtopOfShooter": null,
				"millisecPerFastStep": 100,

				"FIN":"FIN"
		  },
		  
		  initialize: function(IDofCanvasDomnode)
		  {
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
				GOBJ.x = (this.canvasWidth/2);
				GOBJ.y = (this.canvasHeight - this.CFG.marginBottom - this.CFG.heightShooter);
				this.CFG.YtopOfShooter = GOBJ.y;
				this.stage.addChild(GOBJ);
				this.stage.update();

				this.activeFriendlyBullets = new $SET();
				this.activeEnemyBullets = new $SET();

				this.stepfast();
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


