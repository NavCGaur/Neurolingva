import express from 'express';
import { getQuestions, submitAnswers } from '../controllers/questionController.js';

const router = express.Router();

router.get('/', getQuestions);
router.post('/submit', submitAnswers);

export default router;
