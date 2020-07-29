const Async       = require('async');

const appConfig   = require('../lib/app-config.js');
const tidenClient = require('../lib/tiden-dossier-client.js');

exports.verify_post = ( req, res ) => {
  //res.send('You reached the Tiden client route');
  let config = appConfig.current.getEnvSettings( req.params.env );

  Async.waterfall( [
    ( callback ) => {
      callback( null, tidenClient( config.tidenApi.dossierUrl ) );
    },
    ( theClient, callback ) => {
      let tok = req.headers.authorization.split(' ')[1];
      theClient.postDossier( tok,  JSON.stringify( req.body ), callback );
    }
  ],
  ( err, result ) => {
    if (err)
      console.log( `Tiden verify request unsuccessful. ${err}` );
    else
      res.send(result);

  });

};

exports.verify_about = ( req, res ) => {
  res.send('/tiden/verify creates a dossier and returns the results from Mitek Mobile Verify.');
};
