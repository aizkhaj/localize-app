import { Schema, model, Document } from 'mongoose';

export interface IMessage extends Document {
  name: string;
  message: string;
}

const messageSchema = new Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  message: { 
    type: String, 
    required: true,
    trim: true
  },
}, {
  timestamps: true
});

export default model<IMessage>('Message', messageSchema);