var $SETuuid = 0;
var $SET = function() {};
$SET.prototype.add =
	 function(obj) {
		  $SETuuid++;
		  obj.$SETuuid = $SETuuid;
		  this[$SETuuid] = obj;
	 };

$SET.prototype.remove = 
	 function(obj) {
		  delete this[obj.$SETuuid];
	 };

/*
 * EXAMPLE USAGE:

var s = new Set();
 
s.add("foo");
s.add(10);
 
( "foo" in s ); // true
( 10 in s ); // true
 
s.remove("a");
 
( "foo" in s ); // false

*/
