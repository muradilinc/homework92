import mongoose from 'mongoose';
import User from './User';

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    validate: {
      validator: async (value: mongoose.Types.ObjectId) => {
        const artists = await User.findById(value);
        return Boolean(artists);
      },
      message: 'User does not exist!',
    },
  },
  text: {
    type: String,
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    validate: {
      validator: async (value: mongoose.Types.ObjectId) => {
        const artists = await User.findById(value);
        return Boolean(artists);
      },
      message: 'User does not exist!',
    },
  },
});

const Message = mongoose.model('Message', messageSchema);
export default Message;
