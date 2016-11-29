var express = require('express');
var router = express.Router();

const time_service = require('./../services/time.service');

/**
 * Convert date from location
 */
router.post('/date/convert-by-location', function(req, res, next) {
  time_service.convertDateByCountryCode(req, function(err, result){
    if ( err ) {
      res.status(500).json(err);
    }
    return res.json(result);
  });
});

/**
 * Get Country and City zone name
 */
router.post('/date/get-zone-name', function(req, res, next) {
  time_service.getCountryZoneByCountryCode(req, function(err, result){
    if ( err ) {
      res.status(500).json(err);
    }
    return res.json(result);
  });
});

module.exports = router;
