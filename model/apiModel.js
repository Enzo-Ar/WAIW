import { query } from '../config/db.js';
import ParamsError from '../exceptions/ParamsError.js';
import NotFoundError from '../exceptions/NotFoundError.js';
import QueryError from '../exceptions/QueryError.js';
import RequestError from '../exceptions/RequestError.js';

import * as bcrypt from 'bcrypt';
import 'dotenv/config';

export const getAll = async (tipo) => {
    const queryStr = tipo === "filmes" ? 'SELECT * FROM filmes;' : tipo === "series" ? 'SELECT * FROM series;' : tipo === "cartoons" ? "SELECT * FROM cartoons;" : null;
    
    if (!queryStr) {
        throw new ParamsError("Tipo inexistente passado como parâmetro");
    } else {
        try {
            const result = await query(queryStr);
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
    
}

// export const login = async (email, pssw) => {
//     try {
        
//     } catch(err) {
//         if (err instanceof RequestError || err instanceof NotFoundError) {
//             throw err;
//         }
//         throw new QueryError("Falha na Query", err);
//     }
// };

export const insertUser = async (username, email, pssw) => {
    if (!username || !email || !pssw) {
        throw new ParamsError("Email, Senha e Username são obrigatorios");
    }

    try {
        const hashedpssw = await bcrypt.hash(pssw, 10);
        const role = "visitante";
        await query("INSERT INTO users(username, email, pssw, role) VALUES($1, $2, $3, $4);", [username, email, hashedpssw, role]);
    } catch(err) {
        if (err instanceof RequestError) {
            throw err;
        }
        throw new QueryError("Falha na Query", err);
    }
}

export const getUser = async (email) => {
    if (!email) {
        throw new ParamsError("Email é obrigatorio para buscar usuario");
    }

    try {
        const user = await query("SELECT * FROM users WHERE email = $1", [email]);

        if (user.rows.length === 0) {
            throw new NotFoundError("Usuario Inexistente");
        }

        return user.rows[0];
    } catch(err) {
        if (err instanceof NotFoundError) {
            throw err;
        }
        throw new QueryError("Falha na Query", err);
    }
}

export const getRows = async (email) => {
    if (!email) throw new ParamsError("Email é obrigatorio para buscar rows");

    try {
        const result = await query("SELECT * FROM users WHERE email = $1", [email]);
        return result;
    } catch(err) {
        throw new QueryError("Falha na Query", err);
    }
}

export const insertRefresh = async (user_id, revoked, expireAt, createdAt, token_hash) => {
    if ( !user_id || revoked === null || !expireAt || !createdAt || !token_hash) {
        throw new ParamsError("Sem Dados o suficiente");
    }

    try {
        const params = [user_id, revoked, expireAt, createdAt, token_hash];
        await query("INSERT INTO jwt_refresh(user_id, revoked, expires, created, token_hash) VALUES ($1, $2, $3, $4, $5)", params);
    } catch(err) {
        throw new QueryError("Falha Query Insert", err);
    }
}

export const getRefresh = async (hashedToken) => {
    if (!hashedToken) {
        throw new ParamsError("Nenhum Token passado");
    }

    try{
        const result = await query('SELECT * FROM jwt_refresh WHERE token_hash = $1', [hashedToken]);

        if (result.rows.length === 0) {
            throw new NotFoundError("Token não existe");
        }

        return result.rows[0];
    } catch(err) {
        if (err instanceof NotFoundError) {
            throw err
        }
        console.log(err);
        throw new QueryError("Falha na Query", err);
    }
}

export const deleteRefresh = async (hashedToken) => {
    if (!hashedToken) {
        throw new ParamsError("Nenhum Token passado");
    }

    try{
        await query('DELETE FROM jwt_refresh WHERE token_hash = $1', [hashedToken]);
    } catch(err) {
        throw new QueryError("Falha na Query", err);
    }
}