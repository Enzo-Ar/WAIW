import ParamsError from '../exceptions/ParamsError.js';
import QueryError from '../exceptions/QueryError.js';
import RequestError from "../exceptions/RequestError.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import { getCate, insertInCat } from '../model/apiModel.js';

export const insertCatalogue = async (req, res) => {
    const title = req.body.titulo;
    const tipo = req.body.tipo;
    const nota = req.body.nota;
    const temp = req.body.temp;
    const ep = req.body.Ep;
    const generos = req.body.categorias;
    const data = req.body.data;
    const comentario = req.body.comentario;

    console.log(title);
    console.log(tipo);
    console.log(nota);
    console.log(data);
    console.log(comentario);
    console.log(generos);

    if (!title || !tipo || !nota || !data || !comentario) {
        res.status(400).json({"erro": "ParamsError"});
    }

    try {
        //await insertInCat(title, tipo, nota, temp, ep, data, comentario);
    } catch(err) {
        
    }
}

export const getCategorys = async (req, res) => {
    try {
        const categorys = await getCate();
        res.status(200).json(categorys);
    } catch(err) {
        res.sendStatus(500);
    }
}