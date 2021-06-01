let express = require('express');
let router = express.Router();

// For the Data Model
let TripSchema = require('../models/trips');


function HandleError(response, reason, message, code){
    console.log('ERROR: ' + reason);
    response.status(code || 500).json({"error:": message});
}

router.post('/', (request, response, next) => {
    let newTrip = request.body;
    //console.log(request.body);
    if (!newTrip.tripName || !newTrip.tripDate || !newTrip.trashGallon){
        HandleError(response, 'Missing Info', 'Form data missing', 500);
    }else{
        let trip = new TripSchema({
            tripName: newTrip.tripName,
            tripDate: newTrip.tripDate,
            tripDuration: newTrip.tripDuration,
            trashGallon: newTrip.trashGallon,
            trashLog: newTrip.trashLog,
        });
        trip.save((error) => {
            if (error){
                response.send({"error": error});
            }else{
                response.send({"id": trip.id});
            }
        });
    }
});

router.get('/', (request, response, next) => {
    let tripName = request.query['tripName'];
    if (tripName){
        TripSchema
            .find({"tripName": tripName})
            .exec( (error, trips) => {
                if (error){
                    response.send({"error": error});
                }else{
                    response.send(trips);
                }
            });
    }else{
        TripSchema
            .find()
            .exec( (error, trips) => {
                if (error){
                    response.send({"error": error});
                }else{
                    response.send(trips);
                }
            });
    }
});

router.delete('/:tripName', (request, response, next) =>{
    TripSchema
        .findOne({"tripName": request.params.tripName}, (error, result)=>{
            if (error) {
                response.status(500).send(error);
            }else if (result){
                result.remove((error)=>{
                    if (error){
                        response.status(500).send(error);
                    }
                    response.send({"deleted trip": request.params.tripName});
                });
            }else{
                response.status(404).send({"trip": request.params.tripName, "error":  "Not Found"});
            }
        });
});


    module.exports = router;

