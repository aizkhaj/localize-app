import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import Message from './models/Message';
import messageRoutes, { handleMessageSocket } from './controllers/messagesController';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
// allowing any origin for the purpose of this demo.

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100,
});
app.use(limiter);

// db connection
const MONGODB_URI = 'mongodb://localhost:27017/test'; // normally this would be in a .env file with more security
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error', err));

// routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Localize API' });
});

app.use('/messages', messageRoutes);

// socket.io connection
io.on('connection', async (socket) => {
  console.log('New client connected', socket.id);
  
  // attempt to retrieve the last 25 messages on initial connection
  try {
    const messages = await Message.find().sort({ createdAt: 1 }).limit(25);
    socket.emit('messages', messages);
  } catch (error: unknown) {
    if (error instanceof Error) {
      socket.emit('error', { message: 'Error retrieving messages: ' + error.message });
    } else {
      socket.emit('error', { message: 'An unknown error occurred' });
    }
  }

  handleMessageSocket(io, socket);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});