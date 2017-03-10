(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var Google = Package.google.Google;
var Q = Package['mrt:q'].Q;
var Accounts = Package['accounts-base'].Accounts;
var _ = Package.underscore._;

/* Package-scope variables */
var wrapAsync, GoogleApi, httpVerbs;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                   //
// packages/percolate_google-api/utils.js                                                            //
//                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                     //
// wrap an async function for client + server.
//
// 1. if callback is provided, simply provide the async version
//
// 2i. else on the server, run sync
// 2ii. else on the client, return a promise

var wrap = Meteor.wrapAsync || Meteor._wrapAsync;

wrapAsync = function(fn) {
  return function(/* arguments */) {
    var args = _.toArray(arguments);
    if (_.isFunction(args[args.length - 1])) {
      return fn.apply(this, args);
    } else {
      if (Meteor.isClient) {
        return Q.nfapply(_.bind(fn, this), args);
      } else {
        return wrap(fn).apply(this, args);
      }
    }
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                   //
// packages/percolate_google-api/google-api-async.js                                                 //
//                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                     //
// kill logs
var Log = function () {}

GoogleApi = {
  // host component, shouldn't change
  _host: 'https://www.googleapis.com',

  _callAndRefresh: function(method, path, options, callback) {
    var self = this;
    options = options || {};

    self._call(method, path, options,
      // need to bind the env here so we can do mongo writes in the callback
      // (when refreshing), if we call this on the server
      Meteor.bindEnvironment(function(error, result) {
        if (error && error.response && error.response.statusCode == 401) {
          Log('google-api attempting token refresh');

          return self._refresh(options.user, function(error) {
            if (error)
              return callback(error);

            // if we have the user, we'll need to re-fetch them, as their
            // access token will have changed.
            if (options.user)
              options.user = Meteor.users.findOne(options.user._id);

            self._call(method, path, options, callback);
          });
        } else {
          callback(error, result);
        }
    }, 'Google Api callAndRefresh'));
  },

  // call a GAPI Meteor.http function if the accessToken is good
  _call: function(method, path, options, callback) {
    Log('GoogleApi._call, path:' + path);

    // copy existing options to modify
    options = _.extend({}, options)
    var user = options.user || Meteor.user();
    delete options.user;

    if (user && user.services && user.services.google &&
        user.services.google.accessToken) {
      options.headers = options.headers || {};
      options.headers.Authorization = 'Bearer ' + user.services.google.accessToken;

      HTTP.call(method, this._host + '/' + path, options, function(error, result) {
        callback(error, result && result.data);
      });
    } else {
      callback(new Meteor.Error(403, "Auth token not found." +
        "Connect your google account"));
    }
  },

  _refresh: function(user, callback) {
    Log('GoogleApi._refresh');

    Meteor.call('exchangeRefreshToken', user && user._id, function(error, result) {
      callback(error, result && result.access_token)
    });
  }
}

// setup HTTP verbs
httpVerbs = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
_.each(httpVerbs, function(verb) {
  GoogleApi[verb.toLowerCase()] = wrapAsync(function(path, options, callback) {
    if (_.isFunction(options)) {
      callback = options;
      options = {};
    }

    return this._callAndRefresh(verb, path, options, callback);
  })
});

///////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                   //
// packages/percolate_google-api/google-api-methods.js                                               //
//                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                     //
Meteor.methods({
  // Obtain a new access token using the refresh token
  exchangeRefreshToken: function(userId) {
    this.unblock();
    
    if (this.connection) {  //when called from client
      if (this.userId) {
        userId = this.userId;
      } else {
        throw new Meteor.Error(403, "Must be signed in to use Google API.");
      } 
    }
    
    var user;
    if (userId && Meteor.isServer) {
      user = Meteor.users.findOne({_id: userId});
    } else {
      user = Meteor.user();
    }

    var config = Accounts.loginServiceConfiguration.findOne({service: "google"});
    if (! config)
      throw new Meteor.Error(500, "Google service not configured.");

    if (! user.services || ! user.services.google || ! user.services.google.refreshToken)
      throw new Meteor.Error(500, "Refresh token not found.");
    
    try {
      var result = Meteor.http.call("POST",
        "https://accounts.google.com/o/oauth2/token",
        {
          params: {
            'client_id': config.clientId,
            'client_secret': config.secret,
            'refresh_token': user.services.google.refreshToken,
            'grant_type': 'refresh_token'
          }
      });
    } catch (e) {
      var code = e.response ? e.response.statusCode : 500;
      throw new Meteor.Error(code, 'Unable to exchange google refresh token.', e.response)
    }
    
    if (result.statusCode === 200) {
      // console.log('success');
      // console.log(EJSON.stringify(result.data));

      Meteor.users.update(user._id, { 
        '$set': { 
          'services.google.accessToken': result.data.access_token,
          'services.google.expiresAt': (+new Date) + (1000 * result.data.expires_in),
        }
      });

      return result.data;
    } else {
      throw new Meteor.Error(result.statusCode, 'Unable to exchange google refresh token.', result);
    }
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['percolate:google-api'] = {}, {
  GoogleApi: GoogleApi
});

})();
