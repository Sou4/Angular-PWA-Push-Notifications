// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = 7070;        // set our port

//WEB-PUSH Setup
const webpush = require('web-push');

const vapidKeys = {
    "publicKey":"BE3KRLDGZjcW1U1F5b-GhOYPz5_Lt2QgHbPrOXgTIDOUpguTqIWL6FUSWkSTy9mhAjirIbfJUgMWBfRVF9rfNq0",
    "privateKey":"OLYrvN-aWYZim207Gb7sSXdGaeLSBIUcEfVDBg6hpoc"
};

webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

//To Store User Subscriptions
var USER_SUBSCRIPTIONS = [];

//All API's

//To store Push Subscription Object
// Add headers for 'access-control-allow-origin'
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

router.post('/addPushSubscriber', function(req, res) {
    const sub = req.body;
    console.log('Received Subscription on the server: ', sub);
    USER_SUBSCRIPTIONS.push(sub);
    res.status(200).json({message: "Subscription added successfully."});
});

//To get all stored Push Subscription Objects
router.get('/getAllPublishers', function(req, res) {
    res.status(200).send(USER_SUBSCRIPTIONS);  
});

//To send Notifications
// sample notification payload
var notificationPayload = {
    "notification": {
        "title": "Notification",
        "body": "Hell Everyone!!!",
        "icon": "assets/main-page-logo-small-hat.png",
        "vibrate": [100, 50, 100],
        "data": {
            "dateOfArrival": Date.now(),
            "primaryKey": 1
        },
        "actions": [{
            "action": "explore",
            "title": "Go to the site"
        }]
    }
};
router.post('/sendNotifications', function(req, res) {
    var notificationData = req.body;

    notificationPayload.notification.title = notificationData.titile;
    notificationPayload.notification.body = notificationData.desc;
    console.log("No. of subscribers : "+USER_SUBSCRIPTIONS.length);

    if(USER_SUBSCRIPTIONS.length > 0){
        Promise.all(USER_SUBSCRIPTIONS.map(sub => webpush.sendNotification(
            sub, JSON.stringify(notificationPayload) )))
            .then(() => res.status(200).json({message: 'Notifications sent successfully.'}))
            .catch(err => {
                console.error("Error sending notification, reason: ", err);
                res.sendStatus(500);
            });
    }else{
        res.status(200).json({message: 'No subscribers found'});
    }
    
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('use http://localhost:' + port);