import mongoose from 'mongoose';

const connectionString = process.env.MONGO_URI || '';

// todo workaround for HMR. It remove old model before added new ones
Object.keys(mongoose.connection.models).forEach(key => {
  // @ts-ignore
  delete mongoose.connection.models[key];
});

mongoose.connect(connectionString);
mongoose.Promise = global.Promise;

export default mongoose;