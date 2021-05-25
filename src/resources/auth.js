import { signup, login, forgotPassword } from '../controllers/auth'

module.exports = app => {
	app.route('/auth/login').post(login);
	app.route('/auth/signup').post(signup);

	/*** BONUS POINTS ***/
	app.route('/auth/forgotPassword').post(forgotPassword);
};
