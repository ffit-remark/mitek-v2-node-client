const express = require('express');
let router = express.Router();

const env_controller   = require('../controllers/envController.js');
const auth_controller  = require('../controllers/authController.js');
const tiden_controller = require('../controllers/tidenController.js');

const appConfig        = require('../lib/app-config.js');

// GET home page.
router.get('/', (req, res, next) => {
  const envList = appConfig.current.getEnvNames();
  res.render('home', { title: 'Tiden API Client', environments: envList });
});

// POST the token for the account user and scope
router.post( '/token/:env', auth_controller.token_post );
router.get( '/token/:env', ( req, res ) => {
  console.log( 'Got here via "next()"' )
  res.end();
});
// POST request for getting a verify result
router.post( '/tiden/verify/:env', tiden_controller.verify_post );

// GET a description of the endpoint
router.get( '/tiden/verify/about', tiden_controller.verify_about );


//router.post( '/tiden/env', env_controller.env_set );

// GET a listing of the configured environments
router.get( '/tiden/env/list', env_controller.env_list );

// GET the settings of the configured environments
router.get( '/tiden/env/:env', env_controller.env_about ); // Buy Name

module.exports = router;
