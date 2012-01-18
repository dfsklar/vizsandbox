/*
 * 
 * The data bank must be an array:
 * 
 * [
 *    { num: "53", caption: "number of pies" }, ...
 * ]
 *      
 */


window.metrotile.CLASSmetrobignum = window.metrotile.CLASSmetrotilebase.extend(
	 {

		  init: function()  /*Caller must mixin these: IDdomdiv, script, configmap*/
		  {
				// Call the base class initializer
				this._super();
		  },

		  placeactors: function() {

				this.JQNODEbignumtext = this.JQNODEdomdiv.children(".metrobignum_bignum");
				this.JQNODElabeltext = this.JQNODEdomdiv.children(".metrobignum_labeltext");

				// Setup the banner and label appropriately
				this.JQNODEbignumtext.css(
					 {
						  opacity: "0.0"
					 }
				);
				this.JQNODElabeltext.css(
					 {
						  opacity: "0.0"
					 }
				);

		  },






		  startframe: function() {
				var THIS = this;
				var framedata = this.script[this.frameindex];

				this.JQNODEbignumtext.html(framedata.num);
				this.JQNODElabeltext.html(framedata.caption);
				var DOMbignumtext = this.JQNODEbignumtext.get(0);
				var DOMlabeltext = this.JQNODElabeltext.get(0);

				// DOJO bug: the "require" callback function can't obtain
				// the value of "this" so I must use the THIS hack.
				require ( ["dojo/_base/fx", "dojo/fx", "dojo/dom", "dojo/_base/connect" ] ,
							 function(fx,coreFx,dom,connect) 
							 {
								  var ARRanims = [];
								  ARRanims.push( fx.fadeIn
								  (
										{
											 node: DOMbignumtext,
											 duration: 1000*THIS.$$["duration-fadein-text"]
										}
								  ));
								  ARRanims.push( fx.fadeIn
								  (
										{
											 node: DOMlabeltext,
											 duration: 1000*THIS.$$["duration-fadein-text"]
										}
								  ));
								  var fullanim = coreFx.combine(ARRanims);
								  connect.connect(fullanim,
														"onEnd",
														THIS,
														THIS.proceednextframe);
								  fullanim.play();
							 }
						  );
		  },




		  endframe: function(nextstep) {
				var THIS = this;
				var framedata = this.script[this.frameindex];

				var DOMbignumtext = this.JQNODEbignumtext.get(0);
				var DOMlabeltext = this.JQNODElabeltext.get(0);

				require ( ["dojo/_base/fx", "dojo/dom" ] ,
							 function(fx,dom) 
							 {
								  fx.fadeOut
								  (
										{
											 node: DOMbignumtext,
											 delay: 1000*THIS.$$["duration-hold-on"],
											 duration: 1000*THIS.$$["duration-fadein-text"],
											 onEnd: function(){
												  THIS.sleepandthen(THIS.$$["duration-hold-off"], nextstep);
											 }
										}
								  ).play();
								  fx.fadeOut
								  (
										{
											 node: DOMlabeltext,
											 delay: 1000*THIS.$$["duration-hold-on"],
											 duration: 1000*THIS.$$["duration-fadein-text"]
										}
								  ).play();
							 }
						  );
		  },



		  readyforframe: function(framenum) {
				return true;
		  }
	 }
);



