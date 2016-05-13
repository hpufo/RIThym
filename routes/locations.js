var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/RIThym');

// api/locations/
router.get('/', function(req, res){
    var collection = db.get('locations');
    collection.find({}, function(err, locations){       //Get all the records in locations
        if(err) throw err;
        res.json(locations);                            //Adds the records to the response
    });
});

module.exports = router;