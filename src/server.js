/*
START HERE
NOTE:
Don't forget to implement user authentication for the
contact resource
*/
// require('dotenv').config()

import fs from 'fs';
import path from 'path';
require('dotenv').config({ path: path.resolve(__dirname + '/../.env') });
import express from 'express';
import expressWinston from 'express-winston';
import bodyParser from 'body-parser';
import winston from 'winston';
import logger from './utils/logger';

const app = express();

const port = process.env.PORT || 3001;
const env = process.env.NODE_ENV;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressWinston.logger({
	transports: [
		new winston.transports.Console({
			json: true,
			colorize: true
		})
	],
	meta: true, // optional: control whether you want to log the meta data about the request (default to true)
	msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
	expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
	colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
	ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
}));

//==================================================
// Setting up Cross Origin Resource Sharing
//==================================================
app.use( ( req, res, next ) => {
  res.header( "Access-Control-Allow-Origin", "*" );
  res.header( "Access-Control-Allow-Credentials", true );
  res.header( "Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH" );
  res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Authorization, Content-Type, Accept, X-Auth-Token' );

  next();
} );

app.listen(port, err => {
	if (err) {
		logger.error(err);
		process.exit(1);
	}
	require('./utils/db');

	fs.readdirSync(path.join(__dirname, 'resources')).map(file => {
		require('./resources/' + file)(app);
	});

	logger.info(
		`app is now running on port ${port} in ${env} mode`
	);
});

export default app;