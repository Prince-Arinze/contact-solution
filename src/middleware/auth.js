import dotenv from 'dotenv';

import jwt from 'jsonwebtoken';
// import User from '../entities/user';

dotenv.config()


const auth = async (req, res, next) => {
    try {
        const token = req.header("authorization");
        if(!token) return res.status(403).json({err: 'Access denied.'});
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if(!decoded) return res.status(400).json({err: 'Invalid token'});
        req.user = decoded;
        next();
    } catch (err) {
        res.status(500).json({err: error.message})
    }


    // const user = await User.findOne({_id: decoded.id});

    // return { user: user._id };
}

export default auth;