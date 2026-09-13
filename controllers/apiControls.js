import { getAll, getById } from "../model/apiModel.js";
import ParamsError from '../exceptions/ParamsError.js';
import NotFoundError from '../exceptions/NotFoundError.js';
import QueryError from '../exceptions/QueryError.js';

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