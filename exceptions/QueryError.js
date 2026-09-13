class QueryError extends Error {
    constructor(mensagem, OgError) {
        super(mensagem, {cause: OgError});
        this.name = 'QueryError';
    };
};

export default QueryError;