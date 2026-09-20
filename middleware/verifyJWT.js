import jwt from 'jsonwebtoken';

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);
    console.log(authHeader);
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded_token) => {
            if (err) return res.sendStatus(403);
            req.user_id = decoded_token.user_id;
            req.username = decoded_token.username;
            req.role = decoded_token.role;
            next();
        }
    )
}

export default verifyJWT;