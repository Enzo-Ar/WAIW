import * as express from 'express';
import { getData, getSingular } from '../../controllers/apiControls.js';
const router = express.Router();

router.route('/:tipo')
    .get(getData);

router.route('/:tipo/:id')
    .get(getSingular);

export default router;