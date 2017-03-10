(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var Buffer = Package.modules.Buffer;
var process = Package.modules.process;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var analytics;

var require = meteorInstall({"node_modules":{"meteor":{"okgrow:analytics":{"server-main.js":["./server/browser-policy.js","./server/publications.js",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/okgrow_analytics/server-main.js                                            //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
module.import("./server/browser-policy.js");module.import("./server/publications.js");
                                                                                       // 2
/////////////////////////////////////////////////////////////////////////////////////////

}],"server":{"browser-policy.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/okgrow_analytics/server/browser-policy.js                                  //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
/* global Package */                                                                   // 1
                                                                                       //
if (Package["browser-policy-common"]) {                                                // 3
  var content = Package["browser-policy-common"].BrowserPolicy.content;                // 4
  if (content) {                                                                       // 5
    content.allowOriginForAll("https://www.google.com/analytics/");                    // 6
    content.allowOriginForAll("https://cdn.mxpnl.com");                                // 7
  }                                                                                    // 8
}                                                                                      // 9
/////////////////////////////////////////////////////////////////////////////////////////

},"publications.js":["meteor/meteor","meteor/mongo",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/okgrow_analytics/server/publications.js                                    //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
var Meteor;module.import("meteor/meteor",{"Meteor":function(v){Meteor=v}});var Mongo;module.import("meteor/mongo",{"Mongo":function(v){Mongo=v}});
                                                                                       // 2
                                                                                       //
Meteor.publish(null, function () {                                                     // 4
  if (this.userId) {                                                                   // 5
    var self = this;                                                                   // 6
    var query = Meteor.users.find({                                                    // 7
      _id: this.userId                                                                 // 9
    }, {                                                                               // 8
      fields: {                                                                        // 11
        emails: 1,                                                                     // 12
        "services.google.email": 1,                                                    // 13
        "services.github.email": 1,                                                    // 14
        "services.facebook.email": 1                                                   // 15
      }                                                                                // 11
    });                                                                                // 10
    Mongo.Collection._publishCursor(query, self, "AnalyticsUsers");                    // 18
    return self.ready();                                                               // 19
  }                                                                                    // 20
  this.ready();                                                                        // 21
});                                                                                    // 22
/////////////////////////////////////////////////////////////////////////////////////////

}]}}}}},{"extensions":[".js",".json"]});
var exports = require("./node_modules/meteor/okgrow:analytics/server-main.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['okgrow:analytics'] = exports, {
  analytics: analytics
});

})();

//# sourceMappingURL=okgrow_analytics.js.map
