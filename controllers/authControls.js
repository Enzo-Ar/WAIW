import { getUser, insertRefresh } from "../model/apiModel.js";
import ParamsError from '../exceptions/ParamsError.js';
import QueryError from '../exceptions/QueryError.js';
import RequestError from "../exceptions/RequestError.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import hashToken from "../helpers/tokenHash.js";
import { createAccess, createRefresh } from "../helpers/createToken.js";

import * as bcrypt from 'bcrypt';
import { addDays } from 'date-fns';

export const postLoginUser = async (req, res) => {
    try {
        const email = req.body.email;
        const pssw = req.body.senha;

        const user = await getUser(email);
        const match = await bcrypt.compare(pssw, user.pssw);
        if (match) {
            //creation of JWT
            const accessToken = createAccess(user.id, user.role);
            const refreshToken = createRefresh(user.id, user.role);

            const createdAt = new Date();
            const expireAt = addDays(createdAt, 30);

            const token_hash = hashToken(refreshToken);
            await insertRefresh(user.id, false, expireAt, createdAt, token_hash);

            res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000, sameSite: 'strict'});
            res.status(200).json({accessToken});
        } else {
            throw new RequestError("Senha Errada, Sem Autorização para entrar");
        }
    } catch(err) {
        console.log(err);
        if (err instanceof ParamsError) {
            res.status(400).json({"erro": "ParamsError"});
        } else if(err instanceof NotFoundError) {
            res.status(400).json({"erro": "NoUser"})
        } else if (err instanceof RequestError) {
            res.status(401).json({"erro": "NoAuth"});
        } else if (err instanceof QueryError) {
            res.status(500).json({"erro": "ServerSide"});
        }
    }
};