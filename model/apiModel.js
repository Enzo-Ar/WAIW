import { query } from '../config/db.js';
import ParamsError from '../exceptions/ParamsError.js';
import NotFoundError from '../exceptions/NotFoundError.js';
import QueryError from '../exceptions/QueryError.js';

export const getAll = async (tipo) => {
    const queryStr = tipo === "filmes" ? 'SELECT * FROM filmes;' : tipo === "series" ? 'SELECT * FROM series;' : tipo === "cartoons" ? "SELECT * FROM cartoons;" : null;
    
    if (!queryStr) {
        throw new ParamsError("Tipo inexistente passado como parâmetro");
    } else {
        try {
            const result = await query(queryStr);
            if (result.rows.length === 0) {
                throw new NotFoundError("Falha na busca, resultado talvex inexistente", err);
            }
            return result.rows;
        } catch(err) {
            if(err instanceof NotFoundError) {
                throw err;
            } else {
                throw new QueryError("Falha na Query", err);
            }
        }
    }
};

export const getById = async (tipo, id) => {
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
        queryStr = null;
    }
    const replacers = [id];

    if (!queryStr) {
        throw new ParamsError("Tipo inexistente passado como parâmetro");
    } else {
        try {
            const result = await query(queryStr, replacers);
            if (result.rows.length === 0) {
                throw new NotFoundError("Falha na busca, resultado talvez inexistente");
            }
            return result.rows;
        } catch(err) {
            if(err instanceof NotFoundError) {
                throw err;
            } 
            throw new QueryError("Falha na Query", err);
        }
    }
};