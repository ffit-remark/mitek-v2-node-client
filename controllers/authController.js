const Async = require('async');

const appConfig   = require('../lib/app-config.js');
const authClient  = require('../lib/tiden-auth-client.js');

exports.token_post = ( req, res ) => {

  let config = appConfig.current.getEnvSettings( req.params.env );
  
  config.creds.id = req.body.clientId;
  config.creds.secret = req.body.clientSecret;

  Async.waterfall( [
    ( callback ) => {
      callback( null, authClient( config.authApi.tokenUrl ) );
    },
    ( tokenGetter, callback ) => {
      tokenGetter.submitCreds( config.creds, config.authApi.scopes, callback );
    }
  ],
  ( err, result ) => {
    if (err) {
      console.log( `Tiden token request unsuccessful. ${err}` );
      res.locals.message = err.message;
      res.locals.error = {};

      // render the error page
      res.status( err.status || 400 );
      res.send('error');
    }
    else 
      res.send(result);

  });

};
