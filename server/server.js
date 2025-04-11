import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';

//import uploadWords from './utility/uploadwords.js'
import uploadQuizQuestion from './utility/uploadQuizQuestion.js'

import dotenv from 'dotenv';
dotenv.config();


import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import vocabRoutes from './routes/vocabRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import speechRoutes from './routes/speechRoutes.js';
import speechShadowRoutes from './routes/speechShadowRoutes.js';

// Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// CORS Configuration - Allow all origins & handle preflight requests
app.use(cors({
  origin: '*', // Accepts requests from any domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Explicitly handle preflight (OPTIONS) requests
app.options('*', cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/vocab', vocabRoutes)
app.use('/api/questions', questionRoutes);
app.use('/api/speech',speechRoutes);
app.use('/api/speechShadow',speechShadowRoutes);

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
