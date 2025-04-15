import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';

//import uploadWords from './utility/uploadwords.js'
//import uploadQuizQuestion from './utility/uploadQuizQuestion.js'

import dotenv from 'dotenv';
dotenv.config();


import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import vocabRoutes from './routes/vocabRoutes.js';
import vocabQuestionRoutes from './routes/vocabQuestionRoutes.js';
import grammerQuestionRoutes from './routes/grammerQuestionRoutes.js';
import speechRoutes from './routes/speechRoutes.js';
import speechShadowRoutes from './routes/speechShadowRoutes.js';
import stripeRoutes from './routes/stripeRoutes.js';
import statRoutes from './routes/statRoutes.js';

// Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;



// Middleware
//app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// CORS Configuration - Allow all origins & handle preflight requests
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  credentials: true,
}));


app.options('*', cors());



app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Special raw body parser for Stripe webhooks
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));



// Add the raw body to the request object for Stripe webhook verification
app.use((req, res, next) => {
  if (req.originalUrl === '/api/stripe/webhook') {
    req.rawBody = req.body;
  }
  next(); 
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/vocab', vocabRoutes)
app.use('/api/vocab-questions', vocabQuestionRoutes);
app.use('/api/grammer-questions', grammerQuestionRoutes);
app.use('/api/speech',speechRoutes);
app.use('/api/speechShadow',speechShadowRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/stats', statRoutes);


if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(process.cwd(), 'client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'client/build', 'index.html'));
  });
}



console.log("Loaded vocab routes:", vocabRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//insert words into MongoDb
//uploadWords();
//uploadQuizQuestion();


export default app;
