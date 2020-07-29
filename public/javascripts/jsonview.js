/*global COOKIE: true, HTML: true, PRETTY: true, STRUCTURE: true, VIS: true,
         $, Event, Dom, Lang, window, document, YAHOO, QUERYSTRING: true
*/

/*! Non-minified version: default.js
 *
 * Copyright (c) 2011, Chris Nielsen
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *    * Redistributions of source code must retain the above copyright
 *      notice, this list of conditions and the following disclaimer.
 *
 *    * Redistributions in binary form must reproduce the above copyright
 *      notice, this list of conditions and the following disclaimer in the
 *      documentation and/or other materials provided with the distribution.
 *
 *    * Neither the name of the Chris Nielsen nor the names of contributors
 *      may be used to endorse or promote products derived from this software
 *      without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL Chris Nielsen BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

// HTML5 elements act "funny" in IE unless you create a few beforehand.
/*@cc_on
document.createElement("output");
document.createElement("footer");
document.createElement("time");
@*/

if (!Array.prototype.indexOf) {
	/** Returns the first index at which a given element can be found in the
	  * array, or -1 if it is not present. This algorithm is exactly the one
	  * used in Firefox and SpiderMonkey.
	  *
	  * @param  {Object}    elt    Element to locate in the array.
	  * @param  {Integer}  [from]  The index at which to begin the search.
	  *
	  *                            Defaults to 0, i.e. the whole array will be
	  *                            searched.
	  *
	  *                            If the index is greater than or equal to
	  *                            the length of the array, -1 is returned,
	  *                            i.e. the array will not be searched.
	  *
	  *                            If negative, it is taken as the offset
	  *                            from the end of the array.
	  *
	  *                            Note that even when the index is negative,
	  *                            the array is still searched from front to
	  *                            back. If the calculated index is less than
	  *                            0, the whole array will be searched.
	  * @return {Number} */
	Array.prototype.indexOf = function (elt, from) {

		from = Number(from) || 0;

		var len  = this.length;

		from = (from < 0) ? Math.ceil(from) : Math.floor(from);

		if (from < 0) {
			from += len;
		}

		for (; from < len; from++) {
			if (this.hasOwnProperty(from) && this[from] === elt) {
				return from;
			}
		}
		return -1;
	};
}


if (!Array.prototype.lastIndexOf) {
	/** Returns the last index at which a given element can be found in the
	  * array, or -1 if it is not present. The array is searched backwards,
	  * starting at fromIndex. This algorithm is exactly the one used in
	  * Firefox and SpiderMonkey.
	  *
	  * @param  {Object}    elt    Element to locate in the array.
	  * @param  {Integer}  [from]  The index at which to start searching
	  *                            backwards.
	  *
	  *                            Defaults to the array's length, i.e. the
	  *                            whole array will be searched.
	  *
	  *                            If the index is greater than or equal to
	  *                            the length of the array, the whole array
	  *                            will be searched. If negative, it is taken
	  *                            as the offset from the end of the array.
	  *                            Note that even when the index is negative,
	  *                            the array is still searched from back to
	  *                            front. If the calculated index is less than
	  *                            0, -1 is returned, i.e. the array will not
	  *                            be searched.
	  * @return {Number} */
	Array.prototype.lastIndexOf = function (elt, from) {

		from = Number(from);

		var len  = this.length;

		if (isNaN(from)) {
			from = len - 1;
		} else {
			from = (from < 0) ? Math.ceil(from) : Math.floor(from);
			if (from < 0) {
				from += len;
			} else if (from >= len) {
				from = len - 1;
			}
		}

		for (; from > -1; from--) {
			if (this.hasOwnProperty(from) && this[from] === elt) {
				return from;
			}
		}
		return -1;
	};
}


if (!Array.prototype.some) {
	/** Tests whether some element in the array passes the test implemented
	  * by the provided function. This algorithm is exactly the one used in
	  * Firefox and SpiderMonkey.
	  *
	  * @param  {Function}  fun     Function to test for each element.
	  * @param  {Object}   [thisp]  Object to use as this when executing fun.
	  * @return {Boolean} */
	Array.prototype.some = function (fun, thisp) {
		var i, len = this.length;
		if (typeof fun !== "function") {
			throw new TypeError();
		}

		for (i = 0; i < len; i++) {
			if (this.hasOwnProperty(i) && fun.call(thisp, this[i], i, this)) {
				return true;
			}
		}

		return false;
	};
}



if (!Array.prototype.every) {
	/** Tests whether all elements in the array pass the test implemented by
	  * the provided function. This algorithm is exactly the one used in
	  * Firefox and SpiderMonkey.
	  *
	  * @param  {Function}  fun     Function to test for each element.
	  * @param  {Object}   [thisp]  Object to use as this when executing fun.
	  * @return {Boolean} */
	Array.prototype.every = function (fun, thisp) {
		var i, len = this.length;
		if (typeof fun !== "function") {
			throw new TypeError();
		}

		for (i = 0; i < len; i++) {
			if (this.hasOwnProperty(i) && !fun.call(thisp, this[i], i, this)) {
				return false;
			}
		}

		return true;
	};
}



if (!Array.prototype.forEach) {
	/** Executes a provided function once per array element.
	  * This algorithm is exactly the one used in Firefox and SpiderMonkey.
	  * @param  {Function}  fun     Function to test for each element.
	  * @param  {Object}   [thisp]  Object to use as this when executing fun.
	  */
	Array.prototype.forEach = function (fun, thisp) {
		var i, len = this.length;
		if (typeof fun !== "function") {
			throw new TypeError();
		}

		for (i = 0; i < len; i++) {
			if (this.hasOwnProperty(i)) {
				fun.call(thisp, this[i], i, this);
			}
		}
	};
}



