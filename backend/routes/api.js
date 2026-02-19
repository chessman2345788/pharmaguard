import express from 'express';
import multer from 'multer';
import { handleAnalysis, getDemoData, getAnalytics } from '../controllers/analysisController.js';
import { handleChat } from '../controllers/chatbotController.js';

const router = express.Router();
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.originalname.endsWith('.vcf')) {
      cb(null, true);
    } else {
      cb(new Error('Only .vcf files are allowed!'), false);
    }
  }
});

// Chatbot
router.post('/chatbot', handleChat);

// Analysis
router.post('/analyze', upload.single('file'), handleAnalysis);
router.get('/demo', getDemoData);
router.get('/analytics', getAnalytics);

export default router;
