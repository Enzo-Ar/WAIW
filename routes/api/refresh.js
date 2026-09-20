import * as express from 'express';
import handleRefreshToken from '../../controllers/refreshTokenControls.js';
const router = express.Router();

router.route('/')
    .post(handleRefreshToken);

export default router;