if (!Array.prototype.filter) {
	/** Creates a new array with all elements that pass the test implemented
	  * by the provided function. This algorithm is exactly the one used in
	  * Firefox and SpiderMonkey.
	  *
	  * @param  {Function}  fun     Function to test for each element.
	  * @param  {Object}   [thisp]  Object to use as this when executing fun.
	  * @return {Array} */
	Array.prototype.filter = function (fun, thisp) {
		var res, i, val, len = this.length;
		if (typeof fun !== "function") {
			throw new TypeError();
		}

		res = [];
		for (i = 0; i < len; i++) {
			if (this.hasOwnProperty(i)) {
				val = this[i]; // in case fun mutates this
				if (fun.call(thisp, val, i, this)) {
					res.push(val);
				}
			}
		}

		return res;
	};
}



if (!Array.prototype.map) {
	/** Creates a new array with the results of calling a provided function on
	  * every element in this array. This algorithm is exactly the one used in
	  * Firefox and SpiderMonkey.
	  *
	  * @param  {Function} fun
	  * @param  {Object}   [thisp]
	  * @return {Array} */
	Array.prototype.map = function (fun, thisp) {
		var res, i, len = this.length;
		if (typeof fun !== "function") {
			throw new TypeError();
		}

		res = [];
		res.length = len;
		for (i = 0; i < len; i++) {
			if (this.hasOwnProperty(i)) {
				res[i] = fun.call(thisp, this[i], i, this);
			}
		}

		return res;
	};
}








/** @namespace */

