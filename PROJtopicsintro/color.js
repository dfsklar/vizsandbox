'use strict';

(function() {

  // HSL -> RGB conversion
  var hslToRgb = function(color) {
    var h = color.h;
    var s = color.s / 100;
    var l = color.l / 100;

    var c = (1 - Math.abs(2 * l - 1)) * s;
    var hh = (h / 60) % 6;
    var x = c * (1 - Math.abs(hh % 2 - 1));

    var r = 0,
        g = 0,
        b = 0;

    if (hh >= 5) {
      r = c;
      g = 0;
      b = x;
    } else if (hh >= 4) {
      r = x;
      g = 0;
      b = c;
    } else if (hh >= 3) {
      r = 0;
      g = x;
      b = c;
    } else if (hh >= 2) {
      r = 0;
      g = c;
      b = x;
    } else if (hh >= 1) {
      r = x;
      g = c;
      b = 0;
    } else if (hh >= 0) {
      r = c;
      g = x;
      b = 0;
    }

    var m = l - c/2;
    r += m;
    g += m;
    b += m;

    return {
      r: r,
      g: g,
      b: b
    };
  };

  // HSV <-> RGB conversion
  var rgbToHsb = function(color) {

    var r = color.r,
        g = color.g,
        b = color.b;

    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var d = max - min;
    var result = {h: 0, s: 0, b: 0};

    if (max == min)
      result.h = 0;
    else if (max == r && g >= b)
      result.h = 60 * (g - b) / d;
    else if (max == r && g < b)
      result.h = 60 * (g - b) / d + 360;
    else if (max == g)
      result.h = 60 * (b - r) / d + 120;
    else if (max == b)
      result.h = 60 * (r - g) / d + 240;

    result.s = (max == 0) ? 0 : (1 - min/max);
    result.b = max;

    if (color.a !== undefined)
      result.a = color.a;

    return result;
  };
  var hsbToRgb = function(color) {

    var h = color.h,
        s = color.s,
        b = color.b;

    if (s == 0)
      return {r: b, g: b, b: b};

    var result = {r: 0, g: 0, b: 0};

    // Find what sector of the color wheel we're in
    var sectorPos = h / 60;
    var sectorNum = parseInt(sectorPos);
    var sectorFrac = sectorPos - sectorNum;

    var p = b * (1 - s);
    var q = b * (1 - s * sectorFrac);
    var t = b * (1 - s * (1 - sectorFrac));

    switch (sectorNum) {
      case 0:
        result.r = b;
        result.g = t;
        result.b = p;
        break;
      case 1:
        result.r = q;
        result.g = b;
        result.b = p;
        break;
      case 2:
        result.r = p;
        result.g = b;
        result.b = t;
        break;
      case 3:
        result.r = p;
        result.g = q;
        result.b = b;
        break;
      case 4:
        result.r = t;
        result.g = p;
        result.b = b;
        break;
      case 5:
        result.r = b;
        result.g = p;
        result.b = q;
        break;
    }

    if (color.a !== undefined)
      result.a = color.a;

    return result;
  };
  var hsbArrayToColorArray = function(arr) {
    var r = [];
    for (var i=0; i<arr.length; i++)
      r.push(new vz.Color(hsbToRgb(arr[i])));
    return r;
  };

  // HSB Operations
  var lighten = function(color, percent) {
    return {
      h: color.h,
      s: color.s,
      b: Math.max(0, Math.min(color.b + percent / 100, 1))
    };
  };
  var saturate = function(color, percent) {
    return {
      h: color.h,
      s: Math.max(0, Math.min(color.s + percent / 100, 1)),
      b: color.b
    };
  };
  var colorSteps = function(color1, color2, steps) {
    if (steps < 2)
      return [color1];

    var diffLinear = function(start, end) {
      var diff = end - start;
      return diff;
    };
    var diffRadial = function(start, end) {
      var diff = end - start;
      if (Math.abs(diff) > 180) diff = (360 - Math.abs(diff)) * (start > end ? 1 : -1);
      return diff;
    };

    var stepSize = {};
    stepSize.h = diffRadial(color1.h, color2.h) / (steps - 1);
    stepSize.s = diffLinear(color1.s, color2.s) / (steps - 1);
    stepSize.b = diffLinear(color1.b, color2.b) / (steps - 1);

    var results = [];
    for (var i=0; i<steps; i++) {
      var c = {};
      for (var p in color1) if (color1.hasOwnProperty(p))
        c[p] = (color1[p] + i * stepSize[p]) % 360;
      results.push(c);
    };

    return results;
  };
  var saturationSteps = function(color, saturation, steps) {
    var stepSize = (saturation / 100 - color.s) / (steps - 1)
    var results = []
    for (var i=0; i<steps; i++)
      results.push({
        h: color.h,
        s: color.s + stepSize * i,
        b: color.b
      });

    return results;
  };
  var saturateDynamicRangeSteps = function(color, range, steps) {
    var ideal = (range / 100) / 2;
    var max = Math.min(1 - color.s, color.s);
    var start = 0;

    if (ideal < max) {
      start = color.s - ideal;
    } else {
      start = (color.s < 50 ? 0 : 100 - range) / 100;
    }

    var stepSize = (range / 100) / steps;
    var results = [];
    for (var i=0; i<steps; i++)
      results.push({
        h: color.h,
        s: start + stepSize * i,
        b: color.b
      });
    return results;
  };

  // The vz Color class

  vz.Color = vz.createClass();
  var proto = vz.Color.prototype;
  proto.init = function() {
    if (!arguments.length) {
      this.r = 0;
      this.g = 0;
      this.b = 0;
      this.a = 0;
      return;
    }

    // Magic args
    if (arguments.length == 1 && typeof arguments[0] == 'string') {
      // Parse the string, which can be either a hex value or an
      // rgb(a) value.
      var s = arguments[0];

      // Handle hex
      if (s.charAt(0) == '#') {
        // Convert the shorthand syntax to longhand, if needed
        if (s.length == 4) {
          s = '#' + s.charAt(1) + s.charAt(1)
                  + s.charAt(2) + s.charAt(2)
                  + s.charAt(3) + s.charAt(3);
        }

        // Parse it up
        this.r = parseInt(s.substr(1, 2), 16) / 255;
        this.g = parseInt(s.substr(3, 2), 16) / 255;
        this.b = parseInt(s.substr(5, 2), 16) / 255;
        this.a = 1.0;

      // Handle RGBA
      } else if (s.substr(0, 3) == 'rgb') {

        // Grab our color components
        var parts = s.match(/[\d\.\%]+/g);

        // Handle alpha
        if (parts.length > 3)
          this.a = parseFloat(parts[3]) / (100 * !!parts[3].match(/\%/) || 1);
        else
          this.a = 1.0;

        // Handle the rest
        var names = ['r', 'g', 'b'];
        for (var i=0; i<3; i++)
          this[names[i]] = parseFloat(parts[i]) * ((2.55 * !!parts[i].match(/\%/)) || 1) / 255;

      // Otherwise bomb out
      } else {
        throw new Error('Can\'t parse color "' + s + '"');
      }
    } else if (arguments.length == 1 && typeof arguments[0] == 'object') {
      var a = arguments[0];
      if (typeof a.r != 'undefined' && typeof a.g != 'undefined' && typeof a.b != 'undefined') {
        this.r = parseFloat(a.r || 0);
        this.g = parseFloat(a.g || 0);
        this.b = parseFloat(a.b || 0);
      } else if (typeof a.h != 'undefined' && typeof a.s != 'undefined' && typeof a.l != 'undefined') {
        var c = hslToRgb(a);
        this.r = c.r;
        this.g = c.g;
        this.b = c.b;
      } else if (typeof a.h != 'undefined' && typeof a.s != 'undefined' && typeof a.b != 'undefined') {
        var c = hsbToRgb(a);
        this.r = c.r;
        this.g = c.g;
        this.b = c.b;
      } else {
        throw new Error('Invalid argument format');
      }
      this.a = parseFloat(arguments[0].a || 0);
    } else if (arguments.length == 3 || arguments.length == 4) {
      // Straight up rgb values. These must all be 0.0 - 1.0!  If we
      // see any that are over 1, we'll treat them as erroneous 255-based
      // numbers and clip them.
      this.r = parseFloat(arguments[0]);
      this.g = parseFloat(arguments[1]);
      this.b = parseFloat(arguments[2]);
      this.a = parseFloat(arguments.length > 3 ? arguments[3] : 1.0);

      if (this.r > 1) this.r = this.r / 255;
      if (this.g > 1) this.g = this.g / 255;
      if (this.b > 1) this.b = this.b / 255;
    } else {
      throw new Error('Incorrect arguments passed to init');
    }
  };

  proto.rgb = function() {
    return 'rgb(' + parseInt(this.r * 255)
         + ', ' + parseInt(this.g * 255)
         + ', ' + parseInt(this.b * 255)
         + ')';
  };
  proto.rgba = function() {
    return 'rgba(' + parseInt(this.r * 255)
            + ', ' + parseInt(this.g * 255)
            + ', ' + parseInt(this.b * 255)
            + ', ' + this.a
            + ')';
  };
  proto.hex = function() {
    return ('#' + parseInt(this.r * 255).pad(2, 0, 16)
                + parseInt(this.g * 255).pad(2, 0, 16)
                + parseInt(this.b * 255).pad(2, 0, 16)).toUpperCase();
  };

  // Returns a new color by converting to HSB, calling the function with
  // that HSB, and transforming the result to RGB.
  //
  // The first argument should be the function to call, and additional
  // arguments will be passed through to it.
  proto._modify = function() {
    var args = Array.prototype.slice.call(arguments);
    var f = args.shift();
    args.unshift(rgbToHsb(this));
    return new vz.Color(hsbToRgb(f.apply(window, args)));
  };

  proto.lighten = function(amount) {
    // Require number amounts
    if (typeof amount != 'number') throw new Error('Amount must be a integer');
    if (amount < 0 > 100) throw new Error('Amount must be between 0 and 100, inclusive');

    return this._modify(lighten, amount);
  };
  proto.darken = function(amount) {
    // Require number amounts
    if (typeof amount != 'number' || amount < 0 || amount > 100)
      throw new Error('Amount must be an integer between 0 and 100 inclusive');

    return this._modify(lighten, -amount);
  };
  proto.saturate = function(amount) {
    // Require number amounts
    if (typeof amount != 'number') throw new Error('Amount must be a integer');
    if (amount < 0 > 100) throw new Error('Amount must be between 0 and 100, inclusive');

    return this._modify(saturate, amount);
  };
  proto.desaturate = function(amount) {
    // Require number amounts
    if (typeof amount != 'number') throw new Error('Amount must be a integer');
    if (amount < 0 > 100) throw new Error('Amount must be between 0 and 100, inclusive');

    return this._modify(saturate, -amount);
  };
  proto.stepColorTo = function(color, steps) {
    return hsbArrayToColorArray(colorSteps(rgbToHsb(this), rgbToHsb(color), steps));
  };
  proto.stepSaturationTo = function(amount, steps) {
    // Require number amounts
    if (typeof amount != 'number' || amount < 0 || amount > 100)
      throw new Error('Amount must be an integer between 0 and 100 inclusive');
    return hsbArrayToColorArray(saturationSteps(rgbToHsb(this), amount, steps));
  };
  proto.stepSaturationInDynamicRange = function(range, steps) {
    // Require number amounts
    if (typeof range != 'number' || range < 0 || range > 100)
      throw new Error('Amount must be an integer between 0 and 100 inclusive');
    return hsbArrayToColorArray(saturateDynamicRangeSteps(rgbToHsb(this), range, steps));
  };

  // Load up the colors
  vz.colors = {};
  vz.colors.load = function() {
    var names = ['bg', 'fg', 'a1', 'a2', 'a3'];
    for (var i=0; i<names.length; i++) {
      var name = names[i];
      var d = $('<div class="color-' + name + '" style="display: none !important;"></div>');
      $('body').append(d);
      vz.colors[name] = new vz.Color(); //SKLAR: d.css('color'));
      d.remove();
    };

    for (var i=0; i<changeWaiters.length; i++)
      changeWaiters[i]();
  };
  var changeWaiters = [];
  vz.colors.onChange = function(c) {
    changeWaiters.push(c);
  };

  // Bootstrap ourselves
  vz.colors.load();
})();
