import ParamsError from '../exceptions/ParamsError.js';
import QueryError from '../exceptions/QueryError.js';
import RequestError from "../exceptions/RequestError.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import { insertInCat } from '../model/apiModel.js';

export const insertCatalogue = async (req, res) => {
    const title = req.body.titulo;
    const tipo = req.body.slcs;
    const nota = req.body.nota;
    const temp = req.body.temp;
    const ep = req.body.Ep;
    const data = req.body.data;
    const comentario = req.body.comentario;

    console.log(tipo);

    if (!title || !tipo || !nota || !data || !comentario) {
        res.status(400).json({"erro": "ParamsError"});
    }

    try {
        await insertInCat(title, tipo, nota, temp, ep, data, comentario);
    } catch(err) {
        console.log(err);
    }
}