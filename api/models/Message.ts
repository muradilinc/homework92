import mongoose from "mongoose";
import User from "./User";

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
      message: 'Artist does not exist!',
    },
  },
  text: {
    type: String,
    required: true,
  }
});

const Message = mongoose.model('Message', messageSchema);
export default Message;