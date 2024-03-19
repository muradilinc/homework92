import User from './models/User';
import crypto from 'crypto';
import mongoose from 'mongoose';
import config from './config';
import Message from './models/Message';

const dropCollection = async (
  db: mongoose.Connection,
  collectionName: string,
) => {
  try {
    await db.dropCollection(collectionName);
  } catch (error) {
    console.log(`Collection ${collectionName} was missing, skipping drop...`);
  }
};

const run = async () => {
  await mongoose.connect(config.mongoose.db);
  const db = mongoose.connection;

  const collections = ['messages', 'users'];

  for (const collectionName of collections) {
    await dropCollection(db, collectionName);
  }
  const [_admin, user1, user2] = await User.create(
    {
      email: 'admin@admin.com',
      password: 'admin',
      displayName: 'Admin',
      token: crypto.randomUUID(),
      role: 'admin',
    },
    {
      email: 'johnDoe@mail.com',
      password: 'johnDoe',
      displayName: 'Joe',
      token: crypto.randomUUID(),
      role: 'user',
    },
    {
      email: 'godjo@jjk.com',
      password: 'satoru',
      displayName: 'Satoru Godjo',
      token: crypto.randomUUID(),
      role: 'user',
    },
  );

  await Message.create({
    author: user1,
    text: 'Hello people!',
  });
  await Message.create({
    author: user1,
    text: 'Hello godjo!',
    receiver: user2,
  });
  await Message.create({
    author: user2,
    text: 'Sayonara!',
    receiver: user1,
  });

  await db.close();
};

void run();
