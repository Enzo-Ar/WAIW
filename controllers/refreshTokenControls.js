import jwt from 'jsonwebtoken';
import { createAccess } from '../helpers/createToken.js';
import hashToken from '../helpers/tokenHash.js';
import { getRefresh } from '../model/apiModel.js';
import RequestError from '../exceptions/RequestError.js';

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401);

    try {
        const refreshToken = cookies.jwt;
        const hashedToken = hashToken(refreshToken);

        const dbRefreshToken = await getRefresh(hashedToken);
        if (dbRefreshToken.revoked) {
            throw new RequestError("Token já foi revogado");
        }
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded_token) => {
                if (err || decoded_token.user_id !== dbRefreshToken.user_id) return res.sendStatus(403);
                const accessToken = createAccess(decoded_token.user_id, decoded_token.role);
                res.status(200).json({accessToken});
            }
        )
    } catch(err) {
        if (err instanceof RequestError) {
            throw err;
        }
        throw err;
    }
}

export default handleRefreshToken;