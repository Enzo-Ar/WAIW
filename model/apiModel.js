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
        throw new ParamsError("getAll: Tipo inexistente passado como parâmetro");
    } else {
        try {
            const result = await query(queryStr);
            if (result.rows.length === 0) {
                throw new NotFoundError("getAll: Falha na busca, resultado talvez inexistente");
            }
            return result.rows;
        } catch(err) {
            if(err instanceof NotFoundError) {
                throw err;
            } 
            throw new QueryError("getAll: Falha na Query", err);
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
        throw new ParamsError("getById: Tipo inexistente passado como parâmetro");
    } else {
        try {
            const result = await query(queryStr, replacers);
            if (result.rows.length === 0) {
                throw new NotFoundError("getById: Falha na busca, resultado talvez inexistente");
            }
            return result.rows;
        } catch(err) {
            if(err instanceof NotFoundError) {
                throw err;
            }
            throw new QueryError("getById: Falha na Query", err);
        }
    }
};

export const getIdByName = async (name, tipo) => {
    if (!name) {
        throw new ParamsError('getIdByName: Nenhum Nome passado para Procura');
    }

    try {
        let queryUrl
        if (tipo === "filmes") {
            queryUrl = 'SELECT id FROM filmes WHERE nome = $1';
        } else if (tipo === "series") {
            queryUrl = 'SELECT id FROM series WHERE nome = $1';
        } else {
            queryUrl = 'SELECT id FROM cartoons WHERE nome = $1';
        }
        const result = await query(queryUrl, [name]);
        
        if (result.rows.length === 0) {
            throw new NotFoundError('getIdByName: Not found by name to get id');
        }else if (result.rows.length > 1) {
            throw new RequestError('getIdByName: Already Exists in catalogue');
        }

        return result.rows[0].id;
    } catch(err) {
        if (err instanceof NotFoundError || err instanceof RequestError) {
            throw err;
        }
        throw new QueryError("getIdByName: Falha na Query", err);
    }
}  

export const insertFilme = async (title, data, nota, comentario, poster) => {
    if (!title || !data || !nota || !comentario || !poster) {
        throw new ParamsError('insertFilme: Faltando parametros');
    }

    try {
        const queryStr = "INSERT INTO filmes(nome, data_assistido, nota, comentario, poster) VALUES($1, $2, $3, $4, $5)";
        const params = [title, data, nota, comentario, poster];

        await query(queryStr, params);
        return;
    } catch(err) {
        throw new QueryError("insertFilme: Falha na Query", err);
    }
}

export const insertSerie = async (title, data, temp, ep, nota, comentario, poster, conc) => {
    if (!title || !data || !nota || !comentario || !poster) {
        throw new ParamsError('insertSerie: Faltando parametros');
    }

    try {
        const queryStr = "INSERT INTO series(nome, data_assistido, p_temp, p_ep, nota, comentario, poster, concluido) VALUES($1, $2, $3, $4, $5, $6, $7, $8)"
        const params = [title, data, temp, ep, nota, comentario, poster, conc];

        await query(queryStr, params);
        return;
    } catch(err) {
        throw new QueryError("insertSerie: Falha na Query", err);
    }
}

export const insertCartoon = async (title, data, temp, ep, nota, comentario, poster, conc) => {
    if (!title || !data || !nota || !comentario || !poster) {
        throw new ParamsError('insertCartoon: Faltando parametros');
    }

    try {
        const queryStr = "INSERT INTO cartoons(nome, data_assistido, p_temp, p_ep, nota, comentario, poster, concluido) VALUES($1, $2, $3, $4, $5, $6, $7, $8)"
        const params = [title, data, temp, ep, nota, comentario, poster, conc];

        await query(queryStr, params);
        return;
    } catch(err) {
        throw new QueryError("insertCartoon: Falha na Query", err);
    }
}

export const insertGeneric = async (queryStr, params) => {
    try {
        await query(queryStr, params);
    } catch(err) {
        throw new QueryError("insertGeneric: Falha na Query", err);
    }
}

