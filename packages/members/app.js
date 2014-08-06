'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Members = new Module('members');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Members.register(function(app, auth, database) {

    //We enable routing. By default the Package Object is passed to the routes
    Members.routes(app, auth, database);


    Members.aggregateAsset('css', 'members.css');

    /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Members.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Members.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Members.settings(function(err, settings) {
        //you now have the settings object
    });
    */

    return Members;
});