VIS = {

	/** Dom id values that we find interesting
	  * @property
	  * @type {object}
	  */
	data: {
		input:       'jsonInput',
		output:      'jsonOutput',
		validateOut: 'jsonValidateOutput',
		size:        'jsonSize',
		inStrict:    'jsonStrict',
		inEval:      'jsonEval',
		outHTML:     'json2HTML',
		outJSON:     'json2JSON',
		preserve:    'jsonSpace',
		dates:       'jsonDate',
		dataTables:  'jsonData',
		trunc:       'jsonTrunc',
		location:    'jsonLocation',
		options:     'jsonOptionSet'
	},

	/** The series of paths through the rendered json object that we discover.
	  * When the user clicks on a value, the nearest ID attribute of the click
	  * target is matched up with an index for this array.  The value at that
	  * index is the path that must be used to reach the target value.
	  *
	  * @property
	  * @type {array}
	  */
	paths: [],

	/** Resolve all ID values.
	  * This is called automatically upon page load.
	  * This also turns off firefox's spellcheck on the input box.
	  * Also does settings according to the user's last render cookie.
	  */
	init: function () {
		var x, cookie;
		
		for (x in this.data) {
			if (this.data.hasOwnProperty(x)) {
				//x/ this.data[x] = $(this.data[x]);
				this.data[x] = document.getElementById(this.data[x]);
			}
		}

		if (this.data.input.spellcheck === true) {
			this.data.input.spellcheck = false;
		}

		[
			{ el: this.data.output,    fn: this.doClick                  },
			{ el: 'cmdRender',         fn: this.render                   },
			{ el: 'cmdClear',          fn: this.clear                    }
		].forEach(function (o) {
			Event.addListener(o.el, 'click', o.fn, this, true);
		}, this);

		cookie = COOKIE.get('json');
		cookie = cookie || '101011';
		cookie = cookie.split('');
		this.data.inStrict.checked   = (cookie[0] === '1');
		this.data.inEval.checked     = (cookie[0] === '0');
		this.data.preserve.checked   = (cookie[1] === '1');
		this.data.dates.checked      = (cookie[2] === '1');
		this.data.dataTables.checked = (cookie[3] === '1');
		this.data.trunc.checked      = (cookie[4] === '1');
		this.data.outHTML.checked    = (cookie[5] === '1');
		this.data.outJSON.checked    = (cookie[5] === '0');

		this.data.options.className = 'HTML';
	},




	/** Handle a click event in the output area.
	  * This determines the path required to reach a given element.
	  *
	  * @param {Event} e
	  */
	doClick: function (e) {
		var target = Event.getTarget(e),
			path;

		function findID(el) {
			return (el.id !== '');
		}

		if (
			this.data.outHTML.checked &&
				target.nodeName.toLowerCase() === 'caption'
		) {
			HTML.toggleArea(target);
		}

		if (target.id === '') {
			target = Dom.getAncestorBy(target, findID);
		}

		path = target.id;
		if (path === this.data.output.id) {
			path = '';
		}
		path = this.findPath(path);

		this.data.location.innerHTML = path;
	},


	/** This regular expression is used to help resolve the ID attribute of a
	  * clicked-on item into a corresponding index for the "paths" array.
	  * @property
	  * @type {RegExp}
	  */
	pathRE: /^px?(\d+)$/,

	/** Given the string value of an ID attribute, this returns the
	  * corresponding path value, as it exists in the "paths" array.
	  * @param  {string} path
	  * @return {string}
	  */
	findPath: function (path) {
		if (this.pathRE.test(path) === false) {
			return '';
		}
		path = Number(this.pathRE.exec(path)[1]);
		return (path > this.paths.length) ? '' : this.paths[path];
	},


	/** Static regular expression, used to detect dates.
	  * @property
	  * @type {RegExp}
	  */
	dateRE: /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)Z$/,


	/** Clear the display and prepare for new input. */
	clear: function () {
		this.reset();
		this.data.input.value = '';
		this.data.input.focus();
	},

	/** Parse the textarea's value as JSON.
	  * @return {object}
	  */
	parse: function (json) {

		/*jslint evil: true */
		var result;

		try {
			result = this.data.inStrict.checked ?
				Lang.JSON.parse(json) :
				eval("(" + json + ")");
		} catch (ex) {
			result = ex;
		}

		/*jslint evil: false */
		return result;
	},
	

	/** Parse the textarea's value as JSON.
	  * Render that json as HTML.
	  * Also show the size of the JSON in characters.
	  * If this is IE, fixes the width of tables to accomodate the captions.
	  * Also set a cookie indicating the user's preferences.
	  */
	render: function () {

		var json = this.data.input.value;
		this.reset();

		if (Lang.trim(json).length === 0) {
			return;
		}

		json = this.parse(json);

		if (json instanceof Error) {
			json = this.validate();
		}
		this.visualize(json);
	},


	/** Reset the display */
	reset: function () {
		this.data.location.innerHTML = '';
		this.data.output.className = '';
		this.data.output.innerHTML = '';
		this.data.validateOut.innerHTML = '';
		this.data.size.innerHTML = '';
		this.lastHover = null;
	},


	visualize: function (token) {
		var size = this.data.input.value.length,
			style = HTML;//this.data.outHTML.checked ? HTML : PRETTY,

			cookie = [
				this.data.inStrict.checked   ? '1' : '0',
				this.data.preserve.checked   ? '1' : '0',
				this.data.dates.checked      ? '1' : '0',
				this.data.dataTables.checked ? '1' : '0',
				this.data.trunc.checked      ? '1' : '0',

				this.data.outHTML.checked     ? '1' :
					this.data.outJSON.checked ? '0' : '2'

			].join('');

		this.paths = ['root'];

		this.data.output.className =
			this.data.outHTML.checked ? 'HTML' : 'PRETTY';

		this.data.output.innerHTML = style.display(token, 0);

		size = this.formatSize(size) + ' characters';
		size = this.html(size);
		this.data.size.innerHTML = size;

		if (COOKIE.get('json') !== cookie) {
			COOKIE.set('json', cookie);
		}

		/*@cc_on
		if (this.data.outHTML.checked) {
			this.fixTableWidths();
		}
		@*/

	},



	/** Expand or collapse all HTML sections.
	  * @param {string} toggleState    State to flip.
	  */
	expandOrCollapse: function (toggleState) {
		var x, state,
			captions = this.data.output.getElementsByTagName('caption'),
			toFlip = [];

		for (x = 0; x < captions.length; x += 1) {
			state = captions[x].firstChild.nodeValue.substring(1, 2);
			if (state === toggleState) {
				toFlip[toFlip.length] = captions[x];
			}
		}

		toFlip.forEach(HTML.toggleArea);
	},


	/** Trims the input value of all sorts of stuff, looking for the first
	  * set of either {} or [] that can be found.
	  *
	  * If more than one outermost set is found, prompt the user about what
	  * to do.
	  */
	trimToJSON: function () {
		var start, c, x,
			input    = this.data.input,
			value    = input.value,
			inString = null,
			opener   = null,
			closer   = null,
			depth    = 0,
			pairs    = [];

		value = value.replace(/^\s\s*/, '').replace(/\s\s*$/, '');

		// Cycle through each character in the string.
		// Either { or [ may start a JSON segment.
		// Once in a JSON segment, either ' or " may start a string.
		// Once in a string, a string must be terminated by a matching ' or "
		// In a string, the matching ' or " may be escaped by \
		// The JSON segment is ended by a matching ] or }
		// Multiple JSON segments may exist.
		for (x = 0; x < value.length; x++) {
			c = value.charCodeAt(x);
			switch (c) {
			case 34: // "
			case 39: // '
				// Ignore if we are not in a JSON segment.
				if (opener === null) {
					break;
				}
				// If we are in a string, check to see if this closes it.
				if (inString) {
					if (
						c === inString &&
							value.charCodeAt(x - 1) !== 92 // 92 === \ (escape)
					) {
						inString = null;
					}
				// Otherwise, we start a string.
				} else {
					inString = c;
				}
				break;

			case 123: // {
			case 91:  // [
				// Ignore if we are inside a string.
				if (inString) {
					break;
				}
				// If we aren't in one already, then this marks the
				// beginning of a JSON segment.
				if (opener === null) {
					opener = c;
					closer = opener + 2;
					depth++;
					start = x;
				// If we are already in a segment, then and this opens
				// another segment of the same type, we have to increase
				// the depth... So the closing brace for the inner segment
				// does not close the outer segment.
				} else if (c === opener) {
					depth++;
				}
				break;

			case 125: // }
			case 93:  // ]
				// Ignore if we are inside a string.
				if (inString) {
					break;
				}

				// If this is a closing brace that matches our opening brace,
				// decrease the depth by one.
				if (c === closer) {
					depth--;
					// If we reach zero-depth, we finished the JSON segment.
					// Stash it into the array and move on.
					if (depth === 0) {
						pairs.push(value.substring(start, x + 1));
						opener = null;
					}
				}

				break;
			}
		}

		switch (pairs.length) {
		case 0:
			window.alert('No braces found.');
			return;

		case 1:
			this.data.input.value = pairs[0];
			return;

		default:
			if (
				window.confirm(
					"Multiple potential objects found.\n" +
						"Wrap all objects in an array?"
				)
			) {
				this.data.input.value = "[" + pairs.join(",") + "]";
			}
			return;
		}
	},


	/** Format a number to be human-readable, with commas and whatnot.
	  *
	  * @param  {number} n
	  * @return {string}
	  */
	formatSize: function (n) {
		if (isNaN(n) || n.length === 0) {
			return '';
		}

		var s = n.toString(),
			i = s.length - 3;

		while (i >= 1) {
			s = s.substring(0, i) + ',' + s.substring(i, s.length);
			i -= 3;
		}
		return s;
	},


	/** Prepare a string for insertion as HTML.
	  * @param  {string} s
	  * @return {string}
	  */
	html: function (s) {
		return s
			.toString()
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
	},


	/** This regular expresion helps identify whether a string could be a
	  * legal javascript variable name.  Javascript variables must start with
	  * a letter, underscore, or $ symbol. Subsequent characters may also
	  * include numbers.
	  * @property
	  * @type {RegExp}
	  */
	variableRE: /^[a-z_$][\w$]*$/i,

	/** This is a list of reserved words in javascript. They cannot be valid
	  * variable names, so when we render a path, these words cannot be used
	  * with dot-notation.
	  * @property
	  * @type {array}
	  */
	reserved: [
		'abstract', 'boolean', 'break', 'byte', 'case', 'catch', 'char',
		'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do',
		'double', 'else', 'enum', 'export', 'extends', 'false', 'final',
		'finally', 'float', 'for', 'function', 'goto', 'if', 'implements',
		'import', 'in', 'instanceof', 'int', 'interface', 'long', 'native',
		'new', 'null', 'package', 'private', 'protected', 'public', 'return',
		'short', 'static', 'super', 'switch', 'synchronized', 'this', 'throw',
		'throws', 'transient', 'true', 'try', 'typeof', 'var', 'void',
		'volatile', 'while', 'with'
	],

	/** Returns a string as it would need to be encoded if it were going to
	  * be used to access the property of an object in javascript.
	  * This will add either a dot for dot-notation, or use square brackets
	  * if necessary.
	  * @param  {string} s
	  / @return {string}
	  */
	variable: function (s) {
		if (
			this.variableRE.test(s) === true &&
				this.reserved.indexOf(s) === -1
		) {
			// No need to HTML encode this.
			// Characters that are not legal HTML are also not legal in
			// javascript variables, and would have been detected by the
			// regular expression.
			return '.' + s;
		}

		return '[<span class="STRING">' +
			this.html(Lang.JSON.stringify(s)) + '</span>]';
	},


	/** When calculating the width of a table, IE8- does not take the width
	  * of the caption into account.  This results in visual oddities, where
	  * the caption will spill outside of its container.  We fix this in IE
	  * by locating each table, calculating the correct width, and setting it
	  * manually.
	  */
	fixTableWidths: function () {

		var x, container, tableWidth, captionWidth,
			captions = this.data.output.getElementsByTagName('caption');

		for (x = 0; x < captions.length; x += 1) {

			tableWidth = captions[x].parentNode.offsetWidth;
			captionWidth = captions[x].scrollWidth + 4;
			container = captions[x].parentNode.parentNode;

			if (container.nodeName.toLowerCase() === 'td') {
				container.style.width =
					Math.max(tableWidth, captionWidth).toString() + 'px';
			}
		}

	}


};


