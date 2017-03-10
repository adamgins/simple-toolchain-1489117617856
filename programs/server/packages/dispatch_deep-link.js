(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var EJSON = Package.ejson.EJSON;
var EventState = Package['raix:eventstate'].EventState;
var meteorInstall = Package.modules.meteorInstall;
var Buffer = Package.modules.Buffer;
var process = Package.modules.process;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var btoa, atob, intentPattern, browserIntentPattern, objectToQueryString, objectToBase64, objectFromBase64, isNested, createQueryString, parseQueryString, DeepLink;

var require = meteorInstall({"node_modules":{"meteor":{"dispatch:deep-link":{"lib":{"server.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/dispatch_deep-link/lib/server.js                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
btoa = function btoa(str) {                                                                                           // 1
  return new Buffer(str).toString('base64');                                                                          // 1
};                                                                                                                    // 1
                                                                                                                      //
atob = function atob(base64) {                                                                                        // 3
  return new Buffer(base64, 'base64').toString();                                                                     // 3
};                                                                                                                    // 3
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"common.js":["babel-runtime/helpers/classCallCheck",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/dispatch_deep-link/lib/common.js                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _classCallCheck;module.import('babel-runtime/helpers/classCallCheck',{"default":function(v){_classCallCheck=v}});
/* jshint maxlen: 130 */                                                                                              // 1
                                                                                                                      //
/**                                                                                                                   // 3
 * Cordova intent pattern                                                                                             //
 *                                                                                                                    //
 * eg.:                                                                                                               //
 * "intentname://path?arguments"                                                                                      //
 *                                                                                                                    //
 * @type {RegExp}                                                                                                     //
 */                                                                                                                   //
intentPattern = /([a-zA-Z0-9]+):(?:\/\/)?([a-zA-Z0-9\/]+)?(?:\?(?:data:ejson;(base64),)?(.*))?/;                      // 11
                                                                                                                      //
/**                                                                                                                   // 13
 * Browser intent pattern                                                                                             //
 *                                                                                                                    //
 * eg.:                                                                                                               //
 * "http://foo.com/intentname://path?arguments"                                                                       //
 *                                                                                                                    //
 * @type {RegExp}                                                                                                     //
 */                                                                                                                   //
browserIntentPattern = /(?:.*):\/\/(?:[a-zA-Z0-9:\.])+\/((?:[a-zA-Z0-9]+):(?:\/\/)?(?:.*))/;                          // 21
                                                                                                                      //
/**                                                                                                                   // 23
 * Converts an object into a querystring                                                                              //
 * @param  {Object} obj) Source                                                                                       //
 * @return {String}      Query string                                                                                 //
 */                                                                                                                   //
objectToQueryString = function objectToQueryString(obj) {                                                             // 28
  return _.map(obj, function (val, key) {                                                                             // 28
    return key + '=' + val;                                                                                           // 28
  }).join('&');                                                                                                       // 28
};                                                                                                                    // 28
                                                                                                                      //
/**                                                                                                                   // 30
 * Converts object into an EJSON base64 string                                                                        //
 * @param  {Object} obj Source                                                                                        //
 * @return {String}     EJSON bae64 string                                                                            //
 */                                                                                                                   //
objectToBase64 = function objectToBase64(obj) {                                                                       // 35
  return 'data:ejson;base64,' + btoa(EJSON.stringify(obj));                                                           // 35
};                                                                                                                    // 35
                                                                                                                      //
/**                                                                                                                   // 37
 * Converts EJSON base64 string into object                                                                           //
 * @param  {String} str String to parse                                                                               //
 * @return {Object}     Parsed object                                                                                 //
 */                                                                                                                   //
objectFromBase64 = function objectFromBase64(str) {                                                                   // 42
  return EJSON.parse(atob(str.replace(/^data:ejson;base64,/, '')));                                                   // 42
};                                                                                                                    // 42
                                                                                                                      //
/**                                                                                                                   // 44
 * Check if object as nested objects                                                                                  //
 * @param  {Object} obj) Source                                                                                       //
 * @return {Boolean}     true=nested objects, false=flat object                                                       //
 */                                                                                                                   //
isNested = function isNested(obj) {                                                                                   // 49
  return _.some(obj, function (val) {                                                                                 // 49
    return _.isObject(val);                                                                                           // 49
  });                                                                                                                 // 49
};                                                                                                                    // 49
                                                                                                                      //
/**                                                                                                                   // 51
 * Creates the appropiate querystring depending on the data type                                                      //
 * if its a nested object it will be a base64 version if it's a                                                       //
 * "flat" object it will convert 1:1 with a querystring                                                               //
 * @param  {String|Object} data Source                                                                                //
 * @return {String}        Formatted data                                                                             //
 */                                                                                                                   //
createQueryString = function createQueryString() {                                                                    // 58
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';                                  // 58
                                                                                                                      //
  if (data !== '' + data) {                                                                                           // 59
    data = isNested(data) ? objectToBase64(data) : objectToQueryString(data);                                         // 60
  }                                                                                                                   // 61
                                                                                                                      //
  return encodeURI(data);                                                                                             // 63
};                                                                                                                    // 64
                                                                                                                      //
/**                                                                                                                   // 66
 * Parse a query string into a key/value object                                                                       //
 * @param  {String} queryString String to parse                                                                       //
 * @return {Object}             Key/value object                                                                      //
 */                                                                                                                   //
parseQueryString = function parseQueryString(queryString) {                                                           // 71
  return _.object(_.map(queryString.split('&'), function (val) {                                                      // 72
    return _.map(val.split('='), function (val) {                                                                     // 74
      return decodeURIComponent(val);                                                                                 // 74
    });                                                                                                               // 74
  }));                                                                                                                // 75
};                                                                                                                    // 76
                                                                                                                      //
var eventState = new EventState();                                                                                    // 78
                                                                                                                      //
/**                                                                                                                   // 80
 * The DeepLink class                                                                                                 //
 * @param {String} name Url scheme                                                                                    //
 * @param {Object} options Options                                                                                    //
 * @param {String} options.appId The app id                                                                           //
 * @param {String} options.url Browser url for browser intents eg. "http://foo.com/"                                  //
 * @param {String} options.fallbackUrl Fallback url in case intent fails                                              //
 */                                                                                                                   //
DeepLink = function () {                                                                                              // 88
  function DeepLink(name) {                                                                                           // 89
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};                                // 89
                                                                                                                      //
    var appId = _ref.appId;                                                                                           // 89
    var fallbackUrl = _ref.fallbackUrl;                                                                               // 89
    var url = _ref.url;                                                                                               // 89
                                                                                                                      //
    _classCallCheck(this, DeepLink);                                                                                  // 89
                                                                                                                      //
    this.name = name;                                                                                                 // 90
    this.appId = appId;                                                                                               // 91
    this.url = url ? url.replace(/\/$/, '') + '/' : ''; // Add traling slash                                          // 92
    this.fallbackUrl = fallbackUrl ? encodeURI(fallbackUrl) : '';                                                     // 93
    // Helpers                                                                                                        // 94
    if (Meteor.isClient) {                                                                                            // 95
      this.isIOS = /iPhone|iPod|iPad/i.test(navigator.userAgent);                                                     // 96
      this.isAndroid = !this.isIOS && /android/i.test(navigator.userAgent);                                           // 97
    }                                                                                                                 // 98
  }                                                                                                                   // 99
                                                                                                                      //
  DeepLink.prototype.createLink = function () {                                                                       // 88
    function createLink() {                                                                                           // 88
      var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';                              // 101
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';                              // 101
                                                                                                                      //
      data = createQueryString(data);                                                                                 // 102
      return data === '' ? path : path + '?' + data;                                                                  // 103
    }                                                                                                                 // 104
                                                                                                                      //
    return createLink;                                                                                                // 88
  }();                                                                                                                // 88
                                                                                                                      //
  DeepLink.prototype.intentLink = function () {                                                                       // 88
    function intentLink() {                                                                                           // 88
      var uri = this.createLink.apply(this, arguments);                                                               // 107
      return this.name + '://' + uri;                                                                                 // 108
    }                                                                                                                 // 109
                                                                                                                      //
    return intentLink;                                                                                                // 88
  }();                                                                                                                // 88
                                                                                                                      //
  /**                                                                                                                 // 111
   * Create browser link for a browser intent                                                                         //
   * @param  {String} path Path                                                                                       //
   * @param  {Object} data Data                                                                                       //
   * @return {String}      Link                                                                                       //
   */                                                                                                                 //
                                                                                                                      //
                                                                                                                      //
  DeepLink.prototype.browserLink = function () {                                                                      // 88
    function browserLink() {                                                                                          // 88
      var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';                              // 117
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';                              // 117
                                                                                                                      //
      return this.url + this.intentLink(path, data);                                                                  // 118
    }                                                                                                                 // 119
                                                                                                                      //
    return browserLink;                                                                                               // 88
  }();                                                                                                                // 88
                                                                                                                      //
  DeepLink.prototype.androidLink = function () {                                                                      // 88
    function androidLink() {                                                                                          // 88
      var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';                              // 121
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';                              // 121
                                                                                                                      //
      var uri = this.createLink(path, data);                                                                          // 122
      if (this.appId) {                                                                                               // 123
        if (this.fallbackUrl) {                                                                                       // 124
          return 'intent://' + uri + '#Intent;scheme=' + this.name + ';package=' + this.appId + ';S.browser_fallback_url=' + this.fallbackUrl + ';end';
        } else {                                                                                                      // 126
          return 'intent://' + uri + '#Intent;scheme=' + this.name + ';package=' + this.appId + ';end';               // 127
        }                                                                                                             // 128
      }                                                                                                               // 129
      return this.intentLink.apply(this, arguments);                                                                  // 130
    }                                                                                                                 // 131
                                                                                                                      //
    return androidLink;                                                                                               // 88
  }();                                                                                                                // 88
                                                                                                                      //
  DeepLink.prototype.iosLink = function () {                                                                          // 88
    function iosLink() {                                                                                              // 88
      return this.intentLink.apply(this, arguments);                                                                  // 134
    }                                                                                                                 // 135
                                                                                                                      //
    return iosLink;                                                                                                   // 88
  }();                                                                                                                // 88
                                                                                                                      //
  /**                                                                                                                 // 137
   * Create a link depending on settings and OS                                                                       //
   * @param  {String} path   Optional path                                                                            //
   * @param  {String|Object} data Optional data                                                                       //
   * @return {String}        Link to app                                                                              //
   */                                                                                                                 //
                                                                                                                      //
                                                                                                                      //
  DeepLink.prototype.link = function () {                                                                             // 88
    function link() {                                                                                                 // 88
      var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';                              // 143
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';                              // 143
                                                                                                                      //
      if (this.isIOS) {                                                                                               // 144
        return this.iosLink(path, data);                                                                              // 145
      } else if (this.isAndroid) {                                                                                    // 146
        return this.androidLink(path, data);                                                                          // 147
      }                                                                                                               // 148
      return this.intentLink.apply(this, arguments);                                                                  // 149
    }                                                                                                                 // 150
                                                                                                                      //
    return link;                                                                                                      // 88
  }();                                                                                                                // 88
                                                                                                                      //
  /**                                                                                                                 // 152
   * Set the ios banner in the header                                                                                 //
   * This is the meta tag that ios supports, this helper                                                              //
   * makes it easier to pass on data.                                                                                 //
   * (It will create the meta tag if not found)                                                                       //
   *                                                                                                                  //
   * @param  {String} path Optional path                                                                              //
   * @param  {String} data Optional data                                                                              //
   *                                                                                                                  //
   * @where  client                                                                                                   //
   */                                                                                                                 //
                                                                                                                      //
                                                                                                                      //
  DeepLink.prototype.iosBanner = function () {                                                                        // 88
    function iosBanner() {                                                                                            // 88
      var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';                              // 163
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';                              // 163
                                                                                                                      //
      if (this.appId && Meteor.isClient) {                                                                            // 164
                                                                                                                      //
        var link = this.intentLink(path, data);                                                                       // 166
        var content = 'app-id=' + this.appId + ', app-argument=' + link;                                              // 167
                                                                                                                      //
        var el = $('meta[name=apple-itunes-app]')[0];                                                                 // 169
                                                                                                                      //
        if (el) {                                                                                                     // 171
          el.setAttribute('content', content);                                                                        // 172
        } else {                                                                                                      // 173
          $('head').append('<meta name="apple-itunes-app" content="' + content + '"/>');                              // 174
        }                                                                                                             // 175
      }                                                                                                               // 177
    }                                                                                                                 // 180
                                                                                                                      //
    return iosBanner;                                                                                                 // 88
  }();                                                                                                                // 88
                                                                                                                      //
  /**                                                                                                                 // 182
   * Open the app                                                                                                     //
   * @param  {String} path  Optional path                                                                             //
   * @param  {String} data  Optional data                                                                             //
   * @param  {String} where Optional destination (_system)                                                            //
   *                                                                                                                  //
   * @where  client                                                                                                   //
   */                                                                                                                 //
                                                                                                                      //
                                                                                                                      //
  DeepLink.prototype.open = function () {                                                                             // 88
    function open() {                                                                                                 // 88
      var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';                              // 190
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';                              // 190
      var where = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '_system';                      // 190
                                                                                                                      //
      if (Meteor.isClient) {                                                                                          // 191
        window.open(this.link(path, data), where);                                                                    // 192
      } else {                                                                                                        // 193
        throw new Error('DeepLink.open is not implemented on the server');                                            // 194
      }                                                                                                               // 195
    }                                                                                                                 // 196
                                                                                                                      //
    return open;                                                                                                      // 88
  }();                                                                                                                // 88
                                                                                                                      //
  DeepLink.emit = function () {                                                                                       // 88
    function emit() {                                                                                                 // 88
      return eventState.emit.apply(eventState, arguments);                                                            // 198
    }                                                                                                                 // 198
                                                                                                                      //
    return emit;                                                                                                      // 88
  }();                                                                                                                // 88
                                                                                                                      //
  DeepLink.emitState = function () {                                                                                  // 88
    function emitState() {                                                                                            // 88
      return eventState.emitState.apply(eventState, arguments);                                                       // 199
    }                                                                                                                 // 199
                                                                                                                      //
    return emitState;                                                                                                 // 88
  }();                                                                                                                // 88
                                                                                                                      //
  DeepLink.on = function () {                                                                                         // 88
    function on() {                                                                                                   // 88
      return eventState.on.apply(eventState, arguments);                                                              // 200
    }                                                                                                                 // 200
                                                                                                                      //
    return on;                                                                                                        // 88
  }();                                                                                                                // 88
                                                                                                                      //
  DeepLink.once = function () {                                                                                       // 88
    function once() {                                                                                                 // 88
      return eventState.once.apply(eventState, arguments);                                                            // 201
    }                                                                                                                 // 201
                                                                                                                      //
    return once;                                                                                                      // 88
  }();                                                                                                                // 88
                                                                                                                      //
  DeepLink.off = function () {                                                                                        // 88
    function off() {                                                                                                  // 88
      return eventState.off.apply(eventState, arguments);                                                             // 202
    }                                                                                                                 // 202
                                                                                                                      //
    return off;                                                                                                       // 88
  }();                                                                                                                // 88
                                                                                                                      //
  return DeepLink;                                                                                                    // 88
}();                                                                                                                  // 88
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/dispatch:deep-link/lib/server.js");
require("./node_modules/meteor/dispatch:deep-link/lib/common.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['dispatch:deep-link'] = {}, {
  DeepLink: DeepLink,
  intentPattern: intentPattern,
  browserIntentPattern: browserIntentPattern,
  parseQueryString: parseQueryString,
  objectToQueryString: objectToQueryString,
  objectToBase64: objectToBase64,
  objectFromBase64: objectFromBase64,
  isNested: isNested,
  createQueryString: createQueryString
});

})();

//# sourceMappingURL=dispatch_deep-link.js.map
