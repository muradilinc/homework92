import express from 'express';
import User from '../models/User';
import mongoose from 'mongoose';

const usersRouter = express.Router();
usersRouter.post('/', async (req, res, next) => {
  try {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      displayName: req.body.displayName,
    });

    user.generateToken();
    await user.save();
    return res.send({ message: 'ok!', user });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(error);
    }

    return next(error);
  }
});

usersRouter.post('/sessions', async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(422).send({ error: 'User not found!' });
    }

    const isMatch = await user.checkPassword(req.body.password);

    if (!isMatch) {
      return res.status(422).send({ error: 'password is wrong!' });
    }

    user.generateToken();
    await user.save();

    return res.send({ message: 'Email and password are correct!', user });
  } catch (error) {
    return next(error);
  }
});

usersRouter.delete('/sessions', async (req, res, next) => {
  try {
    const headerValue = req.get('Authorization');
    const successMessage = { message: 'Success!' };

    if (!headerValue) {
      return res.send({ ...successMessage, stage: 'No header' });
    }

    const [_bearer, token] = headerValue.split(' ');

    if (!token) {
      return res.send({ ...successMessage, stage: 'No token' });
    }

    const user = await User.findOne({ token });

    if (!user) {
      return res.send({ ...successMessage, stage: 'No user' });
    }

    user.generateToken();
    await user.save();

    return res.send({ ...successMessage, stage: 'Success' });
  } catch (e) {
    return next(e);
  }
});

export default usersRouter;
