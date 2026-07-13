import express from 'express';
import form from '../controllers/form.controller.js';

const router = express.Router();

router.get('/form', form.getForm);
router.post('/form', form.createForm);

export default router;