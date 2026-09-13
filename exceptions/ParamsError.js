class ParamsError extends Error {
    constructor(mensagem) {
        super(mensagem);
        this.name = 'ParamsError';
    };
};

export default ParamsError;