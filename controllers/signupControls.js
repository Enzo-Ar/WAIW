import { signup } from "../model/apiModel.js";
import ParamsError from '../exceptions/ParamsError.js';
import QueryError from '../exceptions/QueryError.js';
import RequestError from "../exceptions/RequestError.js";

export const postRegisterUser = async (req, res) => {
    try {
        await signup(req.body.username, req.body.email, req.body.senha);
        res.status(200);
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