export const updateMidias = async (id, titulo, tipo, nota, data, temp, ep, conc, comentario, poster) => {
    if (!id || !titulo || !tipo || !nota || !data || !temp || !ep || !comentario || !poster) {
        throw new ParamsError("Todos os parametros são obrigatórios");
    }

    try {
        if (tipo === "filmes") {
            const params = [titulo, nota, data, comentario, poster, id];
            await query(`UPDATE filmes SET nome = $1, nota = $2, data_assistido = $3, comentario = $4, poster = $5 WHERE id = $6;`, params);
        } else if (tipo === "series" || tipo === "cartoons") {
            const params = [titulo, nota, data, temp, ep, conc, comentario, poster, id];
            await query(`UPDATE ${tipo} SET nome = $1, nota = $2, data_assistido = $3, p_temp = $4, p_ep = $5, concluido = $6, comentario = $7, poster = $8 WHERE id = $9`, params)
        }
        return;
    } catch(err) {
        throw new QueryError("updateCatalogue: Falha na Query", err);
    }
}

export const insertUser = async (username, email, pssw) => {
    if (!username || !email || !pssw) {
        throw new ParamsError("insertUser: Email, Senha e Username são obrigatorios");
    }

    try {
        const hashedpssw = await bcrypt.hash(pssw, 10);
        const role = "visitante";
        await query("INSERT INTO users(username, email, pssw, role) VALUES($1, $2, $3, $4);", [username, email, hashedpssw, role]);
    } catch(err) {
        if (err instanceof RequestError) {
            throw err;
        }
        throw new QueryError("insertUser: Falha na Query", err);
    }
}

export const getUser = async (email) => {
    if (!email) {
        throw new ParamsError("getUser: Email é obrigatorio para buscar usuario");
    }

    try {
        const user = await query("SELECT * FROM users WHERE email = $1", [email]);

        if (user.rows.length === 0) {
            throw new NotFoundError("getUser: Usuario Inexistente");
        }

        return user.rows[0];
    } catch(err) {
        if (err instanceof NotFoundError) {
            throw err;
        }
        throw new QueryError("getUser: Falha na Query", err);
    }
}

export const getRows = async (email) => {
    if (!email) throw new ParamsError("getRows: Email é obrigatorio para buscar rows");

    try {
        const result = await query("SELECT * FROM users WHERE email = $1", [email]);
        return result;
    } catch(err) {
        throw new QueryError("getRows: Falha na Query", err);
    }
}

export const insertRefresh = async (user_id, revoked, expireAt, createdAt, token_hash) => {
    if ( !user_id || revoked === null || !expireAt || !createdAt || !token_hash) {
        throw new ParamsError("insertRefresh: Sem Dados o suficiente");
    }

    try {
        const params = [user_id, revoked, expireAt, createdAt, token_hash];
        await query("INSERT INTO jwt_refresh(user_id, revoked, expires, created, token_hash) VALUES ($1, $2, $3, $4, $5)", params);
    } catch(err) {
        throw new QueryError("insertRefresh: Falha na Query", err);
    }
}

export const getRefresh = async (hashedToken) => {
    if (!hashedToken) {
        throw new ParamsError("getRefresh: Nenhum Token passado");
    }

    try{
        const result = await query('SELECT * FROM jwt_refresh WHERE token_hash = $1', [hashedToken]);

        if (result.rows.length === 0) {
            throw new NotFoundError("getRefresh: Token não existe");
        }

        return result.rows[0];
    } catch(err) {
        if (err instanceof NotFoundError) {
            throw err
        }
        console.log(err);
        throw new QueryError("getRefresh: Falha na Query", err);
    }
}

export const deleteRefresh = async (hashedToken) => {
    if (!hashedToken) {
        throw new ParamsError("deleteRefresh: Nenhum Token passado");
    }

    try{
        await query('DELETE FROM jwt_refresh WHERE token_hash = $1', [hashedToken]);
    } catch(err) {
        throw new QueryError("deleteRefresh: Falha na Query", err);
    }
}

export const getCate = async () => {
    try {
        const result = await query('SELECT * FROM generos');
        return result.rows
    } catch(err) {
        throw new QueryError('getCate: Falha na Query', err);
    }
}
