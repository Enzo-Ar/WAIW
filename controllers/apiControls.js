import { query, connect, end } from '../config/db.js';

export const getData = async (req, res) => {
    const tipo = req.params.tipo;
    const queryStr = tipo === "filmes" ? 'SELECT * FROM filmes;' : tipo === "series" ? 'SELECT * FROM series;' : tipo === "cartoons" ? "SELECT * FROM cartoons;" : "void";

    if (queryStr !== "void") {
        try {
            const result = await query(queryStr);
            res.status(200).json(result.rows);
        } catch(err) {
            console.error(err);
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(404);
    }
    
};

export const getSingular = async (req, res) => {
    const tipo = req.params.tipo;
    const id = req.params.id;
    let queryStr;
    if ( tipo === "filmes") {
        queryStr = `SELECT filmes.nome, filmes.data_assistido, filmes.nota, filmes.comentario, filmes.poster, array_agg(generos.nome_gen) AS generos FROM filmes
                    JOIN filmes_generos ON filmes_generos.filme_id = filmes.id
                    JOIN generos ON generos.id = filmes_generos.gen_id
                    WHERE filmes.id = $1
                    GROUP BY filmes.nome, filmes.data_assistido, filmes.nota, filmes.comentario, filmes.poster;`
    } else if ( tipo === "series") {
        queryStr = `SELECT series.nome, series.data_assistido, series.p_temp, series.p_ep, series.nota, series.comentario, series.poster, series.concluido, array_agg(generos.nome_gen) AS generos FROM series
                    JOIN series_generos ON series_generos.serie_id = series.id
                    JOIN generos ON generos.id = series_generos.gen_id
                    WHERE series.id = $1
                    GROUP BY series.nome, series.data_assistido, series.p_temp, series.p_ep, series.nota, series.comentario, series.poster, series.concluido;`
    } else if ( tipo === "cartoons") {
        queryStr = `SELECT cartoons.nome, cartoons.data_assistido, cartoons.p_temp, cartoons.p_ep, cartoons.nota, cartoons.comentario, cartoons.poster, cartoons.concluido, array_agg(generos.nome_gen) AS generos FROM cartoons
                    JOIN cartoons_generos ON cartoons_generos.cartoon_id = cartoons.id
                    JOIN generos ON generos.id = cartoons_generos.gen_id
                    WHERE cartoons.id = $1
                    GROUP BY cartoons.nome, cartoons.data_assistido, cartoons.p_temp, cartoons.p_ep, cartoons.nota, cartoons.comentario, cartoons.poster, cartoons.concluido;`
    }else {
        queryStr = undefined;
    }
    const replacers = [id];

    if (queryStr !== undefined) {
        try {
            const result = await query(queryStr, replacers);
            res.status(200).json(result.rows);
        } catch(err) {
            console.error(err);
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(404);
    }

}