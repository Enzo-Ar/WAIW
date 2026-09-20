import hashToken from "../helpers/tokenHash.js";
import { deleteRefresh } from "../model/apiModel.js";

const handleLogout = async (req, res) => {
    const refreshCookie = req.cookies.jwt;
    const hashedToken = hashToken(refreshCookie);
    await deleteRefresh(hashedToken);
    res.cookie('jwt', refreshCookie, {httpOnly: true, maxAge: 0, sameSite: 'strict'});
    res.status(200).end();
}

export default handleLogout;