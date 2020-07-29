/**
 * Tiden Dossier Client
 * @module tiden-dossier-client
 */

/**
 * Module dependencies.
 * @private
 */

var Request = require('request');
//var FS      = require('fs');
//var Path    = require('path');

/**
 * Module exports.
 * @public
 */

module.exports = TidenDossierClient;


/**
 * The client object that can call Tiden 'Identity Server'
 * 
 * @param {string} url - The locator for the service to call.
 */

function TidenDossierClient( url ) {
  if (!(this instanceof TidenDossierClient))
    return new TidenDossierClient( url );

  this.url = url;
}

/**
 * Writes the dossier response to a .json file in the output folder
 * @param {string} access_token - A valid token restrieved by the token funtion
 * @param {string} req_json - The full request body as a stringified JSON.
 */

TidenDossierClient.prototype.postDossier = function ( access_token, req_json, callback ) {

  let options = {
    url: this.url,
    headers: { 
      'Content-Type': 'application/json',
      Authorization: ['Bearer', access_token].join(' ')
    },
    body: req_json
  };

  Request.post( options, ( error, response, body ) => {

    let result = {};

    if ( !error ) {
      if ( response.statusCode === 201 )
        result = JSON.parse(body);
      else
        error = `HTTP response ${response.statusCode} - ${JSON.parse(body).error}`;
    }
    callback( error, result );

  });
};

/**
 * Writes the dossier response to a .json file in the output folder
 * @param {string} dossierId - The key for the dossier results to retreive
 * @param {string} access_token - A valid token restrieved by the token funtion
 * @param {string} outputDir - Where to write the JSON file.
 * @param {boolean} [filenameIsRefId] - Option to name the output file after the customerReferenceId. Default: dossierId is the filename.


TidenDossierClient.prototype.getDossier = function ( dossierId, access_token, outputDir, filenameIsRefId = false ) {

  if ( !FS.existsSync(outputDir) )
    try { 
      FS.mkdirSync(outputDir); }
    finally {}

  var getOptions = {
    url: [this.url, dossierId].join('/'),
    headers:
      { Authorization: ['Bearer', access_token].join(' ') }
  }
  
  Request.get(getOptions, function (error, response, body) {

    if (error)
      throw new Error(error);

    var pFormat = {
      dir: outputDir,
      name: dossierId,
      ext: '.json'
    };

    if (filenameIsRefId) {
      var oBody = JSON.parse(body);
      if (oBody.dossierMetadata) {
        pFormat.name = oBody.dossierMetadata;
      }
    }
    
    FS.writeFile( Path.format( pFormat ), body, function (err) { 
      if (err)
        console.log(`fs encountered an error: ${err}`);
      else
        console.log(`File Written at ${Path.format( pFormat )}` );
    });
  });
 
};
*/