PRETTY = {

	indent: 0,
	newLine: function () {
		var x, output = '<br />';
		for (x = 0; x < this.indent; x++) {
			output += '\u00A0\u00A0\u00A0\u00A0';
		}
		return output;
	},

	display: function (obj, path) {

		return Lang.isArray(obj) ?
			this.array(obj, path) :

			Lang.isBoolean(obj) ?
			this.bool(obj, path) :

			Lang.isFunction(obj) ?
			this.func(obj, path) :

			Lang.isNull(obj) ?
			'<span id="p' + path + '" title="null" class="NULL">null</span>' :

			Lang.isNumber(obj) ?
			'<span id="p' + path + '" title="Number" class="NUMBER">' +
			obj.toString() + '</span>' :

			Lang.isString(obj) ?
			this.string(obj, path) :

			Lang.isUndefined(obj) ?
			'<span id="p' + path +
			'" title="undefined" class="UNDEF">undefined</span>' :

			(obj instanceof Error) ?
			this.err(obj, path) :

			(obj instanceof Date) ?
			this.date(obj, path) :

			(obj instanceof RegExp) ?
			HTML.regExp(obj, path) :

			Lang.isObject(obj) ?
			this.obj(obj, path) :

			isNaN(obj) ?
			'<span id="p' + path + '" title="NaN" class="ERR">NaN</span>' :

			(obj === Infinity) ?
			'<span id="p' + path +
			'" title="Infinity" class="ERR">Infinity</span>' :
			
			'<span id="p' + path + '" class="IDK">[Unknown Data Type]</span>';
	},

	array: function (a, path) {
		var x, output = [];

		this.indent++;

		for (x = 0; x < a.length; x++) {
			VIS.paths.push(
				VIS.paths[path] + '[<span class="NUMBER">' + x + '</span>]'
			);

			output[x] = this.display(a[x], VIS.paths.length - 1);
		}

		output = this.newLine() + output.join(',' + this.newLine());

		this.indent--;

		return (a.length) ?
			'<span id="p' + path + '" class="ARRAY">[' +
			output + this.newLine() + ']</span>' :

			'<span id="p' + path + '" class="ARRAY">[\u00A0]</span>';
	},

	bool: function (b, path) {
		return (b) ?
			'<span id="p' + path +
			'" title="Boolean" class="BOOL">true</span>' :

			'<span id="p' + path +
			'" title="Boolean" class="BOOL">false</span>';
	},

	func: function (f, path) {
		var i, s = f.toString();
		if (VIS.data.trunc.checked) {
			i = s.indexOf('{') + 50;
			if (i < s.length) {
				s = VIS.html(s.substring(0, i)) + '\u2026\n}';
				s = s.replace(/\n/g, this.newLine());
				return '<code id="p' + path +
					'" title="Function (truncated)" class="FUNC">' +
					s + '</code>';
			}
		}
		s = VIS.html(s).replace(/\n/g, this.newLine());

		return '<code id="p' + path + '" title="Function" class="FUNC">' +
			s + '</code>';
	},

	string: function (s, path) {

		if (VIS.data.dates.checked && VIS.dateRE.test(s)) {
			return this.date(s, path);
		}

		s = Lang.JSON.stringify(s);

		if (VIS.data.trunc.checked && s.length > 68) {
			s = s.substring(1, s.length - 1);
			s = s.substring(0, 67) + '\u2026';
			s = '"' + s + '"';
		}

		return '<span id="p' + path + '" title="String" class="STRING">' +
			VIS.html(s) + '</span>';
	},

	err: function (e, path) {
		if (e.message === 'parseJSON') {
			return '<span id="p' + path +
				'" title="Error" class="ERR">Invalid JSON</span>';
		}

		VIS.paths.push(VIS.paths[path] + '.message');
		return '<span id="p' + path +
			'" title="Error" class="ERR">new Error(' +
			this.string(e.message, VIS.paths.length - 1) + ')</span>';
	},

	date: function (d, path) {
		return '<span id="p' + path + '" title="Date" class="DATE">' +
			Lang.JSON.stringify(d) + '</span>';
	},

	obj: function (o, path) {
		var x, body = [];

		this.indent++;

		for (x in o) {
			if (o.hasOwnProperty(x)) {
				VIS.paths.push(VIS.paths[path] + VIS.variable(x));

				body.push(
					'<span id="px' + (VIS.paths.length - 1) + '">' +
						Lang.JSON.stringify(x) + ': ' +
						this.display(o[x], VIS.paths.length - 1) + '</span>'
				);
			}
		}

		if (body.length) {
			body = this.newLine() + body.join(',' + this.newLine());
		}

		this.indent--;

		return (body.length) ?
			'<span id="p' + path + '" class="OBJ">{' +
			body + this.newLine() + '}</span>' :

			'<span id="p' + path + '" class="OBJ">{\u00A0}</span>';
	}


};

