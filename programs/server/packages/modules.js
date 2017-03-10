(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var meteorInstall = Package['modules-runtime'].meteorInstall;

/* Package-scope variables */
var Buffer, process;

var require = meteorInstall({"node_modules":{"meteor":{"modules":{"server.js":["./install-packages.js","./buffer.js","./process.js","reify/lib/runtime",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/modules/server.js                                                                                      //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
require("./install-packages.js");
require("./buffer.js");
require("./process.js");
require("reify/lib/runtime").enable(module.constructor);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"buffer.js":["buffer",function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/modules/buffer.js                                                                                      //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
try {
  Buffer = global.Buffer || require("buffer").Buffer;
} catch (noBuffer) {}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"install-packages.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/modules/install-packages.js                                                                            //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
function install(name, mainModule) {
  var meteorDir = {};

  // Given a package name <name>, install a stub module in the
  // /node_modules/meteor directory called <name>.js, so that
  // require.resolve("meteor/<name>") will always return
  // /node_modules/meteor/<name>.js instead of something like
  // /node_modules/meteor/<name>/index.js, in the rare but possible event
  // that the package contains a file called index.js (#6590).

  if (mainModule) {
    meteorDir[name + ".js"] = [mainModule, function (require, e, module) {
      module.exports = require(mainModule);
    }];
  } else {
    // back compat with old Meteor packages
    meteorDir[name + ".js"] = function (r, e, module) {
      module.exports = Package[name];
    };
  }

  meteorInstall({
    node_modules: {
      meteor: meteorDir
    }
  });
}

// This file will be modified during computeJsOutputFilesMap to include
// install(<name>) calls for every Meteor package.

install("underscore");
install("meteor");
install("modules-runtime");
install("modules", "meteor/modules/server.js");
install("es5-shim", "meteor/es5-shim/server.js");
install("promise", "meteor/promise/server.js");
install("ecmascript-runtime", "meteor/ecmascript-runtime/runtime.js");
install("babel-compiler");
install("ecmascript");
install("babel-runtime", "meteor/babel-runtime/babel-runtime.js");
install("random");
install("rate-limit");
install("ddp-rate-limiter");
install("base64");
install("ejson");
install("check", "meteor/check/match.js");
install("callback-hook");
install("tracker");
install("retry");
install("id-map");
install("ddp-common");
install("diff-sequence");
install("mongo-id");
install("ddp-client");
install("logging");
install("routepolicy");
install("deps");
install("htmljs");
install("html-tools");
install("blaze-tools");
install("spacebars-compiler");
install("observe-sequence");
install("jquery");
install("reactive-var");
install("blaze");
install("spacebars");
install("ui");
install("boilerplate-generator");
install("webapp-hashing");
install("webapp");
install("ordered-dict");
install("geojson-utils", "meteor/geojson-utils/main.js");
install("minimongo");
install("ddp-server");
install("ddp");
install("npm-mongo");
install("allow-deny");
install("binary-heap");
install("mongo");
install("accounts-base", "meteor/accounts-base/server_main.js");
install("service-configuration");
install("localstorage");
install("url");
install("oauth");
install("accounts-oauth");
install("oauth2");
install("http");
install("google");
install("accounts-google");
install("sacha:spin");
install("manuelschoebel:cheerio");
install("oauth1");
install("twitter");
install("accounts-twitter");
install("mrt:twit");
install("mrt:twilio-meteor");
install("alisalaah:hogan");
install("facebook");
install("accounts-facebook");
install("npm-bcrypt", "meteor/npm-bcrypt/wrapper.js");
install("sha");
install("srp");
install("email");
install("accounts-password");
install("meteorhacks:meteorx");
install("meteorhacks:unblock");
install("raix:ui-dropped-event");
install("fastclick");
install("mquandalle:ismobile");
install("mongo-livedata");
install("meteorhacks:collection-utils");
install("meteorhacks:aggregate");
install("reywood:publish-composite");
install("bozhao:accounts-instagram");
install("raix:handlebar-helpers");
install("maxharris9:connection-banner");
install("adamgins:microsoft-oauth");
install("johnantoni:meteor-appear");
install("copleykj:jquery-autosize");
install("djedi:sanitize-html");
install("linto:jquery-ui");
install("livedata");
install("mrt:q");
install("percolate:google-api");
install("meteorhacks:subs-manager");
install("templating-compiler");
install("templating-runtime");
install("templating");
install("dburles:google-maps");
install("browser-policy-common");
install("browser-policy-content");
install("browser-policy-framing");
install("browser-policy");
install("fortawesome:fontawesome");
install("mdg:geolocation");
install("mizzao:timesync");
install("meteor-base");
install("mobile-experience");
install("blaze-html-templates");
install("session");
install("reload");
install("less");
install("lukemadera:social-share");
install("crosswalk");
install("harrison:papa-parse");
install("meteorhacks:inject-initial");
install("natestrauser:filepicker-plus");
install("jparker:crypto-core");
install("jparker:crypto-sha256");
install("jparker:crypto-hmac");
install("momentjs:moment");
install("peerlibrary:blocking");
install("peerlibrary:aws-sdk");
install("froatsnook:request");
install("force-ssl");
install("buzzy-buzz:common-globals");
install("meteorhacks:npm");
install("iron:core");
install("iron:dynamic-template");
install("iron:layout");
install("iron:url");
install("iron:middleware-stack");
install("iron:location");
install("reactive-dict");
install("iron:controller");
install("iron:router");
install("sacha:juice");
install("meteorhacks:ssr");
install("meteorhacks:picker");
install("lookback:emails");
install("raix:eventemitter");
install("raix:eventstate");
install("raix:push");
install("hot-code-push");
install("meteorhacks:async");
install("autoupdate");
install("buzzy-buzz:resources-core");
install("pfafman:filesaver");
install("simple:reactive-method");
install("jeremy:selectize");
install("jparker:crypto-md5");
install("jparker:gravatar");
install("buzzy-buzz:avatar");
install("peppelg:bootstrap-3-modal");
install("richsilv:owl-carousel");
install("dispatch:deep-link");
install("standard-minifier-css");
install("standard-minifier-js");
install("huttonr:bootstrap3-assets");
install("huttonr:bootstrap3");
install("npm-container");
install("okgrow:router-autoscroll");
install("shell-server", "meteor/shell-server/main.js");
install("risul:moment-timezone");
install("tsega:bootstrap3-datetimepicker");
install("okgrow:analytics", "meteor/okgrow:analytics/server-main.js");
install("barbatus:stars-rating");
install("cosmos:browserify");
install("jamielob:reloader");
install("froala:editor-reactive");
install("launch-screen");

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"process.js":["process",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/modules/process.js                                                                                     //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
try {
  // The application can run `npm install process` to provide its own
  // process stub; otherwise this module will provide a partial stub.
  process = global.process || require("process");
} catch (noProcess) {
  process = {};
}

if (Meteor.isServer) {
  // Make require("process") work on the server in all versions of Node.
  meteorInstall({
    node_modules: {
      "process.js": function (r, e, module) {
        module.exports = process;
      }
    }
  });
} else {
  process.platform = "browser";
  process.nextTick = process.nextTick || Meteor._setImmediate;
}

if (typeof process.env !== "object") {
  process.env = {};
}

_.extend(process.env, meteorEnv);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"node_modules":{"reify":{"lib":{"runtime.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/meteor/modules/node_modules/reify/lib/runtime.js                                                   //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var Entry = require("./entry.js").Entry;
var utils = require("./utils.js");

exports.enable = function (Module) {
  var Mp = Module.prototype;

  if (typeof Mp.import === "function" &&
      typeof Mp.export === "function") {
    // If the Mp.{import,export} methods have already been
    // defined, abandon reification immediately.
    return Module;
  }

  // Platform-specific code should implement this method however
  // appropriate. Module.prototype.resolve(id) should return an absolute
  // version of the given module identifier, like require.resolve.
  Mp.resolve = Mp.resolve || function resolve(id) {
    throw new Error("Module.prototype.resolve not implemented");
  };

  // Platform-specific code should find a way to call this method whenever
  // the module system is about to return module.exports from require. This
  // might happen more than once per module, in case of dependency cycles,
  // so we want Module.prototype.runModuleSetters to run each time.
  Mp.runModuleSetters = function runModuleSetters(valueToPassThrough) {
    var entry = Entry.get(this.id);
    if (entry) {
      entry.runModuleSetters(this);
    }

    // Assignments to exported local variables get wrapped with calls to
    // module.runModuleSetters, so module.runModuleSetters returns the
    // valueToPassThrough parameter to allow the value of the original
    // expression to pass through. For example,
    //
    //   export var a = 1;
    //   console.log(a += 3);
    //
    // becomes
    //
    //   module.export("a", () => a);
    //   var a = 1;
    //   console.log(module.runModuleSetters(a += 3));
    //
    // This ensures module.runModuleSetters runs immediately after the
    // assignment, and does not interfere with the larger computation.
    return valueToPassThrough;
  };

  function setESModule(module) {
    var exports = module.exports;
    if (exports && typeof exports === "object") {
      exports.__esModule = true;
    }
  }

  Mp.import = function (id, setters) {
    var module = this;
    setESModule(module);

    var absoluteId = module.resolve(id);

    if (setters && typeof setters === "object") {
      var entry = Entry.getOrCreate(absoluteId);
      entry.addSetters(module, setters);
    }

    var countBefore = entry && entry.runCount;
    var exports = typeof module.require === "function"
      ? module.require(absoluteId)
      : require(absoluteId);

    if (entry && entry.runCount === countBefore) {
      // If require(absoluteId) didn't run any setters for this entry,
      // perhaps because it's not the first time this module has been
      // required, run the setters now using an object that passes as the
      // real module object.
      entry.runModuleSetters({
        id: absoluteId,
        exports: exports,
        getExportByName: Mp.getExportByName
      });
    }
  };

  // Register getter functions for local variables in the scope of an
  // export statement. The keys of the getters object are exported names,
  // and the values are functions that return local values.
  Mp.export = function (getters) {
    var module = this;
    setESModule(module);

    if (utils.isPlainObject(getters)) {
      Entry.getOrCreate(module.id).addGetters(getters);
    }

    if (module.loaded) {
      // If the module has already been evaluated, then we need to trigger
      // another round of entry.runModuleSetters calls, which begins by
      // calling entry.runModuleGetters(module).
      module.runModuleSetters();
    }
  };

  // This method can be overridden by client code to implement custom export
  // naming logic. The current implementation works well with Babel's
  // __esModule convention.
  Mp.getExportByName = function (name) {
    var exports = this.exports;

    if (name === "*") {
      return exports;
    }

    if (name === "default" &&
        ! (exports &&
           typeof exports === "object" &&
           exports.__esModule &&
           "default" in exports)) {
      return exports;
    }

    return exports && exports[name];
  };

  return Module;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},"currency-symbol-map":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/currency-symbol-map/package.json                                                                   //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
exports.name = "currency-symbol-map";
exports.version = "3.0.1";
exports.main = "currency-symbol-map.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"currency-symbol-map.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/currency-symbol-map/currency-symbol-map.js                                                         //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var currencySymbolMap = require('./map');

var symbolCurrencyMap = {};
for (var key in currencySymbolMap) {
  if (currencySymbolMap.hasOwnProperty(key)) {
    var currency = key;
    var symbol = currencySymbolMap[currency];
    symbolCurrencyMap[symbol] = currency;
  }
}

function getSymbolFromCurrency(currencyCode) {
  if (currencySymbolMap.hasOwnProperty(currencyCode)) {
    return currencySymbolMap[currencyCode];
  } else {
    return undefined;
  }
}

function getCurrencyFromSymbol(symbol) {
  if (symbolCurrencyMap.hasOwnProperty(symbol)) {
    return symbolCurrencyMap[symbol];
  } else {
    return undefined;
  }
}

function getSymbol(currencyCode) {
  //Deprecated
  var symbol = getSymbolFromCurrency(currencyCode);
  return symbol !== undefined ? symbol : '?';
}

module.exports = getSymbol; //Backward compatibility
module.exports.getSymbolFromCurrency = getSymbolFromCurrency;
module.exports.getCurrencyFromSymbol = getCurrencyFromSymbol;
module.exports.symbolCurrencyMap = symbolCurrencyMap;
module.exports.currencySymbolMap = currencySymbolMap;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"saml2-js":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/saml2-js/package.json                                                                              //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
exports.name = "saml2-js";
exports.version = "1.10.0";
exports.main = "index.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module,__filename,__dirname){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/saml2-js/index.js                                                                                  //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var path = __dirname + '/' + (process.env.TEST_COV_SAML2 ? 'lib-js-cov' : 'lib-js') + '/saml2';
module.exports = require(path);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"body-parser":{"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/body-parser/index.js                                                                               //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
/*!
 * body-parser
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 * @private
 */

var deprecate = require('depd')('body-parser')

/**
 * Cache of loaded parsers.
 * @private
 */

var parsers = Object.create(null)

/**
 * @typedef Parsers
 * @type {function}
 * @property {function} json
 * @property {function} raw
 * @property {function} text
 * @property {function} urlencoded
 */

/**
 * Module exports.
 * @type {Parsers}
 */

exports = module.exports = deprecate.function(bodyParser,
  'bodyParser: use individual json/urlencoded middlewares')

/**
 * JSON parser.
 * @public
 */

Object.defineProperty(exports, 'json', {
  configurable: true,
  enumerable: true,
  get: createParserGetter('json')
})

/**
 * Raw parser.
 * @public
 */

Object.defineProperty(exports, 'raw', {
  configurable: true,
  enumerable: true,
  get: createParserGetter('raw')
})

/**
 * Text parser.
 * @public
 */

Object.defineProperty(exports, 'text', {
  configurable: true,
  enumerable: true,
  get: createParserGetter('text')
})

/**
 * URL-encoded parser.
 * @public
 */

Object.defineProperty(exports, 'urlencoded', {
  configurable: true,
  enumerable: true,
  get: createParserGetter('urlencoded')
})

/**
 * Create a middleware to parse json and urlencoded bodies.
 *
 * @param {object} [options]
 * @return {function}
 * @deprecated
 * @public
 */

function bodyParser (options) {
  var opts = {}

  // exclude type option
  if (options) {
    for (var prop in options) {
      if (prop !== 'type') {
        opts[prop] = options[prop]
      }
    }
  }

  var _urlencoded = exports.urlencoded(opts)
  var _json = exports.json(opts)

  return function bodyParser (req, res, next) {
    _json(req, res, function (err) {
      if (err) return next(err)
      _urlencoded(req, res, next)
    })
  }
}

/**
 * Create a getter for loading a parser.
 * @private
 */

function createParserGetter (name) {
  return function get () {
    return loadParser(name)
  }
}

/**
 * Load a parser module.
 * @private
 */

function loadParser (parserName) {
  var parser = parsers[parserName]

  if (parser !== undefined) {
    return parser
  }

  // this uses a switch for static require analysis
  switch (parserName) {
    case 'json':
      parser = require('./lib/types/json')
      break
    case 'raw':
      parser = require('./lib/types/raw')
      break
    case 'text':
      parser = require('./lib/types/text')
      break
    case 'urlencoded':
      parser = require('./lib/types/urlencoded')
      break
  }

  // store to prevent invoking require()
  return (parsers[parserName] = parser)
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"connect-cookies":{"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/connect-cookies/index.js                                                                           //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //

/**
 * Module dependencies.
 */

var Cookies = require('cookies');
var Keygrip = require('keygrip');

/**
 * Create cookies middleware.
 *
 * @param {Array|Keygrip=} keys
 * @return {Function}
 * @api public
 */

module.exports = function(keys){
  if (Array.isArray(keys)) keys = new Keygrip(keys);
  
  return function(req, res, next){
    req.cookies = res.cookies = Cookies(req, res, keys);
    next();
  };
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"fibers":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/fibers/package.json                                                                                //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
exports.name = "fibers";
exports.version = "1.0.14";
exports.main = "fibers";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"fibers.js":function(require,exports,module,__filename,__dirname){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/fibers/fibers.js                                                                                   //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
if (process.fiberLib) {
	return module.exports = process.fiberLib;
}
var fs = require('fs'), path = require('path');

// Seed random numbers [gh-82]
Math.random();

// Look for binary for this platform
var v8 = 'v8-'+ /[0-9]+\.[0-9]+/.exec(process.versions.v8)[0];
var modPath = path.join(__dirname, 'bin', process.platform+ '-'+ process.arch+ '-'+ v8, 'fibers');
try {
	fs.statSync(modPath+ '.node');
} catch (ex) {
	// No binary!
	throw new Error('`'+ modPath+ '.node` is missing. Try reinstalling `node-fibers`?');
}

// Pull in fibers implementation
process.fiberLib = module.exports = require(modPath).Fiber;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"future.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/fibers/future.js                                                                                   //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
"use strict";
var Fiber = require('./fibers');
var util = require('util');
module.exports = Future;
Function.prototype.future = function(detach) {
	var fn = this;
	var ret = function() {
		var future = new FiberFuture(fn, this, arguments);
		if (detach) {
			future.detach();
		}
		return future;
	};
	ret.toString = function() {
		return '<<Future '+ fn+ '.future()>>';
	};
	return ret;
};

function Future() {}

/**
 * Run a function(s) in a future context, and return a future to their return value. This is useful
 * for instances where you want a closure to be able to `.wait()`. This also lets you wait for
 * mulitple parallel opertions to run.
 */
Future.task = function(fn) {
	if (arguments.length === 1) {
		return fn.future()();
	} else {
		var future = new Future, pending = arguments.length, error, values = new Array(arguments.length);
		for (var ii = 0; ii < arguments.length; ++ii) {
			arguments[ii].future()().resolve(function(ii, err, val) {
				if (err) {
					error = err;
				}
				values[ii] = val;
				if (--pending === 0) {
					if (error) {
						future.throw(error);
					} else {
						future.return(values);
					}
				}
			}.bind(null, ii));
		}
		return future;
	}
};

/**
 * Wrap node-style async functions to instead return futures. This assumes that the last parameter
 * of the function is a callback.
 *
 * If a single function is passed a future-returning function is created. If an object is passed a
 * new object is returned with all functions wrapped.
 *
 * The value that is returned from the invocation of the underlying function is assigned to the
 * property `_` on the future. This is useful for functions like `execFile` which take a callback,
 * but also return meaningful information.
 *
 * `multi` indicates that this callback will return more than 1 argument after `err`. For example,
 * `child_process.exec()`
 *
 * `suffix` will append a string to every method that was overridden, if you pass an object to
 * `Future.wrap()`. Default is 'Future'.
 *
 * var readFileFuture = Future.wrap(require('fs').readFile);
 * var fs = Future.wrap(require('fs'));
 * fs.readFileFuture('example.txt').wait();
 */
Future.wrap = function(fnOrObject, multi, suffix, stop) {
	if (typeof fnOrObject === 'object') {
		var wrapped = Object.create(fnOrObject);
		for (var ii in fnOrObject) {
			if (wrapped[ii] instanceof Function) {
				wrapped[suffix === undefined ? ii+ 'Future' : ii+ suffix] = Future.wrap(wrapped[ii], multi, suffix, stop);
			}
		}
		return wrapped;
	} else if (typeof fnOrObject === 'function') {
		var fn = function() {
			var future = new Future;
			var args = Array.prototype.slice.call(arguments);
			if (multi) {
				var cb = future.resolver();
				args.push(function(err) {
					cb(err, Array.prototype.slice.call(arguments, 1));
				});
			} else {
				args.push(future.resolver());
			}
			future._ = fnOrObject.apply(this, args);
			return future;
		}
		// Modules like `request` return a function that has more functions as properties. Handle this
		// in some kind of reasonable way.
		if (!stop) {
			var proto = Object.create(fnOrObject);
			for (var ii in fnOrObject) {
				if (fnOrObject.hasOwnProperty(ii) && fnOrObject[ii] instanceof Function) {
					proto[ii] = proto[ii];
				}
			}
			fn.__proto__ = Future.wrap(proto, multi, suffix, true);
		}
		return fn;
	}
};

/**
 * Wait on a series of futures and then return. If the futures throw an exception this function
 * /won't/ throw it back. You can get the value of the future by calling get() on it directly. If
 * you want to wait on a single future you're better off calling future.wait() on the instance.
 */
Future.wait = function wait(/* ... */) {

	// Normalize arguments + pull out a FiberFuture for reuse if possible
	var futures = [], singleFiberFuture;
	for (var ii = 0; ii < arguments.length; ++ii) {
		var arg = arguments[ii];
		if (arg instanceof Future) {
			// Ignore already resolved fibers
			if (arg.isResolved()) {
				continue;
			}
			// Look for fiber reuse
			if (!singleFiberFuture && arg instanceof FiberFuture && !arg.started) {
				singleFiberFuture = arg;
				continue;
			}
			futures.push(arg);
		} else if (arg instanceof Array) {
			for (var jj = 0; jj < arg.length; ++jj) {
				var aarg = arg[jj];
				if (aarg instanceof Future) {
					// Ignore already resolved fibers
					if (aarg.isResolved()) {
						continue;
					}
					// Look for fiber reuse
					if (!singleFiberFuture && aarg instanceof FiberFuture && !aarg.started) {
						singleFiberFuture = aarg;
						continue;
					}
					futures.push(aarg);
				} else {
					throw new Error(aarg+ ' is not a future');
				}
			}
		} else {
			throw new Error(arg+ ' is not a future');
		}
	}

	// Resumes current fiber
	var fiber = Fiber.current;
	if (!fiber) {
		throw new Error('Can\'t wait without a fiber');
	}

	// Resolve all futures
	var pending = futures.length + (singleFiberFuture ? 1 : 0);
	function cb() {
		if (!--pending) {
			fiber.run();
		}
	}
	for (var ii = 0; ii < futures.length; ++ii) {
		futures[ii].resolve(cb);
	}

	// Reusing a fiber?
	if (singleFiberFuture) {
		singleFiberFuture.started = true;
		try {
			singleFiberFuture.return(
				singleFiberFuture.fn.apply(singleFiberFuture.context, singleFiberFuture.args));
		} catch(e) {
			singleFiberFuture.throw(e);
		}
		--pending;
	}

	// Yield this fiber
	if (pending) {
		Fiber.yield();
	}
};

/**
 * Return a Future that waits on an ES6 Promise.
 */
Future.fromPromise = function(promise) {
	var future = new Future;
	promise.then(function(val) {
		future.return(val);
	}, function(err) {
		future.throw(err);
	});
	return future;
};

Future.prototype = {
	/**
	 * Return the value of this future. If the future hasn't resolved yet this will throw an error.
	 */
	get: function() {
		if (!this.resolved) {
			throw new Error('Future must resolve before value is ready');
		} else if (this.error) {
			// Link the stack traces up
			var error = this.error;
			var localStack = {};
			Error.captureStackTrace(localStack, Future.prototype.get);
			var futureStack = Object.getOwnPropertyDescriptor(error, 'futureStack');
			if (!futureStack) {
				futureStack = Object.getOwnPropertyDescriptor(error, 'stack');
				if (futureStack) {
					Object.defineProperty(error, 'futureStack', futureStack);
				}
			}
			if (futureStack && futureStack.get) {
				Object.defineProperty(error, 'stack', {
					get: function() {
						var stack = futureStack.get.apply(error);
						if (stack) {
							stack = stack.split('\n');
							return [stack[0]]
								.concat(localStack.stack.split('\n').slice(1))
								.concat('    - - - - -')
								.concat(stack.slice(1))
								.join('\n');
						} else {
							return localStack.stack;
						}
					},
					set: function(stack) {
						Object.defineProperty(error, 'stack', {
							value: stack,
							configurable: true,
							enumerable: false,
							writable: true,
						});
					},
					configurable: true,
					enumerable: false,
				});
			}
			throw error;
		} else {
			return this.value;
		}
	},

	/**
	 * Mark this future as returned. All pending callbacks will be invoked immediately.
	 */
	"return": function(value) {
		if (this.resolved) {
			throw new Error('Future resolved more than once');
		}
		this.value = value;
		this.resolved = true;

		var callbacks = this.callbacks;
		if (callbacks) {
			delete this.callbacks;
			for (var ii = 0; ii < callbacks.length; ++ii) {
				try {
					var ref = callbacks[ii];
					if (ref[1]) {
						ref[1](value);
					} else {
						ref[0](undefined, value);
					}
				} catch(ex) {
					// console.log('Resolve cb threw', String(ex.stack || ex.message || ex));
					process.nextTick(function() {
						throw(ex);
					});
				}
			}
		}
	},

	/**
	 * Throw from this future as returned. All pending callbacks will be invoked immediately.
	 */
	"throw": function(error) {
		if (this.resolved) {
			throw new Error('Future resolved more than once');
		} else if (!error) {
			throw new Error('Must throw non-empty error');
		}
		this.error = error;
		this.resolved = true;

		var callbacks = this.callbacks;
		if (callbacks) {
			delete this.callbacks;
			for (var ii = 0; ii < callbacks.length; ++ii) {
				try {
					var ref = callbacks[ii];
					if (ref[1]) {
						ref[0].throw(error);
					} else {
						ref[0](error);
					}
				} catch(ex) {
					// console.log('Resolve cb threw', String(ex.stack || ex.message || ex));
					process.nextTick(function() {
						throw(ex);
					});
				}
			}
		}
	},

	/**
	 * "detach" this future. Basically this is useful if you want to run a task in a future, you
	 * aren't interested in its return value, but if it throws you don't want the exception to be
	 * lost. If this fiber throws, an exception will be thrown to the event loop and node will
	 * probably fall down.
	 */
	detach: function() {
		this.resolve(function(err) {
			if (err) {
				throw err;
			}
		});
	},

	/**
	 * Returns whether or not this future has resolved yet.
	 */
	isResolved: function() {
		return this.resolved === true;
	},

	/**
	 * Returns a node-style function which will mark this future as resolved when called.
	 */
	resolver: function() {
		return function(err, val) {
			if (err) {
				this.throw(err);
			} else {
				this.return(val);
			}
		}.bind(this);
	},

	/**
	 * Waits for this future to resolve and then invokes a callback.
	 *
	 * If two arguments are passed, the first argument is a future which will be thrown to in the case
	 * of error, and the second is a function(val){} callback.
	 *
	 * If only one argument is passed it is a standard function(err, val){} callback.
	 */
	resolve: function(arg1, arg2) {
		if (this.resolved) {
			if (arg2) {
				if (this.error) {
					arg1.throw(this.error);
				} else {
					arg2(this.value);
				}
			} else {
				arg1(this.error, this.value);
			}
		} else {
			(this.callbacks = this.callbacks || []).push([arg1, arg2]);
		}
		return this;
	},

	/**
	 * Resolve only in the case of success
	 */
	resolveSuccess: function(cb) {
		this.resolve(function(err, val) {
			if (err) {
				return;
			}
			cb(val);
		});
		return this;
	},

	/**
	 * Propogate results to another future.
	 */
	proxy: function(future) {
		this.resolve(function(err, val) {
			if (err) {
				future.throw(err);
			} else {
				future.return(val);
			}
		});
	},

	/**
	 * Propogate only errors to an another future or array of futures.
	 */
	proxyErrors: function(futures) {
		this.resolve(function(err) {
			if (!err) {
				return;
			}
			if (futures instanceof Array) {
				for (var ii = 0; ii < futures.length; ++ii) {
					futures[ii].throw(err);
				}
			} else {
				futures.throw(err);
			}
		});
		return this;
	},

	/**
	 * Returns an ES6 Promise
	 */
	promise: function() {
		var that = this;
		return new Promise(function(resolve, reject) {
			that.resolve(function(err, val) {
				if (err) {
					reject(err);
				} else {
					resolve(val);
				}
			});
		});
	},

	/**
	 * Differs from its functional counterpart in that it actually resolves the future. Thus if the
	 * future threw, future.wait() will throw.
	 */
	wait: function() {
		if (this.isResolved()) {
			return this.get();
		}
		Future.wait(this);
		return this.get();
	},
};

/**
 * A function call which loads inside a fiber automatically and returns a future.
 */
function FiberFuture(fn, context, args) {
	this.fn = fn;
	this.context = context;
	this.args = args;
	this.started = false;
	var that = this;
	process.nextTick(function() {
		if (!that.started) {
			that.started = true;
			Fiber(function() {
				try {
					that.return(fn.apply(context, args));
				} catch(e) {
					that.throw(e);
				}
			}).run();
		}
	});
}
util.inherits(FiberFuture, Future);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"babel-runtime":{"regenerator":{"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/babel-runtime/regenerator/index.js                                                                 //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
module.exports = require("regenerator-runtime");

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"helpers":{"typeof.js":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/babel-runtime/helpers/typeof.js                                                                    //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
"use strict";

exports.__esModule = true;

var _iterator = require("../core-js/symbol/iterator");

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = require("../core-js/symbol");

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"classCallCheck.js":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/babel-runtime/helpers/classCallCheck.js                                                            //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
"use strict";

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"possibleConstructorReturn.js":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/babel-runtime/helpers/possibleConstructorReturn.js                                                 //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
"use strict";

exports.__esModule = true;

var _typeof2 = require("../helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"inherits.js":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/babel-runtime/helpers/inherits.js                                                                  //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
"use strict";

exports.__esModule = true;

var _setPrototypeOf = require("../core-js/object/set-prototype-of");

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = require("../core-js/object/create");

var _create2 = _interopRequireDefault(_create);

var _typeof2 = require("../helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
  }

  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"giphy-api":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/giphy-api/package.json                                                                             //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
exports.name = "giphy-api";
exports.version = "1.2.3";
exports.main = "index.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/giphy-api/index.js                                                                                 //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var queryString = require('querystring');
var httpService = require('./util/http');

/**
* Hostname of the Giphy API
*/
var API_HOSTNAME = 'api.giphy.com';
/**
* Base PATH of the Giphy API
*/
var API_BASE_PATH = '/v1/';
/**
* Public API key provided by Giphy for anyone to use. This is used as a fallback
* if no API key is provided
*/
var PUBLIC_BETA_API_KEY = 'dc6zaTOxFJmzC';
/**
* True if promises exist in this engine. Otherwise false.
*/
var promisesExist = typeof Promise !== 'undefined';

/**
* Error handler that supports promises and callbacks
* @param err {String} - Error message
* @param callback
*/
function _handleErr(err, callback) {
  if (callback) {
    return callback(err);
  } else if (promisesExist) {
    return Promise.reject(err);
  } else {
    throw new Error(err);
  }
}

/**
* @param options {String|Object} - Options object. If this is a string, it is considered the api key
*   options.https {Boolean} - Whether to utilize HTTPS library for requests or HTTP. Defaults to HTTP.
*   options.timeout {Number} - Request timeout before returning an error. Defaults to 30000 milliseconds
*   options.apiKey {String} - Giphy API key. Defaults to the public beta API key
*/
var GiphyAPI = function(options) {
  if (typeof options === 'string' ||
    typeof options === 'undefined' ||
    options === null) {
    this.apiKey = options || PUBLIC_BETA_API_KEY;
    options = {};
  } else if (typeof options === 'object') {
    this.apiKey = options.apiKey || PUBLIC_BETA_API_KEY;
  } else {
    throw new Error('Invalid options passed to giphy-api');
  }

  this.https = options.https;
  this.timeout = options.timeout || 30000;
};

GiphyAPI.prototype = {
  /**
  * Search all Giphy gifs by word or phrase
  *
  * @param options Giphy API search options
  *   options.q {String} - search query term or phrase
  *   options.limit {Number} - (optional) number of results to return, maximum 100. Default 25.
  *   options.offset {Number} - (optional) results offset, defaults to 0.
  *   options.rating {String}- limit results to those rated (y,g, pg, pg-13 or r).
  *   options.fmt {String} - (optional) return results in html or json format (useful for viewing responses as GIFs to debug/test)
  * @param callback
  */
  search: function(options, callback) {
    if (!options) {
      return _handleErr('Search phrase cannot be empty.', callback);
    }

    return this._request({
      api: options.api || 'gifs',
      endpoint: 'search',
      query: typeof(options) === 'string' ? {
        q: options
      } : options
    }, callback);
  },

  /**
  * Search all Giphy gifs for a single Id or an array of Id's
  *
  * @param id {String} - Single Giphy gif string Id or array of string Id's
  * @param callback
  */
  id: function(id, callback) {
    var idIsArr = Array.isArray(id);

    if (!id || (idIsArr && id.length === 0)) {
      return _handleErr('Id required for id API call', callback);
    }

    // If an array of Id's was passed, generate a comma delimited string for
    // the query string.
    if (idIsArr) {
      id = id.join();
    }

    return this._request({
      api: 'gifs',
      query: {
        ids: id
      }
    }, callback);
  },

  /**
  * Search for Giphy gifs by phrase with Gify vocabulary
  *
  * @param options Giphy API translate options
  *   options.s {String} - term or phrase to translate into a GIF
  *   options.rating {String} - limit results to those rated (y,g, pg, pg-13 or r).
  *   options.fmt {String} - (optional) return results in html or json format (useful for viewing responses as GIFs to debug/test)
  */
  translate: function(options, callback) {
    if (!options) {
      return _handleErr('Translate phrase cannot be empty.', callback);
    }

    return this._request({
      api: options.api || 'gifs',
      endpoint: 'translate',
      query: typeof(options) === 'string' ? {
        s: options
      } : options
    }, callback);
  },

  /**
  * Fetch random gif filtered by tag
  *
  * @param options Giphy API random options
  *   options.tag {String} - the GIF tag to limit randomness by
  *   options.rating {String} - limit results to those rated (y,g, pg, pg-13 or r).
  *   options.fmt {Stirng} - (optional) return results in html or json format (useful for viewing responses as GIFs to debug/test)
  */
  random: function(options, callback) {
    var reqOptions = {
      api: (options ? options.api : null) || 'gifs',
      endpoint: 'random'
    };

    if (typeof(options) === 'string') {
      reqOptions.query = {
        tag: options
      };
    } else if (typeof(options) === 'object') {
      reqOptions.query = options;
    } else if (typeof(options) === 'function') {
      callback = options;
    }

    return this._request(reqOptions, callback);
  },

  /**
  * Fetch trending gifs
  *
  * @param options Giphy API random options
  *   options.limit {Number} - (optional) limits the number of results returned. By default returns 25 results.
  *   options.rating {String} - limit results to those rated (y,g, pg, pg-13 or r).
  *   options.fmt {String} - (optional) return results in html or json format (useful for viewing responses as GIFs to debug/test)
  */
  trending: function(options, callback) {
    var reqOptions = {
      endpoint: 'trending'
    };

    reqOptions.api = (options ? options.api : null) || 'gifs';

    //Cleanup so we don't add this to our query
    if (options) {
      delete options.api;
    }

    if (typeof options === 'object' &&
      Object.keys(options).length !== 0) {
      reqOptions.query = options;
    } else if (typeof options === 'function') {
      callback = options;
    }

    return this._request(reqOptions, callback);
  },

  /**
  * Prepares the HTTP request and query string for the Giphy API
  *
  * @param options
  *   options.endpoint {String} - The API endpoint e.g. search
  *   options.query {String|Object} Query string parameters. If these are left
  *       out then we default to an empty string. If this is passed as a string,
  *       we default to the 'q' query string field used by Giphy.
  */
  _request: function(options, callback) {
    if (!callback && !promisesExist) {
      throw new Error('Callback must be provided if promises are unavailable');
    }

    var endpoint = '';
    if (options.endpoint) {
      endpoint = '/' + options.endpoint;
    }

    endpoint += '?';

    var query;
    var self = this;

    if (typeof options.query !== 'undefined' && typeof options.query === 'object') {
      if (Object.keys(options.query).length === 0) {
        if (callback) {
          return callback('Options object should not be empty');
        }
        return Promise.reject('Options object should not be empty');
      }

      options.query.api_key = this.apiKey;
      query = queryString.stringify(options.query);
    } else {
      query = queryString.stringify({
        api_key: self.apiKey
      });
    }

    var httpOptions = {
      request: {
        host: API_HOSTNAME,
        path: API_BASE_PATH + options.api + endpoint + query
      },
      https: this.https,
      timeout: this.timeout,
      fmt: options.query && options.query.fmt
    };

    var makeRequest = function(resolve, reject) {
      httpService.get(httpOptions, resolve, reject);
    };

    if (callback) {
      var resolve = function(res) {
        callback(null, res);
      };
      var reject = function(err) {
        callback(err);
      };
      makeRequest(resolve, reject);
    } else {
      if (!promisesExist) {
        throw new Error('Callback must be provided unless Promises are available');
      }
      return new Promise(function(resolve, reject) {
        makeRequest(resolve, reject);
      });
    }
  }
};

module.exports = function(apiKey, options) {
  return new GiphyAPI(apiKey, options);
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"stripe":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/stripe/package.json                                                                                //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
exports.name = "stripe";
exports.version = "4.9.1";
exports.main = "lib/stripe.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"stripe.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/stripe/lib/stripe.js                                                                               //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
'use strict';

Stripe.DEFAULT_HOST = 'api.stripe.com';
Stripe.DEFAULT_PORT = '443';
Stripe.DEFAULT_BASE_PATH = '/v1/';
Stripe.DEFAULT_API_VERSION = null;

// Use node's default timeout:
Stripe.DEFAULT_TIMEOUT = require('http').createServer().timeout;

Stripe.PACKAGE_VERSION = require('../package.json').version;

Stripe.USER_AGENT = {
  bindings_version: Stripe.PACKAGE_VERSION,
  lang: 'node',
  lang_version: process.version,
  platform: process.platform,
  publisher: 'stripe',
  uname: null,
};

Stripe.USER_AGENT_SERIALIZED = null;

var exec = require('child_process').exec;

var resources = {
  // Support Accounts for consistency, Account for backwards compat
  Account: require('./resources/Accounts'),
  Accounts: require('./resources/Accounts'),
  Balance: require('./resources/Balance'),
  Charges: require('./resources/Charges'),
  CountrySpecs: require('./resources/CountrySpecs'),
  Coupons: require('./resources/Coupons'),
  Customers: require('./resources/Customers'),
  Disputes: require('./resources/Disputes'),
  Events: require('./resources/Events'),
  Invoices: require('./resources/Invoices'),
  InvoiceItems: require('./resources/InvoiceItems'),
  Plans: require('./resources/Plans'),
  RecipientCards: require('./resources/RecipientCards'),
  Recipients: require('./resources/Recipients'),
  Refunds: require('./resources/Refunds'),
  Tokens: require('./resources/Tokens'),
  Transfers: require('./resources/Transfers'),
  ApplicationFees: require('./resources/ApplicationFees'),
  FileUploads: require('./resources/FileUploads'),
  BitcoinReceivers: require('./resources/BitcoinReceivers'),
  Products: require('./resources/Products'),
  Skus: require('./resources/SKUs'),
  Orders: require('./resources/Orders'),
  OrderReturns: require('./resources/OrderReturns'),
  Subscriptions: require('./resources/Subscriptions'),
  ThreeDSecure: require('./resources/ThreeDSecure'),
  Sources: require('./resources/Sources'),

  // The following rely on pre-filled IDs:
  CustomerCards: require('./resources/CustomerCards'),
  CustomerSubscriptions: require('./resources/CustomerSubscriptions'),
  ChargeRefunds: require('./resources/ChargeRefunds'),
  ApplicationFeeRefunds: require('./resources/ApplicationFeeRefunds'),
  TransferReversals: require('./resources/TransferReversals'),

};

Stripe.StripeResource = require('./StripeResource');
Stripe.resources = resources;

function Stripe(key, version) {
  if (!(this instanceof Stripe)) {
    return new Stripe(key, version);
  }

  this._api = {
    auth: null,
    host: Stripe.DEFAULT_HOST,
    port: Stripe.DEFAULT_PORT,
    basePath: Stripe.DEFAULT_BASE_PATH,
    version: Stripe.DEFAULT_API_VERSION,
    timeout: Stripe.DEFAULT_TIMEOUT,
    agent: null,
    dev: false,
  };

  this._prepResources();
  this.setApiKey(key);
  this.setApiVersion(version);
}

Stripe.prototype = {

  setHost: function(host, port, protocol) {
    this._setApiField('host', host);
    if (port) {
      this.setPort(port);
    }
    if (protocol) {
      this.setProtocol(protocol);
    }
  },

  setProtocol: function(protocol) {
    this._setApiField('protocol', protocol.toLowerCase());
  },

  setPort: function(port) {
    this._setApiField('port', port);
  },

  setApiVersion: function(version) {
    if (version) {
      this._setApiField('version', version);
    }
  },

  setApiKey: function(key) {
    if (key) {
      this._setApiField(
        'auth',
        'Basic ' + new Buffer(key + ':').toString('base64')
      );
    }
  },

  setTimeout: function(timeout) {
    this._setApiField(
      'timeout',
      timeout == null ? Stripe.DEFAULT_TIMEOUT : timeout
    );
  },

  setHttpAgent: function(agent) {
    this._setApiField('agent', agent);
  },

  _setApiField: function(key, value) {
    this._api[key] = value;
  },

  getApiField: function(key) {
    return this._api[key];
  },

  getConstant: function(c) {
    return Stripe[c];
  },

  // Gets a JSON version of a User-Agent and uses a cached version for a slight
  // speed advantage.
  getClientUserAgent: function(cb) {
    if (Stripe.USER_AGENT_SERIALIZED) {
      return cb(Stripe.USER_AGENT_SERIALIZED);
    }
    this.getClientUserAgentSeeded(Stripe.USER_AGENT, function(cua) {
      Stripe.USER_AGENT_SERIALIZED = cua;
      cb(Stripe.USER_AGENT_SERIALIZED);
    })
  },

  // Gets a JSON version of a User-Agent by encoding a seeded object and
  // fetching a uname from the system.
  getClientUserAgentSeeded: function(seed, cb) {
    exec('uname -a', function(err, uname) {
      var userAgent = {};
      for (var field in seed) {
        userAgent[field] = encodeURIComponent(seed[field]);
      }

      // URI-encode in case there are unusual characters in the system's uname.
      userAgent.uname = encodeURIComponent(uname) || 'UNKNOWN';

      cb(JSON.stringify(userAgent));
    });
  },

  _prepResources: function() {
    for (var name in resources) {
      this[
        name[0].toLowerCase() + name.substring(1)
      ] = new resources[name](this);
    }
  },

};

module.exports = Stripe;
// expose constructor as a named property to enable mocking with Sinon.JS
module.exports.Stripe = Stripe;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"watson-developer-cloud":{"conversation":{"v1.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/watson-developer-cloud/conversation/v1.js                                                          //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const requestFactory = require('../lib/requestwrapper');
const pick = require('object.pick');
const util = require('util');
const BaseService = require('../lib/base_service');

/**
 *
 * @param options
 * @param options.version_date
 * @constructor
 */
function ConversationV1(options) {
  BaseService.call(this, options);

  // Check if 'version_date' was provided
  if (typeof this._options.version_date === 'undefined') {
    throw new Error('Argument error: version_date was not specified, use ConversationV1.VERSION_DATE_2017_02_03');
  }
  this._options.qs.version = options.version_date;
}
util.inherits(ConversationV1, BaseService);
ConversationV1.prototype.name = 'conversation';
ConversationV1.prototype.version = 'v1';
ConversationV1.URL = 'https://gateway.watsonplatform.net/conversation/api';

/**
 * Initial release
 * @type {string}
 */
ConversationV1.VERSION_DATE_2016_07_11 = '2016-07-11';

/**
 * 9/20 update made changes to response format
 *
 * * context.system.dialog_stack changed from an array of strings to an array of objects
 *
 * Old:
```json
 "context": {
    "system": {
      "dialog_stack": [
        "root"
      ],
```
 * New:
```json
 "context": {
    "system": {
      "dialog_stack": [
        {
          "dialog_node": "root"
        }
      ],
```
 *
 * @see http://www.ibm.com/watson/developercloud/doc/conversation/release-notes.html#20-september-2016
 * @type {string}
 */
ConversationV1.VERSION_DATE_2016_09_20 = '2016-09-20';

/**
 * 02/03 Update
 *
 * * Absolute scoring has now been enabled.
 * @see https://www.ibm.com/watson/developercloud/doc/conversation/irrelevant_utterance.html
 *
 * Old:
 ```json
 "intents": [
   { "intent" : "turn_off", "confidence" : 0.54 },
   { "intent" : "locate_amenity", "confidence" : 0.4},
   { "intent" : "weather", "confidence" : 0.06}
 ]
```
 * Previously all intent confidence values summed to 1.0.
 * New:
```json
 "intents": [
   { "intent" : "turn_off", "confidence" : 0.54 },
   { "intent" : "locate_amenity", "confidence" : 0.52},
   { "intent" : "weather", "confidence" : 0.01}
 ]
```
 * Now each intent is scored individually with a maximum confidence value of 1.
 *
 * * Irrelevant input detection.
 * Previously an intent was always returned regardless of whether the system considered it irrelevant to the
 * training data within the workspace. With Irrelevant input detection the system will now return an empty intent
 * array if the system thinks the input is irrelevant to the workspace content.
 * Old:
 ```json
 "input" : { "text" : "what color is the sky?"},
 "intents": [
 { "intent" : "weather", "confidence" : 0.36 },
 { "intent" : "turn_off", "confidence" : 0.33},
 { "intent" : "locate_amenity", "confidence" : 0.31}
 ]
 ```
 * New:
 ```json
 "input" : { "text" : "what color is the sky?"},
 "intents": []
 ```
 *
 * @see https://www.ibm.com/watson/developercloud/doc/conversation/release-notes.html#3-february-2017
 * @type {string}
 */
ConversationV1.VERSION_DATE_2017_02_03 = '2017-02-03';

/**
 * Method: message
 *
 * Returns a response to a user utterance.
 *
 * Example response for 2017-02-03 version_date:
```json
 {
   "intents": [
     {
       "intent": "turn_on",
       "confidence": 0.999103316650195
     }
   ],
   "entities": [
     {
       "entity": "appliance",
       "location": [
         12,
         18
       ],
       "value": "light"
     }
   ],
   "input": {
     "text": "Turn on the lights"
   },
   "output": {
     "log_messages": [],
     "text": [
       "Hi. It looks like a nice drive today. What would you like me to do?"
     ],
     "nodes_visited": [
       "node_1_1467221909631"
     ]
   },
   "context": {
     "conversation_id": "820334ac-ee79-45b5-aa03-7958dcd0fd34",
     "system": {
       "dialog_stack": [
         {
           "dialog_node": "root"
         }
       ],
       "dialog_turn_counter": 1,
       "dialog_request_counter": 1
     }
   }
 }
```
 *
 *
 *
 * @param  {Object}   params   { workspace_id: '',  }
 * @param params.workspace_id
 * @param [params.input]
 * @param [params.context]
 * @param [params.alternate_intents=false] - includes other lower-confidence intents in the intents array.
 * @param [params.output]
 * @param [params.entities]
 * @param [params.intents]
 *
 */
ConversationV1.prototype.message = function(params, callback) {
  params = params || {};

  const parameters = {
    options: {
      url: '/v1/workspaces/{workspace_id}/message',
      method: 'POST',
      json: true,
      body: pick(params, ['input', 'context', 'alternate_intents', 'output', 'entities', 'intents']),
      path: pick(params, ['workspace_id'])
    },
    requiredParams: ['workspace_id'],
    defaultOptions: this._options
  };
  return requestFactory(parameters, callback);
};

/**
 * Method: listWorkspaces
 *
 * Returns the list of workspaces in Watson Conversation Service instance
 *
 * Example Response:
```json
 {
   "workspaces": [
     {
       "name": "Pizza app",
       "created": "2015-12-06T23:53:59.153Z",
       "language": "en",
       "metadata": {},
       "updated": "2015-12-06T23:53:59.153Z",
       "description": "Pizza app",
       "workspace_id": "pizza_app-e0f3"
     }
   ]
 }
```
 *
 * @param {Object} [params]
 * @param {Function} [callback]
 */
ConversationV1.prototype.listWorkspaces = function(params, callback) {
  if (typeof params === 'function' && !callback) {
    callback = params;
    params = null;
  }
  const parameters = {
    options: {
      url: '/v1/workspaces',
      method: 'GET'
    },
    defaultOptions: this._options
  };
  return requestFactory(parameters, callback);
};

/**
 * Method: createWorkspace
 *
 * Creates a new workspace
 *
 * Model Schema
```json
 {
  "name": "string",
  "description": "string",
  "language": "string",
  "metadata": {},
  "counterexamples": [
    {
      "text": "string"
    }
  ],
  "dialog_nodes": [
    {
      "dialog_node": "string",
      "description": "string",
      "conditions": "string",
      "parent": "string",
      "previous_sibling": "string",
      "output": {
        "text": "string"
      },
      "context": {},
      "metadata": {},
      "go_to": {
        "dialog_node": "string",
        "selector": "string",
        "return": true
      }
    }
  ],
  "entities": [
    {
      "entity": "string",
      "description": {
        "long": [
          "string"
        ],
        "short": [
          "string"
        ],
        "examples": [
          "string"
        ]
      },
      "type": "string",
      "source": "string",
      "open_list": false,
      "values": [
        {
          "value": "string",
          "metadata": {},
          "synonyms": [
            "string"
          ]
        }
      ]
    }
  ],
  "intents": [
    {
      "intent": "string",
      "description": "string",
      "examples": [
        {
          "text": "string"
        }
      ]
    }
  ]
 }
```
 *
 * Example Response
```json
 {
  "name": "Pizza app",
  "created": "2015-12-06T23:53:59.153Z",
  "language": "en",
  "metadata": {},
  "updated": "2015-12-06T23:53:59.153Z",
  "description": "Pizza app",
  "workspace_id": "pizza_app-e0f3"
 }
```
 *
 * @param  {Object}  params
 * @param {String} [params.name]
 * @param {String} [params.description]
 * @param {String} [params.language]
 * @param {Object} [params.metadata]
 * @param {Array<Object>} [params.entities]
 * @param {Array<Object>} [params.intents]
 * @param {Array<Object>} [params.dialog_nodes]
 * @param {Array<Object>} [params.counterexamples]
 * @param {Function} [callback]
 *
 */

ConversationV1.prototype.createWorkspace = function(params, callback) {
  params = params || {};

  const parameters = {
    options: {
      url: '/v1/workspaces',
      method: 'POST',
      json: true,
      body: pick(params, ['name', 'language', 'entities', 'intents', 'dialog_nodes', 'metadata', 'description', 'counterexamples'])
    },
    defaultOptions: this._options
  };
  return requestFactory(parameters, callback);
};

/**
 * Method: getWorkspace
 *
 * Returns information about a specified workspace or return the whole workspace
 *
 * Example Response (with default export value):
```json
 {
  "name": "Pizza app",
  "created": "2015-12-06T23:53:59.153Z",
  "language": "en",
  "metadata": {},
  "updated": "2015-12-06T23:53:59.153Z",
  "description": "Pizza app",
  "workspace_id": "pizza_app-e0f3"
 }
```
 *
 * @param  {Object}   params   { workspace_id: '',  }
 * @param params.workspace_id
 * @param [params.export=false] - if true, the full contents of all of the sub-resources are returned
 * @param {Function} [callback]
 */

ConversationV1.prototype.getWorkspace = function(params, callback) {
  params = params || {};

  const parameters = {
    options: {
      url: '/v1/workspaces/{workspace_id}',
      method: 'GET',
      json: true,
      qs: pick(params, ['export']),
      path: pick(params, ['workspace_id'])
    },
    requiredParams: ['workspace_id'],
    defaultOptions: this._options
  };
  return requestFactory(parameters, callback);
};

/**
 * Method: deleteWorkspace
 *
 * Deletes the specified workspace
 *
 *
 * @param  {Object}   params   { workspace_id: '' }
 * @param params.workspace_id
 * @param {Function} [callback]
 */

ConversationV1.prototype.deleteWorkspace = function(params, callback) {
  params = params || {};

  const parameters = {
    options: {
      url: '/v1/workspaces/{workspace_id}',
      method: 'DELETE',
      json: true,
      path: pick(params, ['workspace_id'])
    },
    requiredParams: ['workspace_id'],
    defaultOptions: this._options
  };
  return requestFactory(parameters, callback);
};

/**
 * Method: updateWorkspace
 *
 * Updates a workspace
 *
 * Example value
```json
 {
  "name": "Pizza app",
  "created": "2015-12-06T23:53:59.153Z",
  "language": "en",
  "metadata": {},
  "description": "Pizza app",
  "workspace_id": "pizza_app-e0f3",
  "counterexamples": [
    {
      "text": "string"
    }
  ],
  "dialog_nodes": [
    {
      "dialog_node": "string",
      "description": "string",
      "conditions": "string",
      "parent": "string",
      "previous_sibling": "string",
      "output": {
        "text": "string"
      },
      "context": {},
      "metadata": {},
      "go_to": {
        "dialog_node": "string",
        "selector": "string",
        "return": true
      }
    }
  ],
  "entities": [
    {
      "entity": "string",
      "description": {
        "long": [
          "string"
        ],
        "short": [
          "string"
        ],
        "examples": [
          "string"
        ]
      },
      "type": "string",
      "source": "string",
      "open_list": false,
      "values": [
        {
          "value": "string",
          "metadata": {},
          "synonyms": [
            "string"
          ]
        }
      ]
    }
  ],
  "intents": [
    {
      "intent": "string",
      "description": "string",
      "examples": [
        {
          "text": "string"
        }
      ]
    }
  ]
 }
```
 *
 * Example Response:
```json
 {
  "name": "Pizza app",
  "created": "2015-12-06T23:53:59.153Z",
  "language": "en",
  "metadata": {},
  "updated": "2015-12-06T23:53:59.153Z",
  "description": "Pizza app",
  "workspace_id": "pizza_app-e0f3"
 }
```
 *
 * @param  {Object}   params   { workspace_id: '',  }
 * @param {String} params.workspace_id
 * @param {String} [params.name]
 * @param {String} [params.description]
 * @param {String} [params.language]
 * @param {Object} [params.metadata]
 * @param {Array<Object>} [params.entities]
 * @param {Array<Object>} [params.intents]
 * @param {Array<Object>} [params.dialog_nodes]
 * @param {Array<Object>} [params.counterexamples]
 * @param {Function} [callback]
 *
 */

ConversationV1.prototype.updateWorkspace = function(params, callback) {
  params = params || {};

  const parameters = {
    options: {
      url: '/v1/workspaces/{workspace_id}',
      method: 'POST',
      json: true,
      body: pick(params, ['name', 'language', 'entities', 'intents', 'dialog_nodes', 'metadata', 'description', 'counterexamples']),
      path: pick(params, ['workspace_id'])
    },
    requiredParams: ['workspace_id'],
    defaultOptions: this._options
  };
  return requestFactory(parameters, callback);
};

/**
 * Method: workspaceStatus
 *
 * Returns the training status of the specified workspace
 *
 * Example Response:
```json
 {
  "workspace_id": "pizza_app-e0f3",
  "training": "true"
 }
```
 *
 * @param  {Object}   params   { workspace_id: '',  }
 * @param params.workspace_id
 * @param {Function} [callback]
 *
 */

ConversationV1.prototype.workspaceStatus = function(params, callback) {
  params = params || {};

  const parameters = {
    options: {
      url: '/v1/workspaces/{workspace_id}/status',
      method: 'GET',
      json: true,
      path: pick(params, ['workspace_id'])
    },
    requiredParams: ['workspace_id'],
    defaultOptions: this._options
  };
  return requestFactory(parameters, callback);
};

module.exports = ConversationV1;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"personality-insights":{"v3.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/watson-developer-cloud/personality-insights/v3.js                                                  //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const requestFactory = require('../lib/requestwrapper');
const pick = require('object.pick');
const extend = require('extend');
const helper = require('../lib/helper');
const util = require('util');
const BaseService = require('../lib/base_service');

/**
 *
 * @param options
 * @constructor
 */
function PersonalityInsightsV3(options) {
  BaseService.call(this, options);

  // Check if 'version_date' was provided
  if (typeof this._options.version_date === 'undefined') {
    throw new Error('Argument error: version_date was not specified, use 2016-10-19');
  }
  this._options.qs.version = options.version_date;
}
util.inherits(PersonalityInsightsV3, BaseService);
PersonalityInsightsV3.prototype.name = 'personality_insights';
PersonalityInsightsV3.prototype.version = 'v3';
PersonalityInsightsV3.URL = 'https://gateway.watsonplatform.net/personality-insights/api';

/**
 * @param {Object} params The parameters to call the service
 * @param {Object} [params.headers] - The header parameters.
 * @param {string} [params.headers.accept-language=en] - The desired language of the response.
 * @param {string} [params.headers.content-type=text/plain] - The content type of the request: text/plain (the default), text/html, or application/json.
 * @param {string} [params.headers.content-language=en] - The language of the input text for the request: ar (Arabic), en (English), es (Spanish), or ja (Japanese)
 * @param {string} [params.headers.accept=application/json] - The desired content type of the response: application/json (the default) or text/csv
 * @param {string} [params.text] - The text to analyze.
 * @param {Object} [params.content_items] - A JSON input (if 'text' not provided).
 * @param {boolean} [params.raw_scores=false] - include raw results.
 * @param {boolean} [params.csv_headers=false] - If true, column labels are returned with a CSV response; if false (the default), they are not. Applies only when the Accept header is set to text/csv.
 * @param {boolean} [params.consumption_preferences=false] - If true, information about consumption preferences is returned with the results.
 *
 * @param callback The callback.
 */
PersonalityInsightsV3.prototype.profile = function(
  _params,
  callback // eslint-disable-line complexity
) {
  const params = extend({}, _params);

  if (params.content_items) {
    params.contentItems = params.content_items;
  }

  if (!params.text && !params.contentItems) {
    callback(new Error('Missing required parameters: text or content_items'));
    return;
  }

  // Content-Type
  let content_type = null;
  if (params.text) {
    content_type = helper.isHTML(params.text) ? 'text/html' : 'text/plain';
  } else {
    content_type = 'application/json';
  }

  const parameters = {
    options: {
      method: 'POST',
      url: '/v3/profile',
      body: params.text || pick(params, ['contentItems']),
      json: true,
      qs: pick(params, ['csv_headers', 'raw_scores', 'consumption_preferences']),
      headers: extend({ 'content-type': content_type, 'accept-language': 'en' }, params.headers)
    },
    defaultOptions: this._options
  };

  return requestFactory(parameters, callback);
};
module.exports = PersonalityInsightsV3;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"html-truncate":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/html-truncate/package.json                                                                         //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
exports.name = "html-truncate";
exports.version = "1.2.1";
exports.main = "lib/truncate.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"truncate.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/html-truncate/lib/truncate.js                                                                      //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
/**
 * Truncate HTML string and keep tag safe.
 *
 * @method truncate
 * @param {String} string string needs to be truncated
 * @param {Number} maxLength length of truncated string
 * @param {Object} options (optional)
 * @param {Boolean} [options.keepImageTag] flag to specify if keep image tag, false by default
 * @param {Boolean} [options.truncateLastWord] truncates last word, true by default
 * @param {Number} [options.slop] tolerance when options.truncateLastWord is false before we give up and just truncate at the maxLength position, 10 by default (but not greater than maxLength)
 * @param {Boolean|String} [options.ellipsis] omission symbol for truncated string, '...' by default
 * @return {String} truncated string
 */
function truncate(string, maxLength, options) {
    var EMPTY_OBJECT = {},
        EMPTY_STRING = '',
        DEFAULT_TRUNCATE_SYMBOL = '...',
        DEFAULT_SLOP = 10 > maxLength ? maxLength : 10,
        EXCLUDE_TAGS = ['img'],         // non-closed tags
        items = [],                     // stack for saving tags
        total = 0,                      // record how many characters we traced so far
        content = EMPTY_STRING,         // truncated text storage
        KEY_VALUE_REGEX = '([\\w|-]+\\s*=\\s*"[^"]*"\\s*)*',
        IS_CLOSE_REGEX = '\\s*\\/?\\s*',
        CLOSE_REGEX = '\\s*\\/\\s*',
        SELF_CLOSE_REGEX = new RegExp('<\\/?\\w+\\s*' + KEY_VALUE_REGEX + CLOSE_REGEX + '>'),
        HTML_TAG_REGEX = new RegExp('<\\/?\\w+\\s*' + KEY_VALUE_REGEX + IS_CLOSE_REGEX + '>'),
        URL_REGEX = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w\-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g, // Simple regexp
        IMAGE_TAG_REGEX = new RegExp('<img\\s*' + KEY_VALUE_REGEX + IS_CLOSE_REGEX + '>'),
        WORD_BREAK_REGEX = new RegExp('\\W+', 'g'),
        matches = true,
        result,
        index,
        tail,
        tag,
        selfClose;

    /**
     * Remove image tag
     *
     * @private
     * @method _removeImageTag
     * @param {String} string not-yet-processed string
     * @return {String} string without image tags
     */
    function _removeImageTag(string) {
        var match = IMAGE_TAG_REGEX.exec(string),
            index,
            len;

        if (!match) {
            return string;
        }

        index = match.index;
        len = match[0].length;

        return string.substring(0, index) + string.substring(index + len);
    }

    /**
     * Dump all close tags and append to truncated content while reaching upperbound
     *
     * @private
     * @method _dumpCloseTag
     * @param {String[]} tags a list of tags which should be closed
     * @return {String} well-formatted html
     */
    function _dumpCloseTag(tags) {
        var html = '';

        tags.reverse().forEach(function (tag, index) {
            // dump non-excluded tags only
            if (-1 === EXCLUDE_TAGS.indexOf(tag)) {
                html += '</' + tag + '>';
            }
        });

        return html;
    }

    /**
     * Process tag string to get pure tag name
     *
     * @private
     * @method _getTag
     * @param {String} string original html
     * @return {String} tag name
     */
    function _getTag(string) {
        var tail = string.indexOf(' ');

        // TODO:
        // we have to figure out how to handle non-well-formatted HTML case
        if (-1 === tail) {
            tail = string.indexOf('>');
            if (-1 === tail) {
                throw new Error('HTML tag is not well-formed : ' + string);
            }
        }

        return string.substring(1, tail);
    }


    /**
     * Get the end position for String#substring()
     *
     * If options.truncateLastWord is FALSE, we try to the end position up to
     * options.slop characters to avoid breaking in the middle of a word.
     *
     * @private
     * @method _getEndPosition
     * @param {String} string original html
     * @param {Number} tailPos (optional) provided to avoid extending the slop into trailing HTML tag
     * @return {Number} maxLength
     */
    function _getEndPosition (string, tailPos) {
        var defaultPos = maxLength - total,
            position = defaultPos,
            isShort = defaultPos < options.slop,
            slopPos = isShort ? defaultPos : options.slop - 1,
            substr,
            startSlice = isShort ? 0 : defaultPos - options.slop,
            endSlice = tailPos || (defaultPos + options.slop),
            result;

        if (!options.truncateLastWord) {

            substr = string.slice(startSlice, endSlice);

            if (tailPos && substr.length <= tailPos) {
                position = substr.length;
            }
            else {
                while ((result = WORD_BREAK_REGEX.exec(substr)) !== null) {
                    // a natural break position before the hard break position
                    if (result.index < slopPos) {
                        position = defaultPos - (slopPos - result.index);
                        // keep seeking closer to the hard break position
                        // unless a natural break is at position 0
                        if (result.index === 0 && defaultPos <= 1) break;
                    }
                    // a natural break position exactly at the hard break position
                    else if (result.index === slopPos) {
                        position = defaultPos;
                        break; // seek no more
                    }
                    // a natural break position after the hard break position
                    else {
                        position = defaultPos + (result.index - slopPos);
                        break;  // seek no more
                    }
                }
            }
            if (string.charAt(position - 1).match(/\s$/)) position--;
        }
        return position;
    }

    options = options || EMPTY_OBJECT;
    options.ellipsis = (undefined !== options.ellipsis) ? options.ellipsis : DEFAULT_TRUNCATE_SYMBOL;
    options.truncateLastWord = (undefined !== options.truncateLastWord) ? options.truncateLastWord : true;
    options.slop = (undefined !== options.slop) ? options.slop : DEFAULT_SLOP;

    while (matches) {
        matches = HTML_TAG_REGEX.exec(string);

        if (!matches) {
            if (total >= maxLength) { break; }

            matches = URL_REGEX.exec(string);
            if (!matches || matches.index >= maxLength) {
                content += string.substring(0, _getEndPosition(string));
                break;
            }

            while (matches) {
                result = matches[0];
                index = matches.index;
                content += string.substring(0, (index + result.length) - total);
                string = string.substring(index + result.length);
                matches = URL_REGEX.exec(string);
            }
            break;
        }

        result = matches[0];
        index = matches.index;

        if (total + index > maxLength) {
            // exceed given `maxLength`, dump everything to clear stack
            content += string.substring(0, _getEndPosition(string, index));
            break;
        } else {
            total += index;
            content += string.substring(0, index);
        }

        if ('/' === result[1]) {
            // move out open tag
            items.pop();
            selfClose=null;
        } else {
            selfClose = SELF_CLOSE_REGEX.exec(result);
            if (!selfClose) {
                tag = _getTag(result);

                items.push(tag);
            }
        }

        if (selfClose) {
            content += selfClose[0];
        } else {
            content += result;
        }
        string = string.substring(index + result.length);
    }

    if (string.length > maxLength - total && options.ellipsis) {
        content += options.ellipsis;
    }
    content += _dumpCloseTag(items);

    if (!options.keepImageTag) {
        content = _removeImageTag(content);
    }

    return content;
}

module.exports = truncate;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"bcrypt":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/bcrypt/package.json                                                                                //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
exports.name = "bcrypt";
exports.version = "0.8.7";
exports.main = "./bcrypt";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"bcrypt.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/bcrypt/bcrypt.js                                                                                   //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
'use strict';

var bindings = require('bindings')('bcrypt_lib');
var crypto = require('crypto');

/// generate a salt (sync)
/// @param {Number} [rounds] number of rounds (default 10)
/// @return {String} salt
module.exports.genSaltSync = function(rounds) {
    // default 10 rounds
    if (!rounds) {
        rounds = 10;
    } else if (typeof rounds !== 'number') {
        throw new Error('rounds must be a number');
    }

    return bindings.gen_salt_sync(rounds, crypto.randomBytes(16));
};

/// generate a salt
/// @param {Number} [rounds] number of rounds (default 10)
/// @param {Function} cb callback(err, salt)
module.exports.genSalt = function(rounds, ignore, cb) {
    // if callback is first argument, then use defaults for others
    if (typeof arguments[0] === 'function') {
        // have to set callback first otherwise arguments are overriden
        cb = arguments[0];
        rounds = 10;
    // callback is second argument
    } else if (typeof arguments[1] === 'function') {
        // have to set callback first otherwise arguments are overriden
        cb = arguments[1];
    }

    // default 10 rounds
    if (!rounds) {
        rounds = 10;
    } else if (typeof rounds !== 'number') {
        // callback error asynchronously
        return process.nextTick(function() {
            cb(new Error('rounds must be a number'));
        });
    }

    if (!cb) {
        return;
    }

    crypto.randomBytes(16, function(error, randomBytes) {
        if (error) {
            cb(error);
            return;
        }

        bindings.gen_salt(rounds, randomBytes, cb);
    });
};

/// hash data using a salt
/// @param {String} data the data to encrypt
/// @param {String} salt the salt to use when hashing
/// @return {String} hash
module.exports.hashSync = function(data, salt) {
    if (data == null || salt == null) {
        throw new Error('data and salt arguments required');
    }

    if (typeof data !== 'string' || (typeof salt !== 'string' && typeof salt !== 'number')) {
        throw new Error('data must be a string and salt must either be a salt string or a number of rounds');
    }

    if (typeof salt === 'number') {
        salt = module.exports.genSaltSync(salt);
    }

    return bindings.encrypt_sync(data, salt);
};

/// hash data using a salt
/// @param {String} data the data to encrypt
/// @param {String} salt the salt to use when hashing
/// @param {Function} cb callback(err, hash)
module.exports.hash = function(data, salt, cb) {
    if (typeof data === 'function') {
        return process.nextTick(function() {
            data(new Error('data must be a string and salt must either be a salt string or a number of rounds'));
        });
    }

    if (typeof salt === 'function') {
        return process.nextTick(function() {
            salt(new Error('data must be a string and salt must either be a salt string or a number of rounds'));
        });
    }

    if (data == null || salt == null) {
        return process.nextTick(function() {
            cb(new Error('data and salt arguments required'));
        });
    }

    if (typeof data !== 'string' || (typeof salt !== 'string' && typeof salt !== 'number')) {
        return process.nextTick(function() {
            cb(new Error('data must be a string and salt must either be a salt string or a number of rounds'));
        });
    }

    if (!cb || typeof cb !== 'function') {
        return;
    }

    if (typeof salt === 'number') {
        return module.exports.genSalt(salt, function(err, salt) {
            return bindings.encrypt(data, salt, cb);
        });
    }

    return bindings.encrypt(data, salt, cb);
};

/// compare raw data to hash
/// @param {String} data the data to hash and compare
/// @param {String} hash expected hash
/// @return {bool} true if hashed data matches hash
module.exports.compareSync = function(data, hash) {
    if (data == null || hash == null) {
        throw new Error('data and hash arguments required');
    }

    if (typeof data !== 'string' || typeof hash !== 'string') {
        throw new Error('data and hash must be strings');
    }

    return bindings.compare_sync(data, hash);
};

/// compare raw data to hash
/// @param {String} data the data to hash and compare
/// @param {String} hash expected hash
/// @param {Function} cb callback(err, matched) - matched is true if hashed data matches hash
module.exports.compare = function(data, hash, cb) {
    if (data == null || hash == null) {
        return process.nextTick(function() {
            cb(new Error('data and hash arguments required'));
        });
    }

    if (typeof data !== 'string' || typeof hash !== 'string') {
        return process.nextTick(function() {
            cb(new Error('data and hash must be strings'));
        });
    }

    if (!cb || typeof cb !== 'function') {
        return;
    }

    return bindings.compare(data, hash, cb);
};

/// @param {String} hash extract rounds from this hash
/// @return {Number} the number of rounds used to encrypt a given hash
module.exports.getRounds = function(hash) {
    if (hash == null) {
        throw new Error('hash argument required');
    }

    if (typeof hash !== 'string') {
        throw new Error('hash must be a string');
    }

    return bindings.get_rounds(hash);
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"ics-js":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/ics-js/package.json                                                                                //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
exports.name = "ics-js";
exports.version = "0.9.1";
exports.main = "dist/ics-js.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"dist":{"ics-js.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/ics-js/dist/ics-js.js                                                                              //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports["ics-js"]=t():e["ics-js"]=t()}(this,function(){return function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={exports:{},id:r,loaded:!1};return e[r].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(23);Object.defineProperty(t,"VALARM",{enumerable:!0,get:function(){return r.VALARM}}),Object.defineProperty(t,"VCALENDAR",{enumerable:!0,get:function(){return r.VCALENDAR}}),Object.defineProperty(t,"VEVENT",{enumerable:!0,get:function(){return r.VEVENT}}),Object.defineProperty(t,"VTODO",{enumerable:!0,get:function(){return r.VTODO}})},function(e,t){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=function(){function e(t,r){var o=arguments.length<=2||void 0===arguments[2]?!1:arguments[2];n(this,e),this.value=t,this.props=r||{},this.skipTransformer=o}return r(e,[{key:"shortTransformer",value:function(){return!0}},{key:"transformer",value:function(){return this.value}},{key:"transformedValue",value:function(){return this.skipTransformer||this.shortTransformer()?this.value:this.transformer()}},{key:"transformedProps",value:function(){var e=this,t=[];return Object.keys(this.props).forEach(function(n){t.push(n+"="+e.props[n])}),t.join(";")}},{key:"toString",value:function(){var e=Object.keys(this.props).length>0,t=this.constructor.propName+(e?";"+this.transformedProps():""),n=this.transformedValue(),r=t;return n&&(r+=":"+n),r.match(/.{1,75}/g).join("\r\n ")}}]),e}();o.propName="Property",t["default"]=o},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),f=n(14),c=n(1),s=r(c),l=function(e){function t(){return o(this,t),u(this,Object.getPrototypeOf(t).apply(this,arguments))}return i(t,e),a(t,[{key:"shortTransformer",value:function(){return!(this.value instanceof Date)}},{key:"transformer",value:function(){var e=void 0,t="DATE"===this.props.VALUE;if(e=this.value,t){var n=6e4*this.value.getTimezoneOffset();e=new Date(this.value.getTime()+n)}return(0,f.formatDate)(e,!t)}}]),t}(s["default"]);l.propName="DTSTAMP",t["default"]=l},function(e,t,n){"use strict";function r(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t["default"]=e,t}function o(e){return e&&e.__esModule?e:{"default":e}}function u(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),f=n(17),c=o(f),s=n(26),l=n(45),p=r(l),y=n(10),h=function(){function e(){i(this,e),this.prefix="BEGIN:"+this.constructor.componentName,this.suffix="END:"+this.constructor.componentName,this.internalProps=[],this.internalComponents=[]}return a(e,[{key:"props",value:function(){return Object.freeze(this.internalProps.slice(0))}},{key:"propNames",value:function(){return Object.freeze(this.internalProps.map(function(e){return e.constructor.propName}))}},{key:"addProp",value:function(e,t){var n=this,r=arguments.length<=2||void 0===arguments[2]?{}:arguments[2],o=arguments.length<=3||void 0===arguments[3]?!1:arguments[3],u=this.constructor.validProps;if(!u[e])throw new y.InvalidProvidedPropError;var i=p[e]||p.base(e),a=new i(t,r,o);return u[e].forEach(function(e){e(n,a)}),this.internalProps.push(a),a}},{key:"components",value:function(){return Object.freeze(this.internalComponents.slice(0))}},{key:"componentNames",value:function(){return Object.freeze(this.internalComponents.map(function(e){return e.constructor.componentName}))}},{key:"addComponent",value:function(t){var n=this,r=this.constructor.validComponents,o=t.constructor.componentName;if(!(t instanceof e))throw new TypeError("Expected component to be an instance of Component.");if(!r[o])throw new y.InvalidProvidedComponentError;return r[o].forEach(function(e){e(n,t)}),this.internalComponents.push(t),t}},{key:"reset",value:function(){this.internalProps=[],this.internalComponents=[]}},{key:"validateRequired",value:function(){var e=this.constructor.requiredProps;if((0,c["default"])(e,this.propNames()).length>0)throw new y.InvalidComponentError;return!0}},{key:"toString",value:function(){this.validateRequired();var e=this.internalProps.map(function(e){return e.toString()}),t=this.internalComponents.map(function(e){return e.toString()});return[this.prefix].concat(u(e),u(t),[this.suffix]).join(this.constructor.separator)}},{key:"toBlob",value:function(){return new Blob([this.toString()],{type:s.MIME_TYPE})}},{key:"toBase64",value:function(){var e=this.toBlob(),t=new window.FileReader;return new Promise(function(n,r){t.readAsDataURL(e),t.onloadend=function(){n(t.result)},t.onerror=function(){r(t.error)},t.onabort=function(){r()}})}}]),e}();h.componentName="Component",h.separator="\r\n",h.requiredProps=[],h.validProps={},h.validComponents={},t["default"]=h},function(e,t){function n(e){var t=typeof e;return"number"==t||"boolean"==t||"string"==t&&"__proto__"!=e||null==e}e.exports=n},function(e,t,n){var r=n(15),o=n(79),u=r(o,"Map");e.exports=u},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0}),t.unique=t.singleton=void 0;var o=n(24),u=r(o),i=n(25),a=r(i);t.singleton=u["default"],t.unique=a["default"]},function(e,t){"use strict";var n=function(){function e(e,t){for(var n in t){var r=t[n];r.configurable=!0,r.value&&(r.writable=!0)}Object.defineProperties(e,t)}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),r=function a(e,t,n){var r=Object.getOwnPropertyDescriptor(e,t);if(void 0===r){var o=Object.getPrototypeOf(e);return null===o?void 0:a(o,t,n)}if("value"in r&&r.writable)return r.value;var u=r.get;if(void 0!==u)return u.call(n)},o=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(e.__proto__=t)},u=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")},i=function(e){function t(e){u(this,t),Error.captureStackTrace(this,this.constructor),this.message=e,r(Object.getPrototypeOf(t.prototype),"constructor",this).call(this,e)}return o(t,e),n(t,{name:{get:function(){return this.constructor.name}}}),t}(Error);e.exports=i},function(e,t,n){function r(e,t){for(var n=e.length;n--;)if(o(e[n][0],t))return n;return-1}var o=n(81);e.exports=r},function(e,t,n){var r=n(15),o=r(Object,"create");e.exports=o},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0}),t.ValidationError=t.InvalidProvidedPropError=t.InvalidProvidedComponentError=t.InvalidComponentError=void 0;var o=n(27),u=r(o),i=n(28),a=r(i),f=n(29),c=r(f),s=n(30),l=r(s);t.InvalidComponentError=u["default"],t.InvalidProvidedComponentError=a["default"],t.InvalidProvidedPropError=c["default"],t.ValidationError=l["default"]},function(e,t,n){function r(e){return u(e)&&o(e)}var o=n(84),u=n(18);e.exports=r},function(e,t,n){function r(e){var t=o(e)?f.call(e):"";return t==u||t==i}var o=n(13),u="[object Function]",i="[object GeneratorFunction]",a=Object.prototype,f=a.toString;e.exports=r},function(e,t){function n(e){var t=typeof e;return!!e&&("object"==t||"function"==t)}e.exports=n},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0}),t.formatDate=void 0;var o=n(31),u=r(o);t.formatDate=u["default"]},function(e,t,n){function r(e,t){var n=e[t];return o(n)?n:void 0}var o=n(86);e.exports=r},function(e,t,n){function r(e,t){return o?void 0!==e[t]:i.call(e,t)}var o=n(9),u=Object.prototype,i=u.hasOwnProperty;e.exports=r},function(e,t,n){var r=n(59),o=n(60),u=n(11),i=n(88),a=i(function(e,t){return u(e)?r(e,o(t,1,u,!0)):[]});e.exports=a},function(e,t){function n(e){return!!e&&"object"==typeof e}e.exports=n},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=n(3),f=r(a),c=n(6),s=function(e){function t(){return o(this,t),u(this,Object.getPrototypeOf(t).apply(this,arguments))}return i(t,e),t}(f["default"]);s.componentName="VALARM",s.requiredProps=["ACTION","TRIGGER"],s.validProps={ACTION:[(0,c.singleton)()],TRIGGER:[(0,c.singleton)()],ATTACH:[(0,c.singleton)()],DESCRIPTION:[(0,c.singleton)()],DURATION:[(0,c.singleton)()],REPEAT:[(0,c.singleton)()],SUMMARY:[(0,c.singleton)()],ATTENDEE:[]},t["default"]=s},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=n(3),f=r(a),c=n(6),s=function(e){function t(){return o(this,t),u(this,Object.getPrototypeOf(t).apply(this,arguments))}return i(t,e),t}(f["default"]);s.componentName="VCALENDAR",s.requiredProps=["PRODID","VERSION"],s.validProps={PRODID:[(0,c.singleton)()],VERSION:[(0,c.singleton)()],CALSCALE:[(0,c.singleton)()],METHOD:[(0,c.singleton)()]},s.validComponents={VEVENT:[],VFREEBUSY:[],VJOURNAL:[],VTIMEZONE:[],VTODO:[]},t["default"]=s},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=n(3),f=r(a),c=n(6),s=function(e){function t(){return o(this,t),u(this,Object.getPrototypeOf(t).apply(this,arguments))}return i(t,e),t}(f["default"]);s.componentName="VEVENT",s.requiredProps=["DTSTAMP","UID"],s.validProps={DTSTAMP:[(0,c.singleton)()],UID:[(0,c.singleton)()],CLASS:[(0,c.singleton)()],CREATED:[(0,c.singleton)()],DESCRIPTION:[(0,c.singleton)()],DTSTART:[(0,c.singleton)()],GEO:[(0,c.singleton)()],"LAST-MOD":[(0,c.singleton)()],LOCATION:[(0,c.singleton)()],ORGANIZER:[(0,c.singleton)()],PRIORITY:[(0,c.singleton)()],"RECURRENCE-ID":[(0,c.singleton)()],RRULE:[(0,c.singleton)()],SEQUENCE:[(0,c.singleton)()],STATUS:[(0,c.singleton)()],SUMMARY:[(0,c.singleton)()],TRANSP:[(0,c.singleton)()],URL:[(0,c.singleton)()],DTEND:[(0,c.singleton)(),(0,c.unique)(["DURATION"])],DURATION:[(0,c.singleton)(),(0,c.unique)(["DTEND"])],ATTACH:[],ATTENDEE:[],CATEGORIES:[],COMMENT:[],CONTACT:[],EXDATE:[],RDATE:[],RELATED:[],"REQUEST-STATUS":[],RESOURCES:[]},s.validComponents={VALARM:[]},t["default"]=s},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=n(3),f=r(a),c=n(6),s=function(e){function t(){return o(this,t),u(this,Object.getPrototypeOf(t).apply(this,arguments))}return i(t,e),t}(f["default"]);s.componentName="VTODO",s.requiredProps=["DTSTAMP","UID"],s.validProps={DTSTAMP:[(0,c.singleton)()],UID:[(0,c.singleton)()],CLASS:[(0,c.singleton)()],COMPLETED:[(0,c.singleton)()],CREATED:[(0,c.singleton)()],DESCRIPTION:[(0,c.singleton)()],DTSTART:[(0,c.singleton)()],GEO:[(0,c.singleton)()],"LAST-MOD":[(0,c.singleton)()],LOCATION:[(0,c.singleton)()],ORGANIZER:[(0,c.singleton)()],PERCENT:[(0,c.singleton)()],PRIORITY:[(0,c.singleton)()],"RECURRENCE-ID":[(0,c.singleton)()],RRULE:[(0,c.singleton)()],SEQUENCE:[(0,c.singleton)()],STATUS:[(0,c.singleton)()],SUMMARY:[(0,c.singleton)()],URL:[(0,c.singleton)()],DUE:[(0,c.singleton)(),(0,c.unique)(["DURATION"])],DURATION:[(0,c.singleton)(),(0,c.unique)(["DUE"])],ATTACH:[],ATTENDEE:[],CATEGORIES:[],COMMENT:[],CONTACT:[],EXDATE:[],RDATE:[],RELATED:[],"REQUEST-STATUS":[],RESOURCES:[]},s.validComponents={VALARM:[]},t["default"]=s},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0}),t.VTODO=t.VEVENT=t.VCALENDAR=t.VALARM=void 0;var o=n(19),u=r(o),i=n(20),a=r(i),f=n(21),c=r(f),s=n(22),l=r(s);t.VALARM=u["default"],t.VCALENDAR=a["default"],t.VEVENT=c["default"],t.VTODO=l["default"]},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(1),u=r(o),i=n(3),a=r(i),f=n(10);t["default"]=function(){return function(e,t){var n=void 0,r=void 0;t instanceof u["default"]?(n=t.constructor.propName,r=e.propNames()):t instanceof a["default"]&&(n=t.constructor.componentName,r=e.componentNames());var o=r.filter(function(e){return e===n});if(o.length>=1)throw new f.ValidationError}}},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}Object.defineProperty(t,"__esModule",{value:!0});var u=n(17),i=r(u),a=n(1),f=r(a),c=n(3),s=r(c),l=n(10);t["default"]=function(e){return function(t,n){var r=void 0,u=void 0;if(n instanceof f["default"]?(r=n.constructor.propName,u=t.propNames()):n instanceof s["default"]&&(r=n.constructor.componentName,u=t.componentNames()),(0,i["default"])(u,[r].concat(o(e)))>1)throw new l.ValidationError}}},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.MIME_TYPE="text/calendar"},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=n(7),f=r(a),c=function(e){function t(){var e=arguments.length<=0||void 0===arguments[0]?"Component does not contain all required properties.":arguments[0];return o(this,t),u(this,Object.getPrototypeOf(t).call(this,e))}return i(t,e),t}(f["default"]);t["default"]=c},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=n(7),f=r(a),c=function(e){function t(){var e=arguments.length<=0||void 0===arguments[0]?"Provided component's type is not listed in validComponents.":arguments[0];return o(this,t),u(this,Object.getPrototypeOf(t).call(this,e))}return i(t,e),t}(f["default"]);t["default"]=c},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=n(7),f=r(a),c=function(e){function t(){var e=arguments.length<=0||void 0===arguments[0]?"Provided property's type is not listed in validProps.":arguments[0];return o(this,t),u(this,Object.getPrototypeOf(t).call(this,e))}return i(t,e),t}(f["default"]);t["default"]=c},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=n(7),f=r(a),c=function(e){function t(){var e=arguments.length<=0||void 0===arguments[0]?"Provided object was invalid for the recieving component.":arguments[0];return o(this,t),u(this,Object.getPrototypeOf(t).call(this,e))}return i(t,e),t}(f["default"]);t["default"]=c},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var o=n(46),u=r(o);t["default"]=function(e){var t=arguments.length<=1||void 0===arguments[1]?!0:arguments[1],n=void 0;return n=e.getFullYear()+(0,u["default"])(e.getMonth()+1,2,0)+(0,u["default"])(e.getDate(),2,0),t&&(n+="T"+(0,u["default"])(e.getHours(),2,0)+(0,u["default"])(e.getMinutes(),2,0)+(0,u["default"])(e.getSeconds(),2,0)),n}},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),f=n(1),c=r(f),s=function(e){function t(){return o(this,t),u(this,Object.getPrototypeOf(t).apply(this,arguments))}return i(t,e),a(t,[{key:"shortTransformer",value:function(){return!Array.isArray(this.value)}},{key:"transformer",value:function(){return this.value.join(",")}}]),t}(c["default"]);s.propName="CATEGORIES",t["default"]=s},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=n(2),f=r(a),c=function(e){function t(){return o(this,t),u(this,Object.getPrototypeOf(t).apply(this,arguments))}return i(t,e),t}(f["default"]);c.propName="CREATED",t["default"]=c},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=n(2),f=r(a),c=function(e){function t(){return o(this,t),u(this,Object.getPrototypeOf(t).apply(this,arguments))}return i(t,e),t}(f["default"]);c.propName="DTEND",t["default"]=c},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=n(2),f=r(a),c=function(e){function t(){return o(this,t),u(this,Object.getPrototypeOf(t).apply(this,arguments))}return i(t,e),t}(f["default"]);c.propName="DTSTART",t["default"]=c},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=n(2),f=r(a),c=function(e){function t(){return o(this,t),u(this,Object.getPrototypeOf(t).apply(this,arguments))}return i(t,e),t}(f["default"]);c.propName="DUE",t["default"]=c},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),f=n(14),c=n(1),s=r(c),l=function(e){function t(){return o(this,t),u(this,Object.getPrototypeOf(t).apply(this,arguments))}return i(t,e),a(t,[{key:"shortTransformer",value:function(){return Array.isArray(this.value)?!this.value.every(function(e){return e instanceof Date}):!0}},{key:"transformer",value:function(){var e="DATE"===this.props.VALUE;return this.value.map(function(t){if(e){var n=6e4*t.getTimezoneOffset();return(0,f.formatDate)(new Date(t.getTime()+n),!e)}return(0,f.formatDate)(t,!e)}).join(",")}}]),t}(s["default"]);l.propName="EXDATE",t["default"]=l},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),f=n(1),c=r(f),s=function(e){function t(){return o(this,t),u(this,Object.getPrototypeOf(t).apply(this,arguments))}return i(t,e),a(t,[{key:"shortTransformer",value:function(){return!Array.isArray(this.value)}},{key:"transformer",value:function(){return this.value.join(";")}}]),t}(c["default"]);s.propName="GEO",t["default"]=s},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=n(2),f=r(a),c=function(e){function t(){return o(this,t),u(this,Object.getPrototypeOf(t).apply(this,arguments))}return i(t,e),t}(f["default"]);c.propName="LAST-MODIFIED",t["default"]=c},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=n(2),f=r(a),c=function(e){function t(){return o(this,t),u(this,Object.getPrototypeOf(t).apply(this,arguments))}return i(t,e),t}(f["default"]);c.propName="RDATE",t["default"]=c},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),f=n(1),c=r(f),s=function(e){function t(){return o(this,t),u(this,Object.getPrototypeOf(t).apply(this,arguments))}return i(t,e),a(t,[{key:"shortTransformer",value:function(){return"boolean"!=typeof this.value}},{key:"transformer",value:function(){return this.value?"TRANSPARENT":"OPAQUE"}}]),t}(c["default"]);
s.propName="TRANSP",t["default"]=s},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),f=n(91),c=r(f),s=n(1),l=r(s),p=function(e){function t(){return o(this,t),u(this,Object.getPrototypeOf(t).apply(this,arguments))}return i(t,e),a(t,[{key:"shortTransformer",value:function(){return Boolean(this.value)}},{key:"transformer",value:function(){return(0,c["default"])()}}]),t}(l["default"]);p.propName="UID",t["default"]=p},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),f=n(1),c=r(f),s=function(e){function t(){return o(this,t),u(this,Object.getPrototypeOf(t).apply(this,arguments))}return i(t,e),a(t,[{key:"shortTransformer",value:function(){return"number"!=typeof this.value}},{key:"transformer",value:function(){return parseFloat(this.value).toFixed(1)}}]),t}(c["default"]);s.propName="VERSION",t["default"]=s},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var a=n(1),f=r(a);t["default"]=function(e){var t,n;return n=t=function(e){function t(){return o(this,t),u(this,Object.getPrototypeOf(t).apply(this,arguments))}return i(t,e),t}(f["default"]),t.propName=e,n}},function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0}),t.VERSION=t.UID=t.TRANSP=t.RDATE=t.LAST_MODIFIED=t.GEO=t.EXDATE=t.DUE=t.DTSTART=t.DTSTAMP=t.DTEND=t.CREATED=t.CATEGORIES=t.base=void 0;var o=n(44),u=r(o),i=n(32),a=r(i),f=n(33),c=r(f),s=n(34),l=r(s),p=n(2),y=r(p),h=n(35),d=r(h),b=n(36),v=r(b),O=n(37),_=r(O),E=n(38),w=r(E),m=n(39),g=r(m),T=n(40),j=r(T),P=n(41),x=r(P),A=n(42),R=r(A),M=n(43),D=r(M);t.base=u["default"],t.CATEGORIES=a["default"],t.CREATED=c["default"],t.DTEND=l["default"],t.DTSTAMP=y["default"],t.DTSTART=d["default"],t.DUE=v["default"],t.EXDATE=_["default"],t.GEO=w["default"],t.LAST_MODIFIED=g["default"],t.RDATE=j["default"],t.TRANSP=x["default"],t.UID=R["default"],t.VERSION=D["default"]},function(e,t){function n(e,t,n){e=String(e);var r=-1;for(n||0===n||(n=" "),t-=e.length;++r<t;)e=n+e;return e}e.exports=n},function(e,t,n){function r(){}var o=n(9),u=Object.prototype;r.prototype=o?o(null):u,e.exports=r},function(e,t,n){function r(e){var t=-1,n=e?e.length:0;for(this.clear();++t<n;){var r=e[t];this.set(r[0],r[1])}}var o=n(74),u=n(75),i=n(76),a=n(77),f=n(78);r.prototype.clear=o,r.prototype["delete"]=u,r.prototype.get=i,r.prototype.has=a,r.prototype.set=f,e.exports=r},function(e,t,n){function r(e){var t=-1,n=e?e.length:0;for(this.__data__=new o;++t<n;)this.push(e[t])}var o=n(48),u=n(65);r.prototype.push=u,e.exports=r},function(e,t){function n(e,t,n){var r=n.length;switch(r){case 0:return e.call(t);case 1:return e.call(t,n[0]);case 2:return e.call(t,n[0],n[1]);case 3:return e.call(t,n[0],n[1],n[2])}return e.apply(t,n)}e.exports=n},function(e,t,n){function r(e,t){return!!e.length&&o(e,t,0)>-1}var o=n(61);e.exports=r},function(e,t){function n(e,t,n){for(var r=-1,o=e.length;++r<o;)if(n(t,e[r]))return!0;return!1}e.exports=n},function(e,t){function n(e,t){for(var n=-1,r=e.length,o=Array(r);++n<r;)o[n]=t(e[n],n,e);return o}e.exports=n},function(e,t){function n(e,t){for(var n=-1,r=t.length,o=e.length;++n<r;)e[o+n]=t[n];return e}e.exports=n},function(e,t,n){function r(e,t){var n=o(e,t);if(0>n)return!1;var r=e.length-1;return n==r?e.pop():i.call(e,n,1),!0}var o=n(8),u=Array.prototype,i=u.splice;e.exports=r},function(e,t,n){function r(e,t){var n=o(e,t);return 0>n?void 0:e[n][1]}var o=n(8);e.exports=r},function(e,t,n){function r(e,t){return o(e,t)>-1}var o=n(8);e.exports=r},function(e,t,n){function r(e,t,n){var r=o(e,t);0>r?e.push([t,n]):e[r][1]=n}var o=n(8);e.exports=r},function(e,t,n){function r(e,t,n,r){var l=-1,p=u,y=!0,h=e.length,d=[],b=t.length;if(!h)return d;n&&(t=a(t,f(n))),r?(p=i,y=!1):t.length>=s&&(p=c,y=!1,t=new o(t));e:for(;++l<h;){var v=e[l],O=n?n(v):v;if(y&&O===O){for(var _=b;_--;)if(t[_]===O)continue e;d.push(v)}else p(t,O,r)||d.push(v)}return d}var o=n(49),u=n(51),i=n(52),a=n(53),f=n(63),c=n(64),s=200;e.exports=r},function(e,t,n){function r(e,t,n,i,a){var f=-1,c=e.length;for(n||(n=u),a||(a=[]);++f<c;){var s=e[f];t>0&&n(s)?t>1?r(s,t-1,n,i,a):o(a,s):i||(a[a.length]=s)}return a}var o=n(54),u=n(72);e.exports=r},function(e,t,n){function r(e,t,n){if(t!==t)return o(e,n);for(var r=n-1,u=e.length;++r<u;)if(e[r]===t)return r;return-1}var o=n(71);e.exports=r},function(e,t){function n(e){return function(t){return null==t?void 0:t[e]}}e.exports=n},function(e,t){function n(e){return function(t){return e(t)}}e.exports=n},function(e,t,n){function r(e,t){var n=e.__data__;if(o(t)){var r=n.__data__,i="string"==typeof t?r.string:r.hash;return i[t]===u}return n.has(t)}var o=n(4),u="__lodash_hash_undefined__";e.exports=r},function(e,t,n){function r(e){var t=this.__data__;if(o(e)){var n=t.__data__,r="string"==typeof e?n.string:n.hash;r[e]=u}else t.set(e,u)}var o=n(4),u="__lodash_hash_undefined__";e.exports=r},function(e,t){function n(e){return e&&e.Object===Object?e:null}e.exports=n},function(e,t,n){var r=n(62),o=r("length");e.exports=o},function(e,t,n){function r(e,t){return o(e,t)&&delete e[t]}var o=n(16);e.exports=r},function(e,t,n){function r(e,t){if(o){var n=e[t];return n===u?void 0:n}return a.call(e,t)?e[t]:void 0}var o=n(9),u="__lodash_hash_undefined__",i=Object.prototype,a=i.hasOwnProperty;e.exports=r},function(e,t,n){function r(e,t,n){e[t]=o&&void 0===n?u:n}var o=n(9),u="__lodash_hash_undefined__";e.exports=r},function(e,t){function n(e,t,n){for(var r=e.length,o=t+(n?0:-1);n?o--:++o<r;){var u=e[o];if(u!==u)return o}return-1}e.exports=n},function(e,t,n){function r(e){return i(e)&&(u(e)||o(e))}var o=n(82),u=n(83),i=n(11);e.exports=r},function(e,t){function n(e){var t=!1;if(null!=e&&"function"!=typeof e.toString)try{t=!!(e+"")}catch(n){}return t}e.exports=n},function(e,t,n){function r(){this.__data__={hash:new o,map:u?new u:[],string:new o}}var o=n(47),u=n(5);e.exports=r},function(e,t,n){function r(e){var t=this.__data__;return a(e)?i("string"==typeof e?t.string:t.hash,e):o?t.map["delete"](e):u(t.map,e)}var o=n(5),u=n(55),i=n(68),a=n(4);e.exports=r},function(e,t,n){function r(e){var t=this.__data__;return a(e)?i("string"==typeof e?t.string:t.hash,e):o?t.map.get(e):u(t.map,e)}var o=n(5),u=n(56),i=n(69),a=n(4);e.exports=r},function(e,t,n){function r(e){var t=this.__data__;return a(e)?i("string"==typeof e?t.string:t.hash,e):o?t.map.has(e):u(t.map,e)}var o=n(5),u=n(57),i=n(16),a=n(4);e.exports=r},function(e,t,n){function r(e,t){var n=this.__data__;return a(e)?i("string"==typeof e?n.string:n.hash,e,t):o?n.map.set(e,t):u(n.map,e,t),this}var o=n(5),u=n(58),i=n(70),a=n(4);e.exports=r},function(e,t,n){(function(e,r){var o=n(66),u={"function":!0,object:!0},i=u[typeof t]&&t&&!t.nodeType?t:void 0,a=u[typeof e]&&e&&!e.nodeType?e:void 0,f=o(i&&a&&"object"==typeof r&&r),c=o(u[typeof self]&&self),s=o(u[typeof window]&&window),l=o(u[typeof this]&&this),p=f||s!==(l&&l.window)&&s||c||l||Function("return this")();e.exports=p}).call(t,n(92)(e),function(){return this}())},function(e,t){function n(e){if(null!=e){try{return r.call(e)}catch(t){}try{return e+""}catch(t){}}return""}var r=Function.prototype.toString;e.exports=n},function(e,t){function n(e,t){return e===t||e!==e&&t!==t}e.exports=n},function(e,t,n){function r(e){return o(e)&&a.call(e,"callee")&&(!c.call(e,"callee")||f.call(e)==u)}var o=n(11),u="[object Arguments]",i=Object.prototype,a=i.hasOwnProperty,f=i.toString,c=i.propertyIsEnumerable;e.exports=r},function(e,t){var n=Array.isArray;e.exports=n},function(e,t,n){function r(e){return null!=e&&i(o(e))&&!u(e)}var o=n(67),u=n(12),i=n(85);e.exports=r},function(e,t){function n(e){return"number"==typeof e&&e>-1&&e%1==0&&r>=e}var r=9007199254740991;e.exports=n},function(e,t,n){function r(e){if(!i(e))return!1;var t=o(e)||u(e)?y:c;return t.test(a(e))}var o=n(12),u=n(73),i=n(13),a=n(80),f=/[\\^$.*+?()[\]{}|]/g,c=/^\[object .+?Constructor\]$/,s=Object.prototype,l=Function.prototype.toString,p=s.hasOwnProperty,y=RegExp("^"+l.call(p).replace(f,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");e.exports=r},function(e,t,n){function r(e){return"symbol"==typeof e||o(e)&&a.call(e)==u}var o=n(18),u="[object Symbol]",i=Object.prototype,a=i.toString;e.exports=r},function(e,t,n){function r(e,t){if("function"!=typeof e)throw new TypeError(i);return t=a(void 0===t?e.length-1:u(t),0),function(){for(var n=arguments,r=-1,u=a(n.length-t,0),i=Array(u);++r<u;)i[r]=n[t+r];switch(t){case 0:return e.call(this,i);case 1:return e.call(this,n[0],i);case 2:return e.call(this,n[0],n[1],i)}var f=Array(t+1);for(r=-1;++r<t;)f[r]=n[r];return f[t]=i,o(e,this,f)}}var o=n(50),u=n(89),i="Expected a function",a=Math.max;e.exports=r},function(e,t,n){function r(e){if(!e)return 0===e?e:0;if(e=o(e),e===u||e===-u){var t=0>e?-1:1;return t*i}var n=e%1;return e===e?n?e-n:e:0}var o=n(90),u=1/0,i=1.7976931348623157e308;e.exports=r},function(e,t,n){function r(e){if("number"==typeof e)return e;if(i(e))return a;if(u(e)){var t=o(e.valueOf)?e.valueOf():e;e=u(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(f,"");var n=s.test(e);return n||l.test(e)?p(e.slice(2),n?2:8):c.test(e)?a:+e}var o=n(12),u=n(13),i=n(87),a=NaN,f=/^\s+|\s+$/g,c=/^[-+]0x[0-9a-f]+$/i,s=/^0b[01]+$/i,l=/^0o[0-7]+$/i,p=parseInt;e.exports=r},function(e,t){var n=function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var t=16*Math.random()|0,n="x"===e?t:3&t|8;return n.toString(16)}).toUpperCase()};e.exports=n},function(e,t){e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children=[],e.webpackPolyfill=1),e}}])});
//# sourceMappingURL=ics-js.js.map
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"underscore":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/underscore/package.json                                                                            //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
exports.name = "underscore";
exports.version = "1.8.3";
exports.main = "underscore.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"underscore.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/underscore/underscore.js                                                                           //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},{"extensions":[".js",".json"]});
var exports = require("./node_modules/meteor/modules/server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package.modules = exports, {
  meteorInstall: meteorInstall,
  Buffer: Buffer,
  process: process
});

})();
