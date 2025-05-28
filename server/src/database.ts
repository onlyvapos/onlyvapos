import mongoose from 'mongoose';
import { config } from './config';

export const connectDB = async () => {
  try {
    await mongoose.connect(config.dbUrl);
    console.log("Database connected");
  }
  catch (error) {
    console.log(error);
  }
}
