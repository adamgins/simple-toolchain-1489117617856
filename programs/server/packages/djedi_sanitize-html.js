(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;

/* Package-scope variables */
var sanitizeHtml;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/djedi_sanitize-html/sanitize-html.js                     //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
sanitizeHtml = Npm.require('sanitize-html');

///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['djedi:sanitize-html'] = {}, {
  sanitizeHtml: sanitizeHtml
});

})();
