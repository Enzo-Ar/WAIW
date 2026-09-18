import { query } from '../config/db.js';
import ParamsError from '../exceptions/ParamsError.js';
import NotFoundError from '../exceptions/NotFoundError.js';
import QueryError from '../exceptions/QueryError.js';
import RequestError from '../exceptions/RequestError.js';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {v4 as uuidv4} from 'uuid';
import { addDays } from 'date-fns';
import 'dotenv/config';

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

export const signup = async (username, email, pssw) => {
    if (!username || !email || !pssw) {
        throw new ParamsError("Email ou Senha são obrigatorios");
    }

    try {
        const duplicate = await query("SELECT * FROM users WHERE email = $1", [email]);

        if (duplicate.rows.length !== 0) {
            throw new RequestError("Email do usuario já está em uso");
        }

        const hashedpssw = await bcrypt.hash(pssw, 10);
        const role = "visitante";
        const ret = await query("INSERT INTO users(username, email, pssw, role) VALUES($1, $2, $3, $4) RETURNING id;", [username, email, hashedpssw, role]);

        console.log(`user created with id: ${ret}`);
    } catch(err) {
        if (err instanceof RequestError) {
            throw err;
        }
        throw new QueryError("Falha na Query", err);
    }
}

export const login = async (email, pssw) => {
    if (!email || !pssw) {
        throw new ParamsError("Email ou Senha são obrigatorios");
    }

    try {
        const checkUser = await query("SELECT * FROM users WHERE email = $1", [email]);

        if (checkUser.rows.length === 0) {
            throw new NotFoundError("Usuario Inexistente");
        }
        const match = await bcrypt.compare(pssw, checkUser.rows[0].pssw);
        if (match) {
            //creation of JWT
            const acessToken = jwt.sign(
                {userID: checkUser.rows[0].id, username: checkUser.rows[0].username, role: checkUser.rows[0].role},
                process.env.ACESS_TOKEN_SECRET,
                {
                    expiresIn: '15m'
                }
            );
            // const refreshToken = jwt.sign(
            //     {userID: checkUser.rows[0].id},
            //     process.env.REFRESH_TOKEN_SECRET,
            //     {
            //         expiresIn: '7d'
            //     }
            // );
            const createdAt = new Date();
            const expireAt = addDays(createdAt, 30);

            const paramsRefresh = [uuidv4(), checkUser.rows[0].id, , false, createdAt, expireAt];
            await query("INSERT INTO jwt_refresh VALUES ($1, $2, $3, $4, $5, $6)", paramsRefresh);
            return acessToken;
        } else {
            throw new RequestError("Senha Errada, Sem Autorização para entrar");
        }
    } catch(err) {
        if (err instanceof RequestError || err instanceof NotFoundError) {
            throw err;
        }
        throw new QueryError("Falha na Query", err);
    }
};