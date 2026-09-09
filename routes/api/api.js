import * as express from 'express';
import { getData } from '../../controllers/apiControls.js';
const router = express.Router();

router.route('/:tipo')
    .get(getData);

export default router;