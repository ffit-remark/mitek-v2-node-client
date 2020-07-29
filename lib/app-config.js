'use strict';

const _       = require('lodash');
const fs      = require('fs');
const path    = require('path');

const fileName =  path.join( __dirname, '../lib/settings.json' );
const writeFileOpt = { 'mode': parseInt( '0600', 8 ) };

function ServConfig() {
  let self = this;
  self.data = {};
}


/**
 * Returns an array of the environment names. The first element is the default.
 */
_.assignIn( ServConfig.prototype, {

  save() {
    fs.writeFileSync( fileName, JSON.stringify( this.data, null, 4 ), writeFileOpt );
  },

  getEnvNames() {
    return _.orderBy(this.data.environments, 'isDefault', 'desc' ).map( confItem => confItem.name );
  },

  getEnvSettings( name='' ) {
    if ( !_.isEmpty( name ) 
        && !_.isUndefined( this.data.environments.find( config => config.name === name )  )  )
      return this.data.environments.find( config => config.name === name );
    else
      return this.data.environments.find( config => config.isDefault );
  }

});


function load() {
  let config = new ServConfig();

  if ( fs.existsSync( fileName ) ) {
    console.log( `The file '${fileName}' exists.` );
    config.data = JSON.parse( fs.readFileSync( fileName, 'utf8' ) );

    return config;
  }
  else {
    console.log( `The file '${fileName}' does not exist.` );
  }
}

let currentConfig = load();

_.assignIn( module.exports, { current: currentConfig } );
