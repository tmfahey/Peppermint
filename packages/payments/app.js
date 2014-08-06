'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Payments = new Module('payments');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Payments.register(function(app, auth, database) {

    //We enable routing. By default the Package Object is passed to the routes
    Payments.routes(app, auth, database);

    //We are adding a link to the main menu for all authenticated users
 

    Payments.angularDependencies(['multi-select']);
    Payments.aggregateAsset('css','angular-multi-select.css');


    /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Payments.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Payments.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Payments.settings(function(err, settings) {
        //you now have the settings object
    });
    */
  Payments.aggregateAsset('css', 'payments.css');

    return Payments;
});
