'use strict';

const Request = require('request');

/**
 * The client object that can call Tiden 'Identity Server'
 * 
 * @param {string} url - The locator for the service to call.
 */
function TidenAuthClient( endpointUrl ) {
    if ( !(this instanceof TidenAuthClient) )
        return new TidenAuthClient( endpointUrl );

    this.url = endpointUrl;
};

TidenAuthClient.BASE_SCOPE = ['global.identity.api'];

/**
 * Builds and calls the Tiden Identity Server token method.
 * @param {Object} credentials - The user name and secret key.
 * @param {string} credentials.id - Client ID.
 * @param {string} credentials.secret - Client Secret.  
 * @param {string[]} arrScope - An array of activity scopes excluding the base 'global.identity.api'.
 * @param {function} callback - A callback function to receive the token string.
 */
TidenAuthClient.prototype.submitCreds = function ( credentials={id,secret}, arrScope, callback ) {

    const options = {
        url: this.url,
        headers: {
            'Accept-Charset': 'UTF-8',
            'Content-Type': 'application/x-www-form-urlencoded' },
        form: {
            grant_type: 'client_credentials',
            client_id: credentials.id,
            client_secret: credentials.secret,
            scope: TidenAuthClient.BASE_SCOPE.concat( arrScope ).join(' ')
        } 
    };

    // Call the request
    Request.post( options, (error, response, body) => {
        
        let result = {};
        if ( !error ) {
            if ( response.statusCode === 200 )
                result = JSON.parse(body);
            else
                error = `HTTP response ${response.statusCode} - ${JSON.parse(body).error}`;
        }
        callback( error, result );
    });
};


TidenAuthClient.prototype.getUrl = function() {
    return this.url;
};

module.exports = TidenAuthClient;
