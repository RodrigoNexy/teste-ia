import { Router } from 'express';
import { GroqController } from '../controllers/groq.controller.js';

const router = Router();
const groqController = new GroqController();

router.post('/chat', groqController.chatCompletion.bind(groqController));
router.post('/completion', groqController.simpleCompletion.bind(groqController));

export { router as groqRoutes };

