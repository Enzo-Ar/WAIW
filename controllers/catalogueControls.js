import ParamsError from '../exceptions/ParamsError.js';
import QueryError from '../exceptions/QueryError.js';
import RequestError from "../exceptions/RequestError.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import { getCate, getIdByName, insertCatAndGenre } from '../model/apiModel.js';

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
        let queryUrl;
        let params;

        let genreQueryUrl;
        if (tipo === "filmes") {
            queryUrl = "INSERT INTO filmes(nome, data_assistido, nota, comentario, poster) VALUES($1, $2, $3, $4, $5)"
            params = [title, data, nota, comentario, poster];

            genreQueryUrl = "INSERT INTO filmes_generos(filme_id, gen_id) VALUES($1, $2)";
        } else if (tipo === "series") {
            queryUrl = "INSERT INTO series(nome, data_assistido, p_temp, p_ep, nota, comentario, poster, concluido) VALUES($1, $2, $3, $4, $5, $6, $7, $8)"
            params = [title, data, temp, ep, nota, comentario, poster, conc];

            genreQueryUrl = "INSERT INTO series_generos(serie_id, gen_id) VALUES($1, $2)";
        } else if (tipo === "cartoons") {
            queryUrl = "INSERT INTO cartoons(nome, data_assistido, p_temp, p_ep, nota, comentario, poster, concluido) VALUES($1, $2, $3, $4, $5, $6, $7, $8)"
            params = [title, data, temp, ep, nota, comentario, poster, conc];

            genreQueryUrl = "INSERT INTO cartoons_generos(cartoon_id, gen_id) VALUES($1, $2)";
        } else {
            throw new ParamsError('tipo não existente');
        }
        await insertCatAndGenre(queryUrl, params) //query para a tabela do tipo em si
        const newId = await getIdByName(title, tipo);
        for (const gen_id of generos) {
            await insertCatAndGenre(genreQueryUrl, [newId, gen_id]);
        }
        res.status(200).json({"msg": "all went well"});
    } catch(err) {
        if (err instanceof ParamsError) {
            res.status(400).json({"erro": "ParamsError"});
        } else if (err instanceof RequestError) {
            res.status(400).json({"erro": "AlreadyExists"});
        } else if (err instanceof NotFoundError) {
            res.status(500).json({"erro": "NotIncludedRight"});
        } else {
            console.log(err);
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