// This is Sklar's extraction of just the String extensions
// of prototype v 1.6.0.2


function ObjectisUndefined(object) {
    return typeof object == "undefined";
}




String.prototype.gsub = function(pattern, replacement) {
    var result = '', source = this, match;
    replacement = arguments.callee.prepareReplacement(replacement);

    while (source.length > 0) {
      if (match = source.match(pattern)) {
        result += source.slice(0, match.index);
        result += String.interpret(replacement(match));
        source  = source.slice(match.index + match[0].length);
      } else {
        result += source, source = '';
      }
    }
    return result;
};

String.prototype.sub = function(pattern, replacement, count) {
    replacement = this.gsub.prepareReplacement(replacement);
    count = ObjectisUndefined(count) ? 1 : count;

    return this.gsub(pattern, function(match) {
      if (--count < 0) return match[0];
      return replacement(match);
    });
};

String.prototype.scan = function(pattern, iterator) {
    this.gsub(pattern, iterator);
    return String(this);
};

String.prototype.truncate = function(length, truncation) {
    length = length || 30;
    truncation = ObjectisUndefined(truncation) ? '...' : truncation;
    return (this.length > length) ?
        this.slice(0, length - truncation.length) + truncation 
		  : 
		  String(this);
};

String.prototype.strip = function() {
    return this.replace(/^\s+/, '').replace(/\s+$/, '');
};

String.prototype.stripTags = function() {
    return this.replace(/<\/?[^>]+>/gi, '');
};

String.prototype.stripScripts = function() {
    return this.replace(new RegExp(Prototype.ScriptFragment, 'img'), '');
};

String.prototype.extractScripts = function() {
    var matchAll = new RegExp(Prototype.ScriptFragment, 'img');
    var matchOne = new RegExp(Prototype.ScriptFragment, 'im');
    return (this.match(matchAll) || []).map(function(scriptTag) {
      return (scriptTag.match(matchOne) || ['', ''])[1];
    });
};

String.prototype.evalScripts = function() {
    return this.extractScripts().map(function(script) { return eval(script) });
};

String.prototype.escapeHTML = function() {
    var self = arguments.callee;
    self.text.data = this;
    return self.div.innerHTML;
};

String.prototype.unescapeHTML = function() {
    var div = new Element('div');
    div.innerHTML = this.stripTags();
    return div.childNodes[0] ? (div.childNodes.length > 1 ?
      $A(div.childNodes).inject('', function(memo, node) { return memo+node.nodeValue }) :
      div.childNodes[0].nodeValue) : '';
};

String.prototype.toQueryParams = function(separator) {
    var match = this.strip().match(/([^?#]*)(#.*)?$/);
    if (!match) return { };

    return match[1].split(separator || '&').inject({ }, function(hash, pair) {
      if ((pair = pair.split('='))[0]) {
        var key = decodeURIComponent(pair.shift());
        var value = pair.length > 1 ? pair.join('=') : pair[0];
        if (value != undefined) value = decodeURIComponent(value);

        if (key in hash) {
          if (!Object.isArray(hash[key])) hash[key] = [hash[key]];
          hash[key].push(value);
        }
        else hash[key] = value;
      }
      return hash;
    });
};

String.prototype.toArray = function() {
    return this.split('');
};

String.prototype.succ = function() {
    return this.slice(0, this.length - 1) +
      String.fromCharCode(this.charCodeAt(this.length - 1) + 1);
};

String.prototype.times = function(count) {
    return count < 1 ? '' : new Array(count + 1).join(this);
};

String.prototype.camelize = function() {
    var parts = this.split('-'), len = parts.length;
    if (len == 1) return parts[0];

    var camelized = this.charAt(0) == '-'
      ? parts[0].charAt(0).toUpperCase() + parts[0].substring(1)
      : parts[0];

    for (var i = 1; i < len; i++)
      camelized += parts[i].charAt(0).toUpperCase() + parts[i].substring(1);

    return camelized;
};

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
};

String.prototype.underscore = function() {
    return this.gsub(/::/, '/').gsub(/([A-Z]+)([A-Z][a-z])/,'#{1}_#{2}').gsub(/([a-z\d])([A-Z])/,'#{1}_#{2}').gsub(/-/,'_').toLowerCase();
};

String.prototype.dasherize = function() {
    return this.gsub(/_/,'-');
};

String.prototype.inspect = function(useDoubleQuotes) {
    var escapedString = this.gsub(/[\x00-\x1f\\]/, function(match) {
      var character = String.specialChar[match[0]];
      return character ? character : '\\u00' + match[0].charCodeAt().toPaddedString(2, 16);
    });
    if (useDoubleQuotes) return '"' + escapedString.replace(/"/g, '\\"') + '"';
    return "'" + escapedString.replace(/'/g, '\\\'') + "'";
};

String.prototype.toJSON = function() {
    return this.inspect(true);
};

String.prototype.unfilterJSON = function(filter) {
    return this.sub(filter || Prototype.JSONFilter, '#{1}');
};

String.prototype.isJSON = function() {
    var str = this;
    if (str.blank()) return false;
    str = this.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, '');
    return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str);
};

String.prototype.evalJSON = function(sanitize) {
    var json = this.unfilterJSON();
    try {
      if (!sanitize || json.isJSON()) return eval('(' + json + ')');
    } catch (e) { }
    throw new SyntaxError('Badly formed JSON string: ' + this.inspect());
};

String.prototype.include = function(pattern) {
    return this.indexOf(pattern) > -1;
};

String.prototype.startsWith = function(pattern) {
    return this.indexOf(pattern) === 0;
};

String.prototype.endsWith = function(pattern) {
    var d = this.length - pattern.length;
    return d >= 0 && this.lastIndexOf(pattern) === d;
};

String.prototype.empty = function() {
    return this == '';
};

String.prototype.blank = function() {
    return /^\s*$/.test(this);
};

String.prototype.interpolate = function(object, pattern) {
    return new Template(this, pattern).evaluate(object);
};
