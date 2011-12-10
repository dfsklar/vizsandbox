var CLASSfaceinvaders = Class.extend(
	 {

		  CFG: 
		  {
				"marginBottom": 5
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
					 .lineTo(-x,x*1.2)
					 .lineTo(x,x*1.2)
					 .lineTo(0,0)
					 .endFill();
				GOBJ.x = (this.canvasWidth/2);
				GOBJ.y = (this.canvasHeight - this.CFG.marginBottom);
				this.stage.addChild(GOBJ);
				this.stage.update();
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
		  }

		  


		  
	 }
);


