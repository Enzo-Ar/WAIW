import { login } from "../model/apiModel.js";
import ParamsError from '../exceptions/ParamsError.js';
import QueryError from '../exceptions/QueryError.js';
import RequestError from "../exceptions/RequestError.js";
import NotFoundError from "../exceptions/NotFoundError.js";

export const postLoginUser = async (req, res) => {
    try {
        const logged = await login(req.body.email, req.body.senha);
        res.status(200).json({"logged": logged});
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