HTML = {

	toggleArea: function (captionNode) {

		var x,
			table = captionNode.parentNode,
			state = captionNode.firstChild.nodeValue.substring(1, 2);

		if (state === '-') {

			if (table.tHead) {
				table.tHead.style.display = 'none';
			}

			for (x = 0; x < table.tBodies.length; x += 1) {
				table.tBodies[x].style.display = 'none';
			}

			captionNode.firstChild.nodeValue =
				'[+]' + captionNode.firstChild.nodeValue.substring(3);

		} else {

			if (table.tHead) {
				table.tHead.style.display = '';
			}

			for (x = 0; x < table.tBodies.length; x += 1) {
				table.tBodies[x].style.display = '';
			}

			captionNode.firstChild.nodeValue =
				'[-]' + captionNode.firstChild.nodeValue.substring(3);

		}

	},

	/** Render a javascript object of unknown type as HTML
	  * @param  {object} obj
	  * @param  {number} path
	  * @return {string}
	  */
	display: function (obj, path) {

		return Lang.isArray(obj) ?
			VIS.data.dataTables.checked ?
			this.structure(obj, path) :
			this.array(obj, path) :

			Lang.isBoolean(obj) ?
			this.bool(obj, path) :

			Lang.isFunction(obj) ?
			this.func(obj, path) :
		
			Lang.isNull(obj) ?
			'<span id="p' + path + '" title="null" class="NULL">null</span>' :

			Lang.isNumber(obj) ?
			'<span id="p' + path + '" title="Number" class="NUMBER">' +
			obj.toString() + '</span>' :

			Lang.isString(obj) ?
			this.string(obj, path) :

			Lang.isUndefined(obj) ?
			'<span id="p' + path +
			'" title="undefined" class="UNDEF">undefined</span>' :

			(obj instanceof Error) ?
			this.err(obj, path) :

			(obj instanceof Date) ?
			this.date(obj, path) :

			(obj instanceof RegExp) ?
			this.regExp(obj, path) :

			Lang.isObject(obj) ?
			VIS.data.dataTables.checked ?
			this.structure(obj, path) :
			this.obj(obj, path) :


			isNaN(obj) ?
			'<span id="p' + path + '" title="NaN" class="ERR">NaN</span>' :

			(obj === Infinity) ?
			'<span id="p' + path +
			'" title="Infinity" class="ERR">Infinity</span>' :

			'<span id="p' + path + '" class="IDK">[Unknown Data Type]</span>';
	},


	/** Render a javascript array as HTML
	  * @param  {array}  a     The array to be rendered
	  * @param  {number} path  The path by which this array is reached.
	  * @return {string}
	  */
	array: function (a, path) {
		var x, body = '';

		for (x = 0; x < a.length; x++) {
			VIS.paths.push(
				VIS.paths[path] + '[<span class="NUMBER">' + x + '<\/span>]'
			);

			body +=
				'<tr id="p' + (VIS.paths.length - 1) + '"><th>' +
				x + '</th><td>' +
				this.display(a[x], VIS.paths.length - 1) + '</td></tr>';
		}

		return (body.length) ?
			'<table id="p' + path + '" class="ARRAY">' +
			'<caption>[-] Array, ' + VIS.formatSize(a.length) +
			(a.length === 1 ? ' item' : ' items') +
			'</caption><tbody>' + body + '</tbody></table>' :

			'<span id="p' + path +
			'" title="Array" class="ARRAY">[ Empty Array ]</span>';
	},

	/** Render a javascript boolean value as HTML
	  * @param  {boolean} b
	  * @param  {number}  path
	  * @return {string}
	  */
	bool: function (b, path) {
		return (b) ?
			'<span id="p' + path +
			'" title="Boolean" class="BOOL">true</span>' :

			'<span id="p' + path +
			'" title="Boolean" class="BOOL">false</span>';
	},

	/** Render a javascript string as HTML
	  * @param  {string} s
	  * @param  {number} path
	  * @return {string}
	  */
	string: function (s, path) {
		if (s.length === 0) {
			return '<span id="p' + path +
				'" title="String" class="EMPTY">[zero-length string]</span>';
		}

		// Check and see if this is secretly a date
		if (VIS.data.dates.checked && VIS.dateRE.test(s)) {
			return this.date(Lang.JSON.stringToDate(s), path);
		}

		var tag = VIS.data.preserve.checked ? 'pre' : 'span';

		if (VIS.data.trunc.checked && s.length > 70) {
			s = s.substring(0, 70) + '\u2026'; // 2026 = "..."
		}

		return '<' + tag + ' id="p' + path +
			'" title="String" class="STRING">' + VIS.html(s) +
			'</' + tag + '>';
	},

	/** Render a javascript regular expression as HTML
	  * @param  {RegExp} re
	  * @param  {number} path
	  * @return {string}
	  */
	regExp: function (re, path) {
		var output = "/" + VIS.html(re.source) + "/";
		if (re.global) {
			output += 'g';
		}
		if (re.ignoreCase) {
			output += 'i';
		}
		if (re.multiline) {
			output += 'm';
		}
		return '<span id="p' + path +
			'" title="RegEx" class="REGEXP">' + output + '</span>';
	},

	/** Render a javascript object as HTML
	  * @param  {object} o
	  * @param  {number} path
	  * @return {string}
	  */
	obj: function (o, path) {
		var x, body = [];

		for (x in o) {
			if (o.hasOwnProperty(x)) {
				VIS.paths.push(VIS.paths[path] + VIS.variable(x));

				body.push(
					'<tr id="px' + (VIS.paths.length - 1) + '"><th>' +
						VIS.html(x) + '</th><td>' +
						this.display(o[x], VIS.paths.length - 1) +
						'</td></tr>'
				);
			}
		}

		return (body.length) ?
			'<table id="p' + path + '" class="OBJ">' +
			'<caption>[-] Object, ' + VIS.formatSize(body.length) +
			(body.length === 1 ? ' property' : ' properties') +
			'</caption><tbody>' + body.join('') + '</tbody></table>' :

			'<span id="p' + path +
			'" title="Object" class="OBJ">{ Empty Object }</span>';
	},

	/** Render a javascript date object as HTML
	  * @param  {Date} d
	  * @param  {number} path
	  * @return {string}
	  */
	date: function (d, path) {
		if (isNaN(d)) {
			return '<span id="p' + path +
				'" title="Date" class="ERR">Invalid Date</span>';
		}

		function pad(num) {
			var s = num.toString();
			return (num < 10) ? '0' + s : s;
		}

		function format(yyyy, mm, dd, hh, nn, ss) {
			var hh12 = (hh === 0) ? 12 : (hh > 12) ? hh - 12 : hh,
				tt = (hh > 11) ? 'PM' : 'AM';

			return (
				yyyy + '-' +
				pad(mm) + '-' +
				pad(dd) + ' ' +
				pad(hh12) + ':' +
				pad(nn) + ':' +
				pad(ss) + ' ' + tt
			);
		}

		var local = format(
			d.getFullYear(),
			d.getMonth() + 1,
			d.getDate(),
			d.getHours(),
			d.getMinutes(),
			d.getSeconds()
		),

			utc = format(
				d.getUTCFullYear(),
				d.getUTCMonth() + 1,
				d.getUTCDate(),
				d.getUTCHours(),
				d.getUTCMinutes(),
				d.getUTCSeconds()
			),

			output = utc + ' UTC (' + local + ' Local)';

		return '<span id="p' + path + '" title="Date" class="DATE">' +
			output + '</span>';
	},

	/** Render a javascript error as HTML
	  * @param  {Error}  e
	  * @param  {number} path
	  * @return {string}
	  */
	err: function (e, path) {
		if (e.message === 'parseJSON') {
			return '<span id="p' + path +
				'" title="Error" class="ERR">Invalid JSON</span>';
		}

		return '<span id="p' + path + '" title="Error" class="ERR">' +
			VIS.html(e.message) + '</span>';
	},

	/** Render a javascript function as HTML
	  * @param  {function} f
	  * @param  {number}   path
	  * @return {string}
	  */
	func: function (f, path) {
		var i, s = f.toString();
		if (VIS.data.trunc.checked) {
			i = s.indexOf('{') + 50;
			if (i < s.length) {
				s = VIS.html(s.substring(0, i)) + '\u2026<br \/>}';
				return '<code id="p' + path +
					'" title="Function (truncated)" class="FUNC">' + s +
					'<\/code>';
			}
		}
		return '<code id="p' + path + '" title="Function" class="FUNC">' +
			VIS.html(s) + '<\/code>';
	},

	/** Detect a data table.  I define this as an object (or array) containing
	  * two or more items, in which at least 66% of the items are similar to
	  * one another. Two objects are similar if they have the same number of
	  * key values, and all of the key values of one object are found in the
	  * other object.
	  * <p>
	  * We are going to loop through the properties of the object (or items of
	  * the array), and for each object that we find, we are going to collect
	  * a list of its keys. Each list will be like a footprint.  We will keep
	  * a list of all distinct footprints we find.  Each time we generate a
	  * new footprint, we compare it to the others in the list.  If we have
	  * seen it before, we make a note of how many times we see it.  If we
	  * have not seen it before, we add it to our list of footprints. 
	  * When this is done, we will be able to see how many different footprints
	  * we have, and whether any one footprint occurs at least 66% of the time.
	  * <p>
	  * Items that are better represented as other values (dates, numbers,
	  * strings, booleans, etc) are counted towards the total length of the
	  * structure, but they do not contribute footprints.
	  * <p>
	  * After we decide which footprint is dominant, we begin generating a
	  * tabular structure.  We use the list of keys as the column names (plus
	  * one for the row number), then loop over each item in the object.  If
	  * that item's footprint matches, it is rendered into the tabular
	  * structure.  If it doesn't match, it gets a colspan, and is rendered
	  * normally.
	  * <p>
	  * If it is determined that this is NOT a valid structure, rendering
	  * will proceed with either VIS.array or VIS.object, as appropriate.
	  *
	  * @param  {object | array}  obj
	  * @param  {number}          path
	  * @return {string}
	  */
	structure: function (obj, path) {
		var structure = new STRUCTURE(obj);

		if (structure.isValid(2 / 3) === false) {
			return Lang.isArray(obj) ?
				this.array(obj, path) :
				this.obj(obj, path);
		}

		return structure.render(obj, path);
	}

};



