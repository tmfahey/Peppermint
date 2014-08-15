'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module,
  favicon = require('serve-favicon'),
  express = require('express');

var System = new Module('system');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
System.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  System.routes(app, auth, database);


  // The middleware in config/express will run before this code

  // Set views path, template engine and default layout
  app.set('views', __dirname + '/server/views');

  // Setting the favicon and static folder
  app.use(favicon(__dirname + '/public/assets/img/favicon.ico'));

  // Adding robots and humans txt
  app.use(express.static(__dirname + '/public/assets/static'));

  System.menus.add({
    title: 'Dashboard',
    link: 'home',
    roles: ['authenticated'],
    menu: 'main'
  });

  System.menus.add({
    title: 'Members',
    link: 'members',
    roles: ['authenticated'],
    menu: 'main'
  });

  System.menus.add({
      title: 'Request Payments',
      link: 'payments',
      roles: ['authenticated'],
      menu: 'main'
  });

  System.aggregateAsset('css', 'common.css');
  






  return System;
});
