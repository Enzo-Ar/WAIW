class RequestError extends Error {
    constructor(mensagem) {
        super(mensagem);
        this.name = 'RequestError';
    };
};

export default RequestError;