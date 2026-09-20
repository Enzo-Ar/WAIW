import { getRows, getUser, insertUser, insertRefresh } from "../model/apiModel.js";
import ParamsError from '../exceptions/ParamsError.js';
import QueryError from '../exceptions/QueryError.js';
import RequestError from "../exceptions/RequestError.js";

import { addDays } from "date-fns";
import { createAccess, createRefresh } from "../helpers/createToken.js";
import hashToken from "../helpers/tokenHash.js";

export const postRegisterUser = async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const pssw = req.body.senha;

    try {
        const duplicate = await getRows(email);

        if (duplicate.rows.length !== 0) {
            throw new RequestError("Email do usuario já está em uso");
        }

        await insertUser(username, email, pssw);
        const user = await getUser(email);
        //creation of JWT
        const accessToken = createAccess(user.id, user.role);
        const refreshToken = createRefresh(user.id, user.role);

        const createdAt = new Date();
        const expireAt = addDays(createdAt, 30);

        const token_hash = hashToken(refreshToken);
        await insertRefresh(user.id, false, expireAt, createdAt, token_hash);

        res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000, sameSite: 'strict'});
        res.status(200).json({accessToken});
    } catch(err) {
        if (err instanceof ParamsError) {
            console.log(err);
            res.status(400).json({"erro": "ParamsError"});
        } else if (err instanceof RequestError) {
            console.log(err)
            res.status(400).json({"erro": "ExistsUser"});
        } else if (err instanceof QueryError) {
            console.log(err);
            res.status(500).json({"erro": "ServerSide"});
        }
    }
};