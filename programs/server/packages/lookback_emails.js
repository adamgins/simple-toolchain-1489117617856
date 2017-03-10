(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var check = Package.check.check;
var Match = Package.check.Match;
var _ = Package.underscore._;
var Email = Package.email.Email;
var EmailInternals = Package.email.EmailInternals;
var juice = Package['sacha:juice'].juice;
var Template = Package['meteorhacks:ssr'].Template;
var SSR = Package['meteorhacks:ssr'].SSR;
var Picker = Package['meteorhacks:picker'].Picker;
var meteorInstall = Package.modules.meteorInstall;
var Buffer = Package.modules.Buffer;
var process = Package.modules.process;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var Utils, TemplateHelpers, Routing, Mailer;

var require = meteorInstall({"node_modules":{"meteor":{"lookback:emails":{"lib":{"utils.js":["node-sass",function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/lookback_emails/lib/utils.js                                                                         //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
// # Utils package for `lookback:emails`                                                                         // 1
                                                                                                                 //
var fs = Npm.require('fs');                                                                                      // 3
var Path = Npm.require('path');                                                                                  // 4
var htmlToText = Npm.require('html-to-text');                                                                    // 5
                                                                                                                 //
var isDevEnv = process.env.NODE_ENV === 'development';                                                           // 7
var minorVersion = parseInt(Meteor.release.split('.')[1], 10);                                                   // 8
                                                                                                                 //
var isModernMeteor = minorVersion >= 3;                                                                          // 10
                                                                                                                 //
// since meteor 1.3 we no longer need meteor hacks just use the npm version                                      // 12
var sass = function () {                                                                                         // 13
  if (isModernMeteor) {                                                                                          // 14
    try {                                                                                                        // 15
      return require('node-sass');                                                                               // 16
    } catch (ex) {} // eslint-disable-line no-empty                                                              // 17
  } else if (Package['chrisbutler:node-sass']) {                                                                 // 18
    return Package['chrisbutler:node-sass'].sass;                                                                // 19
  }                                                                                                              // 20
                                                                                                                 //
  return null;                                                                                                   // 22
}();                                                                                                             // 23
                                                                                                                 //
var TAG = 'mailer-utils';                                                                                        // 25
                                                                                                                 //
// This package assumes that assets (templates, SCSS, CSS ..) are                                                // 27
// stored in the `private` directory. Thanks to that, Meteor won't                                               // 28
// touch the HTML and CSS, which are non-JS files.                                                               // 29
//                                                                                                               // 30
// However, since the file paths are screwed up when bundling and                                                // 31
// deploying Meteor apps, we need to set the BUNDLE_PATH env var                                                 // 32
// to keep track of where the bundle lives.                                                                      // 33
//                                                                                                               // 34
// When deployed, set the `BUNDLE_PATH` env var to the location, perhaps:                                        // 35
//                                                                                                               // 36
//     /var/www/app/bundle                                                                                       // 37
//                                                                                                               // 38
// For Modulus, you need to use the `APP_DIR` variable, which you do NOT need to set.                            // 39
                                                                                                                 //
var developmentPrivateDir = function developmentPrivateDir() {                                                   // 41
  if (!isDevEnv) {                                                                                               // 42
    return '';                                                                                                   // 43
  }                                                                                                              // 44
                                                                                                                 //
  // In development, using `pwd` is fine. Remove the .meteor/foo/bar stuff though.                               // 46
  var reg = new RegExp(Path.sep + '.meteor.*', 'g');                                                             // 47
  var meteorRoot = process.cwd().replace(reg, '');                                                               // 48
  return Path.join(meteorRoot, 'private');                                                                       // 49
};                                                                                                               // 50
                                                                                                                 //
var productionPrivateDir = function productionPrivateDir() {                                                     // 52
  if (isDevEnv) {                                                                                                // 53
    return '';                                                                                                   // 54
  }                                                                                                              // 55
                                                                                                                 //
  var meteorRoot = fs.realpathSync(process.cwd() + '/../');                                                      // 57
  return fs.realpathSync(meteorRoot + '/../');                                                                   // 58
};                                                                                                               // 59
                                                                                                                 //
var privateDir = process.env.BUNDLE_PATH || productionPrivateDir();                                              // 61
                                                                                                                 //
var ROOT = privateDir && Path.join(privateDir, 'programs', 'server', 'assets', 'app');                           // 63
                                                                                                                 //
ROOT = ROOT || developmentPrivateDir();                                                                          // 65
                                                                                                                 //
Utils = {                                                                                                        // 67
  // Takes an HTML string and outputs a text version of it. Catches and logs errors.                             // 68
  toText: function () {                                                                                          // 69
    function toText(html) {                                                                                      // 67
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};                         // 69
                                                                                                                 //
      try {                                                                                                      // 70
        return htmlToText.fromString(html, opts);                                                                // 71
      } catch (ex) {                                                                                             // 72
        return Utils.Logger.error('Could not make plain-text version from html: ' + ex.message);                 // 73
      }                                                                                                          // 74
    }                                                                                                            // 75
                                                                                                                 //
    return toText;                                                                                               // 67
  }(),                                                                                                           // 67
  capitalizeFirstChar: function () {                                                                             // 77
    function capitalizeFirstChar(string) {                                                                       // 67
      return string.charAt(0).toUpperCase() + string.slice(1);                                                   // 78
    }                                                                                                            // 79
                                                                                                                 //
    return capitalizeFirstChar;                                                                                  // 67
  }(),                                                                                                           // 67
                                                                                                                 //
                                                                                                                 //
  // Set up a logger to use through `Utils.Logger`. Verify                                                       // 81
  // that necessary methods exists on the injected `logger` and                                                  // 82
  // fallback if not.                                                                                            // 83
  setupLogger: function () {                                                                                     // 84
    function setupLogger(logger, opts) {                                                                         // 67
      var defaults = {                                                                                           // 85
        suppressInfo: false                                                                                      // 86
      };                                                                                                         // 85
                                                                                                                 //
      opts = _.extend({}, defaults, opts);                                                                       // 89
                                                                                                                 //
      var res = ['info', 'warn', 'error'].map(function (method) {                                                // 91
        if (!_.has(logger, method)) {                                                                            // 92
          console.warn('The injected logger must support the ' + method + ' method.');                           // 93
          return false;                                                                                          // 94
        }                                                                                                        // 95
        return true;                                                                                             // 96
      });                                                                                                        // 97
                                                                                                                 //
      if (_.compact(res).length === 0) {                                                                         // 99
        console.warn('Falling back to the native logger.');                                                      // 100
        this.Logger = console;                                                                                   // 101
      } else {                                                                                                   // 102
        this.Logger = logger;                                                                                    // 103
      }                                                                                                          // 104
                                                                                                                 //
      // Just do a noop for the `info` method                                                                    // 106
      // if we're in silent mode.                                                                                // 107
      if (opts.suppressInfo === true) {                                                                          // 108
        this.Logger.info = function () {};                                                                       // 109
      }                                                                                                          // 110
    }                                                                                                            // 111
                                                                                                                 //
    return setupLogger;                                                                                          // 67
  }(),                                                                                                           // 67
  joinUrl: function () {                                                                                         // 113
    function joinUrl(base, path) {                                                                               // 67
      // Remove any trailing slashes and add front slash if not exist already.                                   // 114
      var root = base.replace(/\/$/, '');                                                                        // 115
                                                                                                                 //
      if (!/^\//.test(path)) {                                                                                   // 117
        path = '/' + path;                                                                                       // 118
      }                                                                                                          // 119
                                                                                                                 //
      return root + path;                                                                                        // 121
    }                                                                                                            // 122
                                                                                                                 //
    return joinUrl;                                                                                              // 67
  }(),                                                                                                           // 67
  addStylesheets: function () {                                                                                  // 124
    function addStylesheets(template, html) {                                                                    // 67
      var juiceOpts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};                    // 124
                                                                                                                 //
      check(template, Match.ObjectIncluding({                                                                    // 125
        name: String,                                                                                            // 126
        css: Match.Optional(String),                                                                             // 127
        scss: Match.Optional(String)                                                                             // 128
      }));                                                                                                       // 125
                                                                                                                 //
      try {                                                                                                      // 131
        var content = html;                                                                                      // 132
                                                                                                                 //
        if (template.css) {                                                                                      // 134
          var css = Utils.readFile(template.css);                                                                // 135
          content = juice.inlineContent(content, css, juiceOpts);                                                // 136
        }                                                                                                        // 137
                                                                                                                 //
        if (template.scss) {                                                                                     // 139
          var scss = Utils.toCSS(template.scss);                                                                 // 140
          content = juice.inlineContent(content, scss, juiceOpts);                                               // 141
        }                                                                                                        // 142
                                                                                                                 //
        return content;                                                                                          // 144
      } catch (ex) {                                                                                             // 146
        Utils.Logger.error('Could not add CSS to ' + template.name + ': ' + ex.message, TAG);                    // 147
        return html;                                                                                             // 148
      }                                                                                                          // 149
    }                                                                                                            // 150
                                                                                                                 //
    return addStylesheets;                                                                                       // 67
  }(),                                                                                                           // 67
  addDoctype: function () {                                                                                      // 152
    function addDoctype(html) {                                                                                  // 67
      return '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n' + html;
    }                                                                                                            // 154
                                                                                                                 //
    return addDoctype;                                                                                           // 67
  }(),                                                                                                           // 67
  readFile: function () {                                                                                        // 156
    function readFile(relativePathFromApp) {                                                                     // 67
      var file = Path.join(ROOT, relativePathFromApp);                                                           // 157
                                                                                                                 //
      try {                                                                                                      // 159
        return fs.readFileSync(file, {                                                                           // 160
          encoding: 'utf8'                                                                                       // 161
        });                                                                                                      // 160
      } catch (ex) {                                                                                             // 163
        throw new Meteor.Error(500, 'Could not find file: ' + file, ex.message);                                 // 164
      }                                                                                                          // 165
    }                                                                                                            // 166
                                                                                                                 //
    return readFile;                                                                                             // 67
  }(),                                                                                                           // 67
                                                                                                                 //
                                                                                                                 //
  // Take a path to a SCSS file and compiles it to CSS with `node-sass`.                                         // 168
  toCSS: function () {                                                                                           // 169
    function toCSS(scss) {                                                                                       // 67
      if (!sass) {                                                                                               // 170
        var packageToRecommend = isModernMeteor ? 'Please run `meteor npm install --save node-sass` in your app to add sass support.' : 'Please run `meteor add chrisbutler:node-sass` to add sass support.';
                                                                                                                 //
        Utils.Logger.warn('Could not find sass module. Sass support is opt-in since lookback:emails@0.5.0.\n\n' + packageToRecommend, TAG);
        return Utils.readFile(scss);                                                                             // 178
      }                                                                                                          // 179
                                                                                                                 //
      var file = Path.join(ROOT, scss);                                                                          // 181
                                                                                                                 //
      try {                                                                                                      // 183
        return sass.renderSync({                                                                                 // 184
          file: file,                                                                                            // 185
          sourceMap: false                                                                                       // 186
        }).css.toString();                                                                                       // 184
      } catch (ex) {                                                                                             // 188
        console.error('Sass failed to compile: ' + ex.message);                                                  // 189
        console.error('In ' + (ex.file || scss) + ' at line ' + ex.line + ', column ' + ex.column);              // 190
        return '';                                                                                               // 191
      }                                                                                                          // 192
    }                                                                                                            // 193
                                                                                                                 //
    return toCSS;                                                                                                // 67
  }()                                                                                                            // 67
};                                                                                                               // 67
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"template-helpers.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/lookback_emails/lib/template-helpers.js                                                              //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
// # Template helpers                                                                                            // 1
//                                                                                                               // 2
// Built-in template helpers.                                                                                    // 3
TemplateHelpers = {                                                                                              // 4
  // `baseUrl` gives you a full absolute URL from a relative path.                                               // 5
  //                                                                                                             // 6
  //     {{ baseUrl '/some-path' }} => http://root-domain.com/some-path                                          // 7
  baseUrl: function () {                                                                                         // 8
    function baseUrl(path) {                                                                                     // 4
      return Utils.joinUrl(Mailer.settings.baseUrl, path);                                                       // 9
    }                                                                                                            // 10
                                                                                                                 //
    return baseUrl;                                                                                              // 4
  }(),                                                                                                           // 4
                                                                                                                 //
                                                                                                                 //
  // `emailUrlFor` takes an Iron Router route (with optional params) and                                         // 12
  // creates an absolute URL.                                                                                    // 13
  //                                                                                                             // 14
  //    {{ emailUrlFor 'myRoute' param='foo' }} => http://root-domain.com/my-route/foo                           // 15
  emailUrlFor: function () {                                                                                     // 16
    function emailUrlFor(routeName, params) {                                                                    // 4
      var theRouter = Package['iron:router'] ? Router : FlowRouter;                                              // 17
                                                                                                                 //
      if (theRouter && theRouter.path) {                                                                         // 19
        return Utils.joinUrl(Mailer.settings.baseUrl, theRouter.path.call(theRouter, routeName, params.hash));   // 20
      }                                                                                                          // 21
                                                                                                                 //
      Utils.Logger.warn('We noticed that neither Iron Router nor FlowRouter is installed, thus \'emailUrlFor\' can\'t render a path to the route \'' + routeName + '.');
      return '//';                                                                                               // 24
    }                                                                                                            // 25
                                                                                                                 //
    return emailUrlFor;                                                                                          // 4
  }()                                                                                                            // 4
};                                                                                                               // 4
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"routing.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/lookback_emails/lib/routing.js                                                                       //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
// # Routes                                                                                                      // 1
//                                                                                                               // 2
// This package supports browser routes, so you can **preview**                                                  // 3
// and **send email designs** from the browser.                                                                  // 4
                                                                                                                 //
// This function adds the `preview` route from a `template` object.                                              // 6
// It will apply the returned data from a `data` function on the                                                 // 7
// provided `route` prop from the template.                                                                      // 8
                                                                                                                 //
var CONTENT_TYPES = {                                                                                            // 10
  html: 'text/html',                                                                                             // 11
  text: 'text/plain'                                                                                             // 12
};                                                                                                               // 10
                                                                                                                 //
var arrayOrString = function arrayOrString(str) {                                                                // 15
  return Array.isArray(str) ? str : str.split(',');                                                              // 16
};                                                                                                               // 17
                                                                                                                 //
Routing = function Routing(template, settings, render, compile) {                                                // 19
  check(template, Object);                                                                                       // 20
  check(template.name, String);                                                                                  // 21
                                                                                                                 //
  if (template && !template.route) {                                                                             // 23
    Utils.Logger.info('Cannot set up route for \'' + template.name + '\' mailer template - missing \'route\' propery. See documentation.', 'mailer');
    return;                                                                                                      // 25
  }                                                                                                              // 26
                                                                                                                 //
  check(template.route.path, String);                                                                            // 28
  check(settings.routePrefix, String);                                                                           // 29
  check(render, Function);                                                                                       // 30
  check(compile, Function);                                                                                      // 31
                                                                                                                 //
  var previewAction = function previewAction(type) {                                                             // 33
    check(type, Match.OneOf('html', 'text'));                                                                    // 34
                                                                                                                 //
    return function (req, res, params, _) {                                                                      // 36
      var data = null;                                                                                           // 37
                                                                                                                 //
      try {                                                                                                      // 39
        data = template.route.data && template.route.data.call(res, params);                                     // 40
      } catch (ex) {                                                                                             // 41
        var msg = '';                                                                                            // 42
        var exception = 'Exception in ' + template.name + ' data function: ' + ex.message;                       // 43
                                                                                                                 //
        var func = template.route.data.toString();                                                               // 45
                                                                                                                 //
        if (func.indexOf('this.params') !== -1) {                                                                // 47
          msg = 'Seems like you\'re calling this.params in the data function for the template \'' + template.name + '\'. As of 0.7.0, this package doesn\'t use Iron Router for server side routing, and thus you cannot rely on its API.\n\nYou can access URL params with the new function signature:\n\n\tfunction data(params:object)\n\ninstead of using this.params. The function scope (this) is now an instance of NodeJS\'s http.ServerResponse.\n\nSee https://github.com/lookback/meteor-emails#version-history for more info.\n\nThe exception thrown was: ' + ex.message;
        } else if (func.indexOf('this.') !== -1 && Package['iron:router']) {                                     // 49
          msg = 'Seems like you\'re accessing \'this\' in the data function for \'' + template.name + '\'. As of 0.7.0, we\'ve removed Iron Router, and thus you cannot rely on its API.\n\nThe function scope is now an instance of NodeJS\'s http.ServerResponse.\n\nSee https://github.com/lookback/meteor-emails#version-history for more info.\n\nThe exception thrown was: ' + ex.message;
        } else {                                                                                                 // 51
          msg = exception;                                                                                       // 52
        }                                                                                                        // 53
                                                                                                                 //
        Utils.Logger.error(msg);                                                                                 // 55
        res.writeHead(500);                                                                                      // 56
        res.end(msg);                                                                                            // 57
      }                                                                                                          // 58
                                                                                                                 //
      // Compile, since we wanna refresh markup and CSS inlining.                                                // 60
      compile(template);                                                                                         // 61
                                                                                                                 //
      Utils.Logger.info('Rendering ' + template.name + ' as ' + type + '\u2026');                                // 63
                                                                                                                 //
      var content = '';                                                                                          // 65
                                                                                                                 //
      try {                                                                                                      // 67
        var html = render(template.name, data);                                                                  // 68
        content = type === 'html' ? html : Utils.toText(html, settings.plainTextOpts);                           // 69
        Utils.Logger.info('Rendering successful!');                                                              // 70
      } catch (ex) {                                                                                             // 71
        var _msg = 'Could not preview email: ' + ex.message;                                                     // 72
        Utils.Logger.error(_msg);                                                                                // 73
        content = _msg;                                                                                          // 74
      }                                                                                                          // 75
                                                                                                                 //
      res.writeHead(200, {                                                                                       // 77
        'Content-Type': CONTENT_TYPES[type]                                                                      // 78
      });                                                                                                        // 77
                                                                                                                 //
      return res.end(content, 'utf8');                                                                           // 81
    };                                                                                                           // 82
  };                                                                                                             // 83
                                                                                                                 //
  var sendAction = function sendAction(req, res, params, _) {                                                    // 85
    var _params$query = params.query;                                                                            // 85
    var _params$query$to = _params$query.to;                                                                     // 85
    var to = _params$query$to === undefined ? settings.testEmail : _params$query$to;                             // 85
    var cc = _params$query.cc;                                                                                   // 85
    var bcc = _params$query.bcc;                                                                                 // 85
                                                                                                                 //
                                                                                                                 //
    Utils.Logger.info('Sending ' + template.name + '\u2026');                                                    // 88
                                                                                                                 //
    if (to) {                                                                                                    // 90
      var data = null;                                                                                           // 91
                                                                                                                 //
      try {                                                                                                      // 93
        data = template.route.data && template.route.data.call(res, params);                                     // 94
      } catch (ex) {                                                                                             // 95
        Utils.Logger.error('Exception in ' + template.name + ' data function: ' + ex.message);                   // 96
        return;                                                                                                  // 97
      }                                                                                                          // 98
                                                                                                                 //
      var options = {                                                                                            // 100
        to: arrayOrString(to),                                                                                   // 101
        data: data,                                                                                              // 102
        template: template.name,                                                                                 // 103
        subject: '[TEST] ' + template.name                                                                       // 104
      };                                                                                                         // 100
                                                                                                                 //
      if (cc) {                                                                                                  // 107
        options.cc = arrayOrString(cc);                                                                          // 108
      }                                                                                                          // 109
                                                                                                                 //
      if (bcc) {                                                                                                 // 111
        options.bcc = arrayOrString(bcc);                                                                        // 112
      }                                                                                                          // 113
                                                                                                                 //
      var result = Mailer.send(options);                                                                         // 115
                                                                                                                 //
      var msg = '';                                                                                              // 117
                                                                                                                 //
      if (result === false) {                                                                                    // 119
        res.writeHead(500);                                                                                      // 120
        msg = 'Did not send test email, something went wrong. Check the logs.';                                  // 121
      } else {                                                                                                   // 122
        res.writeHead(200);                                                                                      // 123
        var reallySentEmail = !!process.env.MAIL_URL;                                                            // 124
        msg = reallySentEmail ? 'Sent test email to ' + to + (cc ? ' and cc: ' + cc : '') + (bcc ? ', and bcc: ' + bcc : '') : 'Sent email to STDOUT';
      }                                                                                                          // 128
                                                                                                                 //
      Utils.Logger.info(msg);                                                                                    // 130
      res.end(msg);                                                                                              // 131
    } else {                                                                                                     // 133
      res.writeHead(400);                                                                                        // 134
      res.end('No testEmail or ?to parameter provided.');                                                        // 135
    }                                                                                                            // 136
  };                                                                                                             // 137
                                                                                                                 //
  var types = {                                                                                                  // 139
    preview: previewAction('html'),                                                                              // 140
    text: previewAction('text'),                                                                                 // 141
    send: sendAction                                                                                             // 142
  };                                                                                                             // 139
                                                                                                                 //
  _.each(types, function (action, type) {                                                                        // 145
    var path = '/' + settings.routePrefix + '/' + type + template.route.path;                                    // 146
    var name = Utils.capitalizeFirstChar(template.name);                                                         // 147
    var routeName = String(type + name);                                                                         // 148
                                                                                                                 //
    Utils.Logger.info('Add route: [' + routeName + '] at path ' + path);                                         // 150
                                                                                                                 //
    Picker.route(path, function (params, req, res) {                                                             // 152
      return action(req, res, params, template);                                                                 // 152
    });                                                                                                          // 152
  });                                                                                                            // 153
};                                                                                                               // 154
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"mailer.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/lookback_emails/lib/mailer.js                                                                        //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
// `lookback:emails` is a small package for Meteor which helps you                                               // 1
// tremendously in the process of building, testing and debugging                                                // 2
// HTML emails in Meteor applications.                                                                           // 3
//                                                                                                               // 4
// See the [GitHub repo](https://github.com/lookback/meteor-emails) for README.                                  // 5
// Made by Johan Brook for [Lookback](https://github.com/lookback).                                              // 6
                                                                                                                 //
                                                                                                                 //
var TAG = 'mailer';                                                                                              // 9
                                                                                                                 //
// ## Setup                                                                                                      // 11
                                                                                                                 //
// Main exported symbol with some initial settings:                                                              // 13
//                                                                                                               // 14
// - `routePrefix` is the top level path for the preview and send routes (see further down).                     // 15
// - `baseUrl` is what root domain to base relative paths from.                                                  // 16
// - `testEmail`, when testing emails, set this variable.                                                        // 17
// - `logger`, optionally inject an external logger. Defaults to `console`.                                      // 18
// - `disabled`, optionally disable the actual email sending. Useful for E2E testing.                            // 19
//    Defaults to `false`.                                                                                       // 20
// - `addRoutes`, should we add preview and send routes? Defaults to `true` in development.                      // 21
Mailer = {                                                                                                       // 22
  settings: {                                                                                                    // 23
    silent: false,                                                                                               // 24
    routePrefix: 'emails',                                                                                       // 25
    baseUrl: process.env.ROOT_URL,                                                                               // 26
    testEmail: null,                                                                                             // 27
    logger: console,                                                                                             // 28
    disabled: false,                                                                                             // 29
    addRoutes: process.env.NODE_ENV === 'development',                                                           // 30
    language: 'html',                                                                                            // 31
    plainText: true,                                                                                             // 32
    plainTextOpts: {},                                                                                           // 33
    juiceOpts: {                                                                                                 // 34
      preserveMediaQueries: true,                                                                                // 35
      removeStyleTags: true,                                                                                     // 36
      webResources: {                                                                                            // 37
        images: false                                                                                            // 38
      }                                                                                                          // 37
    }                                                                                                            // 34
  },                                                                                                             // 23
                                                                                                                 //
  middlewares: [],                                                                                               // 43
                                                                                                                 //
  use: function () {                                                                                             // 45
    function use(middleware) {                                                                                   // 22
      if (!_.isFunction(middleware)) {                                                                           // 46
        console.error('Middleware must be a function!');                                                         // 47
      } else {                                                                                                   // 48
        this.middlewares.push(middleware);                                                                       // 49
      }                                                                                                          // 50
                                                                                                                 //
      return this;                                                                                               // 52
    }                                                                                                            // 53
                                                                                                                 //
    return use;                                                                                                  // 22
  }(),                                                                                                           // 22
  config: function () {                                                                                          // 55
    function config(newSettings) {                                                                               // 22
      this.settings = _.extend(this.settings, newSettings);                                                      // 56
      return this;                                                                                               // 57
    }                                                                                                            // 58
                                                                                                                 //
    return config;                                                                                               // 22
  }()                                                                                                            // 22
};                                                                                                               // 22
                                                                                                                 //
// # The factory                                                                                                 // 61
//                                                                                                               // 62
// This is the "blueprint" of the Mailer object. It has the following interface:                                 // 63
//                                                                                                               // 64
// - `precompile`                                                                                                // 65
// - `render`                                                                                                    // 66
// - `send`                                                                                                      // 67
//                                                                                                               // 68
// As you can see, the mailer takes care of precompiling and rendering templates                                 // 69
// with data, as well as sending emails from those templates.                                                    // 70
var factory = function factory(options) {                                                                        // 71
  check(options, Match.ObjectIncluding({                                                                         // 72
    // Mailer *must* take a `templates` object with template names as keys.                                      // 73
    templates: Object,                                                                                           // 74
    // Take optional template helpers.                                                                           // 75
    helpers: Match.Optional(Object),                                                                             // 76
    // Take an optional layout template object.                                                                  // 77
    layout: Match.Optional(Match.OneOf(Object, Boolean))                                                         // 78
  }));                                                                                                           // 72
                                                                                                                 //
  var settings = _.extend({}, Mailer.settings, options.settings);                                                // 81
                                                                                                                 //
  var blazeHelpers = typeof Blaze !== 'undefined' ? Blaze._globalHelpers : {};                                   // 83
  var globalHelpers = _.extend({}, TemplateHelpers, blazeHelpers, options.helpers);                              // 84
                                                                                                                 //
  Utils.setupLogger(settings.logger, {                                                                           // 86
    suppressInfo: settings.silent                                                                                // 87
  });                                                                                                            // 86
                                                                                                                 //
  // Use the built-in helpers, any global Blaze helpers, and injected helpers                                    // 90
  // from options, and *additional* template helpers, and apply them to                                          // 91
  // the template.                                                                                               // 92
  var addHelpers = function addHelpers(template) {                                                               // 93
    check(template.name, String);                                                                                // 94
    check(template.helpers, Match.Optional(Object));                                                             // 95
    return Template[template.name].helpers(_.extend({}, globalHelpers, template.helpers));                       // 96
  };                                                                                                             // 97
                                                                                                                 //
  // ## Compile                                                                                                  // 99
  //                                                                                                             // 100
  // Function for compiling a template with a name and path to                                                   // 101
  // a HTML file to a template function, to be placed                                                            // 102
  // in the Template namespace.                                                                                  // 103
  //                                                                                                             // 104
  // A `template` must have a path to a template HTML file, and                                                  // 105
  // can optionally have paths to any SCSS and CSS stylesheets.                                                  // 106
  var compile = function compile(template) {                                                                     // 107
    check(template, Match.ObjectIncluding({                                                                      // 108
      path: String,                                                                                              // 109
      name: String,                                                                                              // 110
      scss: Match.Optional(String),                                                                              // 111
      css: Match.Optional(String),                                                                               // 112
      layout: Match.Optional(Match.OneOf(Boolean, {                                                              // 113
        name: String,                                                                                            // 114
        path: String,                                                                                            // 115
        scss: Match.Optional(String),                                                                            // 116
        css: Match.Optional(String)                                                                              // 117
      }))                                                                                                        // 113
    }));                                                                                                         // 108
                                                                                                                 //
    var content = null;                                                                                          // 121
                                                                                                                 //
    try {                                                                                                        // 123
      content = Utils.readFile(template.path);                                                                   // 124
    } catch (ex) {                                                                                               // 125
      Utils.Logger.error('Could not read template file: ' + template.path, TAG);                                 // 126
      return false;                                                                                              // 127
    }                                                                                                            // 128
                                                                                                                 //
    var layout = template.layout || options.layout;                                                              // 130
                                                                                                                 //
    if (layout && template.layout !== false) {                                                                   // 132
      var layoutContent = Utils.readFile(layout.path);                                                           // 133
      SSR.compileTemplate(layout.name, layoutContent, {                                                          // 134
        language: settings.language                                                                              // 135
      });                                                                                                        // 134
                                                                                                                 //
      addHelpers(layout);                                                                                        // 138
    }                                                                                                            // 139
                                                                                                                 //
    // This will place the template function in                                                                  // 141
    //                                                                                                           // 142
    //     Template.<template.name>                                                                              // 143
    var tmpl = SSR.compileTemplate(template.name, content, {                                                     // 144
      language: settings.language                                                                                // 145
    });                                                                                                          // 144
                                                                                                                 //
    // Add helpers to template.                                                                                  // 148
    addHelpers(template);                                                                                        // 149
    return tmpl;                                                                                                 // 150
  };                                                                                                             // 151
                                                                                                                 //
  // ## Render                                                                                                   // 153
  //                                                                                                             // 154
  // Render a template by name, with optional data context.                                                      // 155
  // Will compile the template if not done already.                                                              // 156
  var render = function render(templateName, data) {                                                             // 157
    check(templateName, String);                                                                                 // 158
    check(data, Match.Optional(Object));                                                                         // 159
                                                                                                                 //
    var template = _.findWhere(options.templates, {                                                              // 161
      name: templateName                                                                                         // 162
    });                                                                                                          // 161
                                                                                                                 //
    if (!(templateName in Template)) {                                                                           // 165
      compile(template);                                                                                         // 166
    }                                                                                                            // 167
                                                                                                                 //
    var tmpl = Template[templateName];                                                                           // 169
                                                                                                                 //
    if (!tmpl) {                                                                                                 // 171
      throw new Meteor.Error(500, 'Could not find template: ' + templateName);                                   // 172
    }                                                                                                            // 173
                                                                                                                 //
    var rendered = SSR.render(tmpl, data);                                                                       // 175
    var layout = template.layout || options.layout;                                                              // 176
                                                                                                                 //
    if (layout && template.layout !== false) {                                                                   // 178
      var preview = null;                                                                                        // 179
      var css = null;                                                                                            // 180
                                                                                                                 //
      // When applying to a layout, some info from the template                                                  // 182
      // (like the first preview lines) needs to be applied to the                                               // 183
      // layout scope as well.                                                                                   // 184
      //                                                                                                         // 185
      // Thus we fetch a `preview` helper from the template or                                                   // 186
      // `preview` prop in the data context to apply to the layout.                                              // 187
      if (tmpl.__helpers.has('preview')) {                                                                       // 188
        preview = tmpl.__helpers.get('preview');                                                                 // 189
      } else if (data.preview) {                                                                                 // 190
        preview = data.preview;                                                                                  // 191
      }                                                                                                          // 192
                                                                                                                 //
      // The `extraCSS` property on a `template` is applied to                                                   // 194
      // the layout in `<style>` tags. Ideal for media queries.                                                  // 195
      if (template.extraCSS) {                                                                                   // 196
        try {                                                                                                    // 197
          css = Utils.readFile(template.extraCSS);                                                               // 198
        } catch (ex) {                                                                                           // 199
          Utils.Logger.error('Could not add extra CSS when rendering ' + templateName + ': ' + ex.message, TAG);
        }                                                                                                        // 202
      }                                                                                                          // 203
                                                                                                                 //
      var layoutData = _.extend({}, data, {                                                                      // 205
        body: rendered,                                                                                          // 206
        css: css,                                                                                                // 207
        preview: preview                                                                                         // 208
      });                                                                                                        // 205
                                                                                                                 //
      rendered = SSR.render(layout.name, layoutData);                                                            // 211
      rendered = Utils.addStylesheets(template, rendered, settings.juiceOpts);                                   // 212
      rendered = Utils.addStylesheets(layout, rendered, settings.juiceOpts);                                     // 213
    } else {                                                                                                     // 214
      rendered = Utils.addStylesheets(template, rendered, settings.juiceOpts);                                   // 215
    }                                                                                                            // 216
                                                                                                                 //
    rendered = Utils.addDoctype(rendered);                                                                       // 218
    return rendered;                                                                                             // 219
  };                                                                                                             // 220
                                                                                                                 //
  // ## Send                                                                                                     // 222
  //                                                                                                             // 223
  // The main sending-email function. Takes a set of usual email options,                                        // 224
  // including the template name and optional data object.                                                       // 225
  var sendEmail = function sendEmail(sendOptions) {                                                              // 226
    check(sendOptions, {                                                                                         // 227
      to: Match.OneOf(String, [String]),                                                                         // 228
      subject: String,                                                                                           // 229
      template: String,                                                                                          // 230
      cc: Match.Optional(Match.OneOf(String, [String])),                                                         // 231
      bcc: Match.Optional(Match.OneOf(String, [String])),                                                        // 232
      replyTo: Match.Optional(Match.OneOf(String, [String])),                                                    // 233
      from: Match.Optional(String),                                                                              // 234
      data: Match.Optional(Object),                                                                              // 235
      headers: Match.Optional(Object),                                                                           // 236
      attachments: Match.Optional([Object])                                                                      // 237
    });                                                                                                          // 227
                                                                                                                 //
    var defaults = {                                                                                             // 240
      from: settings.from                                                                                        // 241
    };                                                                                                           // 240
                                                                                                                 //
    if (settings.replyTo) {                                                                                      // 244
      defaults.replyTo = settings.replyTo;                                                                       // 245
    }                                                                                                            // 246
                                                                                                                 //
    // `template` isn't part of Meteor's `Email.send()` API, so omit this.                                       // 248
    var opts = _.omit(_.extend({}, defaults, sendOptions), 'template', 'data');                                  // 249
                                                                                                                 //
    // Render HTML with optional data context and optionally                                                     // 251
    // create plain-text version from HTML.                                                                      // 252
    try {                                                                                                        // 253
      opts.html = render(sendOptions.template, sendOptions.data);                                                // 254
      if (settings.plainText) {                                                                                  // 255
        opts.text = Utils.toText(opts.html, settings.plainTextOpts);                                             // 256
      }                                                                                                          // 257
    } catch (ex) {                                                                                               // 258
      Utils.Logger.error('Could not render email before sending: ' + ex.message, TAG);                           // 259
      return false;                                                                                              // 260
    }                                                                                                            // 261
                                                                                                                 //
    try {                                                                                                        // 263
      if (!settings.disabled) {                                                                                  // 264
        Email.send(opts);                                                                                        // 265
      }                                                                                                          // 266
                                                                                                                 //
      return true;                                                                                               // 268
    } catch (ex) {                                                                                               // 269
      Utils.Logger.error('Could not send email: ' + ex.message, TAG);                                            // 270
      return false;                                                                                              // 271
    }                                                                                                            // 272
  };                                                                                                             // 273
                                                                                                                 //
  var init = function init() {                                                                                   // 275
    if (options.templates) {                                                                                     // 276
      _.each(options.templates, function (template, name) {                                                      // 277
        template.name = name;                                                                                    // 278
        compile(template);                                                                                       // 279
                                                                                                                 //
        Mailer.middlewares.forEach(function (func) {                                                             // 281
          func(template, settings, render, compile);                                                             // 282
        });                                                                                                      // 283
      });                                                                                                        // 284
    }                                                                                                            // 285
  };                                                                                                             // 286
                                                                                                                 //
  return {                                                                                                       // 288
    precompile: compile,                                                                                         // 289
    render: render,                                                                                              // 290
    send: sendEmail,                                                                                             // 291
    init: init                                                                                                   // 292
  };                                                                                                             // 288
};                                                                                                               // 294
                                                                                                                 //
// Init routine. We create a new "instance" from the factory.                                                    // 296
// Any middleware needs to be called upon before we run the                                                      // 297
// inner `init()` function.                                                                                      // 298
Mailer.init = function (opts) {                                                                                  // 299
  var obj = _.extend(this, factory(opts));                                                                       // 300
                                                                                                                 //
  if (obj.settings.addRoutes) {                                                                                  // 302
    obj.use(Routing);                                                                                            // 303
  }                                                                                                              // 304
                                                                                                                 //
  obj.init();                                                                                                    // 306
};                                                                                                               // 307
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/lookback:emails/lib/utils.js");
require("./node_modules/meteor/lookback:emails/lib/template-helpers.js");
require("./node_modules/meteor/lookback:emails/lib/routing.js");
require("./node_modules/meteor/lookback:emails/lib/mailer.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['lookback:emails'] = {}, {
  Mailer: Mailer
});

})();

//# sourceMappingURL=lookback_emails.js.map
