import exApp from 'express';
import * as express from 'express';
import * as path from 'path';

import rootRouter from './routes/root.js';

const PORT = process.env.PORT || 8080;
const app = exApp();
const dirname = import.meta.dirname;

app.use(express.urlencoded());
app.use(express.json());

app.use('/', (req, res, next) => {
    const extension = path.extname(path.basename(req.path));
    if (['.css', '.png', '.ico', '.jpg', '.webp', '.js', '.jpeg', '.jfif'].includes(extension)) {
        const thePath = path.join(path.basename(path.dirname(req.path)), path.basename(req.path));
        res.status(200).sendFile(path.join(dirname, 'public', thePath));
    } else {
        next();
    }
})

app.use('/', rootRouter);


app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server running on PORT: ${PORT}`);
})