/** Provides a few necessary methods for detecting and rendering a generic
  * data structure.
  * @constructor
  * @param {object | array} o
  */
STRUCTURE = function (o) {
	this.footPrints = [];
	this.length = 0;

	// Determine the mode of all subobject property sets.  This also updates
	// the length property.
	this.footPrint = this.scanObject(o);
};


/** A single foot print.  Used to help determine which set of properties
  * occurs the most often in a set of sets.
  *
  * @constructor
  * @param {array} keys
  */
STRUCTURE.Footprint = function (keys) {
	this.keys = keys.slice();
	this.count = 1;
};


STRUCTURE.Footprint.prototype = {

	/** Determine if this footprint is equal to another set of keys.
	  * @param  {array} keys
	  * @return {boolean}
	  */
	equals: function (keys) {
		var x;
		if (this.keys.length === keys.length) {
			for (x = 0; x < keys.length; x++) {
				if (this.keys[x] !== keys[x]) {
					return false;
				}
			}
		} else {
			return false;
		}
		return true;
	},

	/** Render this footprint as a set of HTML table cells.
	  * @return {string}
	  */
	render: function (row, path) {
		var keys   = this.keys,
			x      = 0,
			k      = keys.length,
			output = [];

		if (row) {
			for (; x < k; x++) {
				VIS.paths.push(VIS.paths[path] + VIS.variable(keys[x]));

				output[x] =
					'<td id="px' + (VIS.paths.length - 1) + '">' +
					HTML.display(row[keys[x]], VIS.paths.length - 1) +
					'<\/td>';
			}
		} else {
			for (; x < k; x++) {
				output[x] = '<th>' + VIS.html(keys[x]) + '<\/th>';
			}
		}

		return output.join('');
	}
};



