'use strict';

module.exports = {
  db: 'mongodb://localhost/mean-dev',
  app: {
    name: 'Peppermint - Group Payment Collection'
  },
  facebook: {
    clientID: 'APP_ID',
    clientSecret: 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  twitter: {
    clientID: 'CONSUMER_KEY',
    clientSecret: 'CONSUMER_SECRET',
    callbackURL: 'http://localhost:3000/auth/twitter/callback'
  },
  github: {
    clientID: 'APP_ID',
    clientSecret: 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/github/callback'
  },
  google: {
    clientID: 'APP_ID',
    clientSecret: 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  linkedin: {
    clientID: 'API_KEY',
    clientSecret: 'SECRET_KEY',
    callbackURL: 'http://localhost:3000/auth/linkedin/callback'
  },
  venmo: {
    clientID: 'ADD VENMOID HERE',
    clientSecret: 'ADD VENMO SECRET HERE',
    callbackURL: 'YOURURL/auth/venmo/callback'
  },
  emailFrom: 'none@gmail.com', // sender address like ABC <abc@example.com>
  mailer: {
    service: 'none',
    auth: {
      user: 'none@gmail.com',
      pass: '!'
    }
  }
};
