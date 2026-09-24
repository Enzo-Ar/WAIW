import ParamsError from '../exceptions/ParamsError.js';
import RequestError from "../exceptions/RequestError.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import { getCate, getIdByName, insertCartoon, insertFilme, insertGeneric, insertSerie } from '../model/apiModel.js';

export const insertCatalogue = async (req, res) => {
    const title = req.body.titulo;
    const tipo = req.body.tipo;
    const nota = req.body.nota;
    const temp = req.body.temp;
    const ep = req.body.ep;
    const concluido = req.body.concluido;
    const generos = req.body.categorias;
    const data = req.body.data;
    const comentario = req.body.comentario;
    const poster = req.body.poster;

    if (!title || !tipo || !nota || !data || !comentario || !poster) {
        return res.status(400).json({"erro": "ParamsError"});
    }

    let conc;
    if (concluido === "concluido") {
        conc = true;
    } else {
        conc = false;
    }

    try {
        let genreQueryStr;
        switch (tipo) {
            case "filmes":
                await insertFilme(title, data, nota, comentario, poster);
                genreQueryStr = "INSERT INTO filmes_generos(filme_id, gen_id) VALUES($1, $2)";
                break;

            case "series":
                await insertSerie(title, data, temp, ep, nota, comentario, poster, conc);
                genreQueryStr = "INSERT INTO series_generos(serie_id, gen_id) VALUES($1, $2)";
                break;
            
            case "cartoons":
                await insertCartoon(title, data, temp, ep, nota, comentario, poster, conc);
                genreQueryStr = "INSERT INTO cartoons_generos(cartoon_id, gen_id) VALUES($1, $2)";
                break;

            default:
                throw new ParamsError('insertCatalogue: tipo não existente');
        }

        const newId = await getIdByName(title, tipo);

        for (const gen_id of generos) {
            await insertGeneric(genreQueryStr, [newId, gen_id]);
        }

        res.status(200).json({"msg": "all went well"});
    } catch(err) {
        console.log(err);

        if (err instanceof ParamsError) {
            res.status(400).json({"erro": "ParamsError"});
        } else if (err instanceof RequestError) {
            res.status(400).json({"erro": "AlreadyExists"});
        } else if (err instanceof NotFoundError) {
            res.status(500).json({"erro": "NotIncludedRight"});
        } else {
            res.status(500).json({"erro": "QueryError"});
        }
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