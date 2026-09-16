import * as express from 'express';
import { postLoginUser } from '../../controllers/authControls.js';
const router = express.Router();

router.route('/')
    .post(postLoginUser);

export default router;