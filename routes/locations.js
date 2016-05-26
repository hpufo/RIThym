var express = require('express');
var router = express.Router();
var https = require("https");

var monk = require('monk');
var db = monk('localhost:27017/RIThym');

// api/locations/ displays all the location documents
router.get('/', function(req, res){
    var collection = db.get('locations');
    collection.find({}, function(err, locations){       //Get all the records in locations
        if(err) throw err;
        res.json(locations);                            //Adds the records to the response
    });
});

//Creating a new location
router.post('/',function(req,res){
    //ToDo: server side validation
    var collection = db.get('locations');
        
    collection.insert({
        name: req.body.name,
        address: req.body.address,
        location: req.body.location,
        cost: req.body.cost,
        practices: req.body.practices,
        notes: req.body.notes
    },
    function(err, location){
        console.log(err);
        if(err) throw err;
        
        res.json(location);
    });
});

//Sends a single location by id
router.get('/:id', function(req, res){
    var collection = db.get('locations');
    collection.findOne({_id: req.params.id}, function(err, location){
        if(err) throw err;
        
        res.json(location);
    });
});

//Updates the document by id
router.put('/:id', function(req, res){
    var collection = db.get('locations');
    collection.update({
        _id: req.params.id
    },
    {
        name: req.body.name,
        address: req.body.address,
        location: req.body.location,
        cost: req.body.cost,
        practices: req.body.practices,
        notes: req.body.notes
    },
    function(err, location){
        if (err) throw err;
        
        res.json(location);
    });//update
});

//Delete
router.delete('/:id', function(req, res){
    var collection = db.get('location');
    collection.remove({_id: req.params.id}, 
    function(err, location){
        if(err) throw err;
        
        res.json(location);
    });
});//*/
module.exports = router;