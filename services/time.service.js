const moment = require('moment'),
      moment_timezone = require('moment-timezone'),
      _u = require('underscore'),
      csv_parse = require('csv-parse'),
      fs = require('fs'),
      path = require('path');


exports.convertDateByCountryCode = convertDateByCountryCode;
exports.getCountryZoneByCountryCode = getCountryZoneByCountryCode;


/////////

function convertDateByCountryCode(req, callback){
    var _body = req.body;
    if ( !_body.country_code )
        return callback('country code is required');

    if ( !_body.date )
        return callback('date is required');

    if (!moment(_body.date).isValid() )
        return callback('invalid date value : ' + _body.date);

    getZoneNameByCountryCode(_body.country_code, _body.city, function(err, zone_name){
        if ( err )
            return callback(err);
     
        var _format = "MM/DD/YYYY h:mm:ss a";
        var _converted_date = moment_timezone.tz(new Date(_body.date), zone_name).format(_format)
        var info = {
            zone_name : zone_name,
            system_zone_name : moment_timezone.tz.guess(),            
            old_date : _body.date,
            system_date : moment_timezone.tz(new Date(_body.date), moment_timezone.tz.guess()).format(_format),
            converted_date : _converted_date,
            utc_date : new Date(_body.date)
        }            

        return callback(null, info);
    });
}

function getCountryZoneByCountryCode(req, callback){
    var _body = req.body;
    if ( !_body.country_code )
        return callback('country code is required');
    getZoneNameByCountryCode(_body.country_code, _body.city, function(err, zone_name){
        if ( err )
            return callback(err);

        var result = {
            country_code : _body.country_code,
        }
        if ( _body.city  )
            result.city = _body.city;

        result.zone_name = zone_name;

        return callback(null, result);
    });
}


/*
    Simulate getting content from DB
*/
var _csv_locations = (process.cwd() + "/data/csv/timezone" );
var _zones;
function getZoneNameByCountryCode(country_code, _city, callback){

    if ( _zones ){ //cached content
        return getZoneByCountryCodeWorker(_zones, country_code, _city, callback);
    }
    
    var parser = csv_parse({}, function(err, data){
        if ( err ) 
            return callback(err);
        _zones = data;
        return getZoneByCountryCodeWorker(_zones, country_code, _city, callback);
    });

    fs.createReadStream(_csv_locations +'/zone.csv').pipe(parser);

}

function getZoneByCountryCodeWorker(_zones, country_code, city, callback){

    var _selected_zone_name;
    _u.each(_zones, function(_zone){
        var _zone_country_code = _zone[1];
        var _zone_name = _zone[2];
        if ( _zone_country_code.toLowerCase().trim() == country_code.toLowerCase().trim() 
              && ( !city || _zone_name.toLowerCase().indexOf(city.toLowerCase()) > -1 ) ) {
             _selected_zone_name = _zone_name;
             return "";
        }
    });

    if ( _selected_zone_name )
        return callback(null, _selected_zone_name);
    var _error_msg = "country code " + country_code; 
    if ( city )
        _error_msg += ' of city ' + city; 
    _error_msg += ' has no zone name';
    return callback(_error_msg);
}
