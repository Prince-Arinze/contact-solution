import dotenv from 'dotenv';
import { validateUser } from '../utils/validate';
import User from '../entities/user';
import logger from '../utils/logger';
import { mailer } from '../utils/mailer';

import { createAccessToken, createRefreshToken } from '../utils/generateTokens';


dotenv.config()

/**
 * Given a json request 
 * {"username": "<...>", "password": "<...>"}
 * Verify the user is valid and return some authentication token
 * which can be used to verify protected resources
 * {"user": <{...}>, "token": "<...>""}
 */
export const login = async (req, res) => {
	try {
			const { username, password } = req.body;
			if(!username || !password) return res.status(400).json({err: "Username and password are required" });

			const user = await User.findOne({ username });
			if(!user) res.status(400).json({err: "This user doesn't exist."});
			
			const  { _id, email, name } = user;

			const access_token = createAccessToken({id: _id}, {expiresIn: '1d'});
			const refresh_token = createRefreshToken({id: _id}, {expiresIn: '7d'});
			
			// save the token in the cookie
			res.cookie("token", refresh_token );
			// set the token as the value of x-auth-token in the header and send the token and 
			return res.header("authorization", access_token ).json({ 	msg: "Login was successful!", access_token, refresh_token, user: { email, name, username }});

		
	} catch (error) {
		console.log(error);
		logger.error(error.message)
	}

};

export const signup = async (req, res) => {
	try {

		const { email, username, password, name } = req.body;
		const errMsg = validateUser(email, username, password, name);

		if(errMsg) return res.status(400).json({err: errMsg});
         
		const isUser = await User.findOne({ email });

		if(isUser) return res.status(400).json({err: `User with this email:${email} already exists.`});

		const user = new User({
			email,
			username,
			password,
			name
		});
		await user.save();
		res.json({msg: "Registration was successful!", user})
		
	} catch (error) {
		logger.error(error.message)
	}

};

/**
 * Implement a way to recover user accounts
 */
 export const forgotPassword = async (req, res) => {

	try {
		const { email } = req.body;

	if (!email) return res.status(400).json({ error: "Account email is required" });

		let user = await User.findOne({ email });

		const { _id } = user;

		if (!user) return res.status(400).json({ error: "User not found" });

		const access_token = createAccessToken({id: _id}, {expiresIn: '15m'});

		user.resetToken = access_token;

		const updatedUser = await user.save();
		if (!updatedUser) return res.status(400).json({ error: "Operation failed. Please try again" });

		const link = `http://${req.headers.host}/resetPassword/${access_token}`;

		const from = process.env.MAILER_EMAIL;
		const subject = "Password Reset Request";
		const to = user.email;
		const text = "Groove Platform test";
		const html = `
		  <div style="display: flex; justify-content: center; align-items: center; background-color: gray; flex-direction: column; padding: 2rem; color: #000000;">
		       <p>Hi ${user.name} </p>
			   <p>	You sent a password reset request. Please click on the following link <a href="#!"  style="color: blue;">${link}</a> to reset your password. </p> 	
			   If this request wasn't authorized by you, kindly ignore this email.
		  </div>
		`;

		const data = {
			from,
			to,
			subject,
			text,
			html
		}

		return mailer(data, res);
		
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
	// res.status(404).json({ err: "not implemented" })
};

export default {
	login,
	signup,
	forgotPassword
}