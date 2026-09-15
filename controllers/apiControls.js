import { getAll, getById, signup, login } from "../model/apiModel.js";
import ParamsError from '../exceptions/ParamsError.js';
import NotFoundError from '../exceptions/NotFoundError.js';
import QueryError from '../exceptions/QueryError.js';
import RequestError from "../exceptions/RequestError.js";

export const getData = async (req, res) => {
    const tipo = req.params.tipo;

    try {
        const result = await getAll(tipo);
        res.status(200).json(result);
    } catch(err) {
        console.log(err);
        if (err instanceof NotFoundError) {
            res.sendStatus(404);
        } else if (err instanceof ParamsError) {
            res.sendStatus(400);
        } else if (err instanceof QueryError) {
            res.sendStatus(500);
        }
    }
};

export const getSingular = async (req, res) => {
    const tipo = req.params.tipo;
    const id = req.params.id;

    try {
        const result = await getById(tipo, id);
        res.status(200).json(result);
    } catch(err) {
        console.log(err);
        if (err instanceof NotFoundError) {
            res.sendStatus(404);
        } else if (err instanceof ParamsError) {
            res.sendStatus(400);
        } else if (err instanceof QueryError) {
            res.sendStatus(500);
        }
    }
};

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


export const postLoginUser = async (req, res) => {
    try {
        const logged = await login(req.body.email, req.body.senha);
        res.status(200).json({"logged": logged});
    } catch(err) {
        if (err instanceof ParamsError) {
            console.log(err);
            res.status(400).json({"erro": "ParamsError"});
        } else if (err instanceof RequestError) {
            console.log(err)
            res.status(401).json({"erro": "NoAuth"});
        } else if (err instanceof QueryError) {
            console.log(err);
            res.status(500).json({"erro": "ServerSide"});
        }
    }
};