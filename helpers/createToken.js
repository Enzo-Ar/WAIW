import jwt from "jsonwebtoken";
import 'dotenv/config'

export const createAccess = (user, userRole) => {
    return jwt.sign(
        {user_id: user, role: userRole},
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '1m'
        }
    );
}

export const createRefresh = (user, userRole) => {
    return jwt.sign(
        {user_id: user, role: userRole},
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: '30d'
        }
    );
}