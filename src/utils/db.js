import mongoose from 'mongoose';
import logger from './logger'

mongoose.Promise = global.Promise;

const env = process.env.NODE_ENV;

let uri;

if (env === "test") {
	uri = process.env.TEST_DB;
} else {
	uri = process.env.DEV_DB;
}
const connection = mongoose.connect(uri, {
	useCreateIndex: true,
	useFindAndModify: false,
	useNewUrlParser: true,
	useUnifiedTopology: true
});

connection
	.then(db => {
		logger.info(
			`Successfully connected to ${uri} MongoDB cluster in ${
			env
			} mode.`,
		);
		return db;
	})
	.catch(err => {
		if (err.message.code === 'ETIMEDOUT') {
			logger.info('Attempting to re-establish database connection.');
			mongoose.connect(uri);
		} else {
			logger.error('Error while attempting to connect to database:');
			logger.error(err);
		}
	});

export default connection;
