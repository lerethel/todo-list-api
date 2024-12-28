import mongoose from "mongoose";
import config from "../config/config.js";

class Database {
  connect() {
    return mongoose.connect(config.MONGODB_URI);
  }
}

export default new Database();
