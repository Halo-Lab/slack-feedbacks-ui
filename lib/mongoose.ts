import mongoose from 'mongoose';

const connectionString = process.env.MONGO_URI || '';

// It remove old model before added new ones to avoid errors in dev mode
Object.keys(mongoose.connection.models).forEach((key: string) => {
  // @ts-ignore
  delete mongoose.connection.models[key];
});

mongoose.connect(connectionString);
mongoose.Promise = global.Promise;

export default mongoose;