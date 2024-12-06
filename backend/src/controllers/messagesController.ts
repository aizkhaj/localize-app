import { Router, Request, Response } from 'express';
import { Server, Socket } from 'socket.io';
import Message from '../models/Message';

const router = Router();

export const getMessages = async (req: Request, res: Response) => {
  try {
    const message = await Message.find();
    res.json(message);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }    
  }
};

export const createMessage = async (req: Request, res: Response) => {
  const { name, message } = req.body;
  const newMessage = new Message({ name, message });

  try {
    const savedMessage = await newMessage.save();
    res.json(savedMessage);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

router.get('/', getMessages);
router.post('/create', createMessage);

export default router;