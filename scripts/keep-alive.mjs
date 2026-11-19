/* One connection + two cheap reads, once a week, so Atlas never sees 30 idle days.
   Atlas pauses inactive Free (ex-M0) clusters after 30 days — docs.mongodb.com/docs/atlas/pause-terminate-cluster */
import { readFileSync } from 'node:fs';
import mongoose from 'mongoose';

const envLine = readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
  .split('\n')
  .find((line) => line.startsWith('MONGODB_URI='));

const uri = envLine?.slice('MONGODB_URI='.length).replace(/^"|"$/g, '');
if (!uri) {
  console.error('keep-alive: MONGODB_URI missing from .env.local');
  process.exit(1);
}

try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  const db = mongoose.connection.db;
  const [posts, users] = await Promise.all([
    db.collection('posts').countDocuments(),
    db.collection('users').countDocuments(),
  ]);
  console.log(`keep-alive ok — db=${db.databaseName} posts=${posts} users=${users} at ${new Date().toISOString()}`);
  await mongoose.disconnect();
  process.exit(0);
} catch (error) {
  console.error(`keep-alive FAILED — ${error.message}`);
  process.exit(1);
}
