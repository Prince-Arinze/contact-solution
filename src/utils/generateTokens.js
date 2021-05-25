import path from 'path';
require("dotenv").config({path: path.resolve(__dirname + '../../../.env')});
import jwt from 'jsonwebtoken';

export const createAccessToken = (payload, expires) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, expires)
}

export const createRefreshToken = (payload, expires) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, expires)
}