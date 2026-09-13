class NotFoundError extends Error {
    constructor(mensagem) {
        super(mensagem);
        this.name = 'NotFoundError';
    };
};

export default NotFoundError;