/** Determine whether a given object is valid for inclusion as a row in a
  * datatable structure.
  * @param  {object} o
  * @return {boolean}
  */
STRUCTURE.isObject = function (o) {
	return (
		Lang.isObject(o)    === true  &&
		Lang.isArray(o)     === false &&
		Lang.isFunction(o)  === false &&
		o instanceof Error  === false &&
		o instanceof Date   === false &&
		o instanceof RegExp === false
	);
};


/** Sort an array numerically */
STRUCTURE.numericSort = function (a, b) {
	return a - b;
};


/** Extract a sorted list of keys from the given object.
  * @param  {object} o
  * @return a
  */
STRUCTURE.getKeys = function (o) {
	var a = [], y;

	for (y in o) {
		if (o.hasOwnProperty(y)) {
			a[a.length] = y;
		}
	}

	if (Lang.isArray(o)) {
		a.sort(STRUCTURE.numericSort);
	} else {
		a.sort();
	}

	return a;
};


STRUCTURE.prototype = {

	/** Scan an object for inclusion in this data structure.
	  *
	  * Updates the length property of this structure.
	  *
	  * @param  {object} o
	  * @return {array}
	  *
	  */
	scanObject: function (o) {
		var x, keys, length = 0;
		for (x in o) {
			if (o.hasOwnProperty(x)) {
				length++;
				if (STRUCTURE.isObject(o[x])) {
					keys = STRUCTURE.getKeys(o[x]);
					if (keys.length > 0) {
						this.addFootPrint(keys);
					}
				}
			}
		}

		this.length += length;
		return this.getMode();
	},


	/** Add a single footprint to our collection of footprints.
	  * @param {array} keys
	  */
	addFootPrint: function (keys) {
		var x, footPrints = this.footPrints;

		for (x = 0; x < footPrints.length; x++) {
			if (footPrints[x].equals(keys)) {
				footPrints[x].count++;
				return true;
			}
		}

		footPrints[footPrints.length] = new STRUCTURE.Footprint(keys);
		return true;
	},

	/** Return the mode of the footprints (i.e., the one that occurred the
	  * most often).
	  *
	  * @return {STRUCTURE.FootPrint}
	  */
	getMode: function () {
		var x,
			count      = 0,
			max        = null,
			footPrints = this.footPrints;

		for (x = 0; x < footPrints.length; x++) {
			if (footPrints[x].count > count) {
				max = footPrints[x];
				count = max.count;
			}
		}
		return max;
	},

	/** This is only valid as a structure if at least two items have been
	  * scanned, and if the the mode of all subobject property sets occurred
	  * at least X% of the time.
	  *
	  * @param  {number}  threshold
	  * @return {boolean}
	  */
	isValid: function (threshold) {
		return (
			this.length > 1 &&
			this.footPrint !== null &&
			this.footPrint.count >= (this.length * threshold)
		);
	},


	/** Render the given object using this data structure as a framework.
	  * @param {object | array} obj
	  * @param {number}         path
	  * @return {string}
	  */
	render: function (obj, path) {
		var x, keys, row, subPath,
			html       = VIS.html,
			properties = STRUCTURE.getKeys(obj),
			span       = this.footPrint.keys.length,
			o          = [],
			p          = 0,
			isArray    = Lang.isArray(obj);

		o[p++] =
			'<table id="p' + path + '" class="ARRAY">' +
			'<caption>[-] ' +
			(isArray ? 'Array' : 'Object') +
			' data structure, ' + VIS.formatSize(properties.length) +
			(isArray ? ' items' : ' properties') +
			'</caption><thead><tr><th>[key]</th>';

		o[p++] = this.footPrint.render();
		o[p++] = '</tr></thead><tbody>';

		path = VIS.paths[path];

		for (x = 0; x < properties.length; x++) {
			row = obj[properties[x]];
			keys = STRUCTURE.getKeys(row);

			subPath = 
				(isArray && isNaN(parseInt(properties[x], 10)) === false) ?
				'[<span class="NUMBER">' + properties[x] + '</span>]' :
				VIS.variable(properties[x]);

			VIS.paths.push(path + subPath);

			if (this.footPrint.equals(keys)) {
				o[p++] =
					'<tr id="p' + (VIS.paths.length - 1) + '"><th' +
					(isArray ? ' class="NUMBER">' : '>') +
					html(properties[x]) + '</th>';

				o[p++] = this.footPrint.render(row, VIS.paths.length - 1);
				o[p++] = '</tr>';

			} else {
				o[p++] =
					'<tr id="p' + (VIS.paths.length - 1) + '"><th><em' +
					(isArray ? ' class="NUMBER">' : '>') +
					html(properties[x]) + '</em></th><td colspan="' +
					span + '">';

				o[p++] = HTML.display(row, VIS.paths.length - 1);
				o[p++] = '</td></tr>';
			}
		}

		o[p++] = '</tbody></table>';
		return o.join('');
	}
};


