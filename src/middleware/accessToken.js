import path from 'path';
require("dotenv").config({path: path.resolve(__dirname + '../../../.env')});
import jwt from 'jsonwebtoken';
import User from '../entities/user'
import { createAccessToken } from '../utils/generateTokens' 


export default async (req, res) => {
    try {
        const rf_token = req.cookies.token;
        if(!rf_token) return res.status(400).json({err: "You need to login!"});
        const result = jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET);
        if(!result) return res.status(400).json({err: "Your token is incorrect or has expired"});
        
        const user = await User.findById(result.id);
       
        if(!user) return res.status(400).json({err: "User does not exist."});

        const { _id, email, username, name} = user;

        const access_token = createAccessToken({id: _id});


        res.json({
            access_token,
            user: {
                name,
                email,
                email,
                username
            }
        })
    } catch (error) {
        return res.status(500).json({err: error.message})
    }
  
}