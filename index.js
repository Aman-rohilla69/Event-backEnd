import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import todoRoute from "./src/Routes/todo.route.js";
import userRoute from "./src/Routes/user.route.js";
import cookieParser from "cookie-parser";
const app = express();
dotenv.config();

const PORT = process.env.PORT || 4002;
const DB_URI = process.env.MONGODB_URI;

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"], // Add other headers you want to allow here.
  }),
);

// Database connection code

// try {
//   await mongoose.connect(DB_URI);
//   console.log("Connected to MongoDB");
// } catch (error) {
//   console.log(error);
// }

// Database verce connection code

let isConnected = false;

async function connectToMongoDB() {
  try {
    await mongoose.connect(DB_URI, {
      // useNewUrlParser: true, // is used to parse the connection string correctly iska matlab hai ki agar connection string me koi special characters hain to unko sahi tarike se handle karega.
      // useUnifiedTopology: true, // is used to opt in to the MongoDB driver's new connection management engine. Ye naye engine me connection pooling aur monitoring ke liye better support provide karta hai.
    });
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// middleware to check MongoDB connection before handling requests
app.use((req, res, next) => {
  if (!isConnected) {
    connectToMongoDB();
  }
  next();
});

// routes
app.use("/todo", todoRoute);
app.use("/user", userRoute);

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// do not use app.listen() in vercel because vercel will handle the serverless function and it will automatically start the server when a request is made to the endpoint. So we should not start the server manually in vercel.

export default app; // Export the app for testing purposes