QUERYSTRING = (function () {

	function parseSource(source) {
		source = String(source);

		if (source.substring(0, 1) === '?') {
			source = source.substring(1);
		}

		source = source.split('&');

		var x = source.length;
		while (x--) {
			source[x] = source[x].split('=');

			if (source[x].length === 2) {
				source[x][0] = decodeURIComponent(source[x][0]);
				source[x][1] = decodeURIComponent(source[x][1]);
			} else {
				source.splice(x, 1);
			}
		}

		return source;
	}

	function QueryString(source) {

		source = (source === null || source === undefined) ?
			document.location.search : String(source);

		source = parseSource(source);

		this.get = function (key) {
			key = key.toUpperCase();
			var x, output = [];
			for (x = 0; x < source.length; x += 1) {
				if (source[x][0].toUpperCase() === key) {
					output.push(source[x][1]);
				}
			}

			return output;
		};

		this.set = function (key, values) {

			key = String(key);

			if ($.isArray(values) === false) {
				values = [values];
			}

			var x, ucKey = key.toUpperCase();

			x = values.length;
			while (x--) {
				if (values[x] === null || values[x] === undefined) {
					values.splice(x, 1);
				} else {
					values[x] = String(values[x]);
				}
			}

			x = source.length;
			while (x--) {
				if (source[x][0].toUpperCase() === ucKey) {
					source.splice(x, 1);
				}
			}

			for (x = 0; x < values.length; x += 1) {
				source.push([ key, values[x] ]);
			}

			return this;
		};

		this.toString = function () {
			if (source.length === 0) {
				return '';
			}

			var x, output = [];
			for (x = 0; x < source.length; x += 1) {
				output.push(
					encodeURIComponent(source[x][0]) + '=' +
						encodeURIComponent(source[x][1])
				);
			}

			return '?' + output.join('&');
		};
	}

	return QueryString;
}());


COOKIE = {
	set: function (name, value) {
		var expires = new Date(),
			cookie =
				encodeURIComponent(name) + '=' +
				encodeURIComponent(value);

		expires.setFullYear(expires.getFullYear() + 1);
		expires = expires.toGMTString();
		cookie += '; expires=' + expires + '; path=/';

		document.cookie = cookie;
		return cookie;
	},
	get: function (name) {
		var cookie,
			cookies = document.cookie.split(/;\s*/),
			x = cookies.length;

		while (x--) {
			cookie = cookies[x];
			if (cookie.indexOf(name) === 0) {
				// +1 is for the equal sign
				return cookie.substring(name.length + 1);
			}
		}
		return null;
	},
	del: function (name) {
		var expires = new Date(),
			cookie = encodeURIComponent(name) + '=';

		expires.setDate(expires.getDate() - 1);
		expires = expires.toGMTString();

		cookie += '; expires=' + expires + '; path=/';
		document.cookie = cookie;
		return cookie;
	}
};

Event.onDOMReady(VIS.init, VIS, true);
