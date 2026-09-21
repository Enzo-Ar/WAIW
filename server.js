import exApp from 'express';
import * as express from 'express';
import * as path from 'path';
import cookieParser from 'cookie-parser';

import rootRouter from './routes/root.js';
import apiRouter from './routes/api/api.js';
import registerRouter from './routes/api/register.js';
import authRouter from './routes/api/auth.js';
import refreshRouter from './routes/api/refresh.js';
import logoutRouter from './routes/api/logout.js';

const PORT = process.env.PORT || 8080;
const app = exApp();
const dirname = import.meta.dirname;

app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());

app.use('/', (req, res, next) => {
    const extension = path.extname(path.basename(req.path));
    if (['.css', '.png', '.ico', '.jpg', '.webp', '.js', '.jpeg', '.jfif'].includes(extension)) {
        const thePath = path.join(path.basename(path.dirname(req.path)), path.basename(req.path));
        res.status(200).sendFile(path.join(dirname, 'public', thePath));
    } else {
        next();
    }
});

app.use('/', rootRouter);
app.use('/register', registerRouter);
app.use('/login', authRouter);
app.use('/logout', logoutRouter);
app.use('/refresh', refreshRouter);

app.use('/api', apiRouter);

app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server running on PORT: ${PORT}`);
})