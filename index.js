import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import todoRoute from "./src/Routes/todo.route.js";
import userRoute from "./src/Routes/user.route.js";

dotenv.config();
const app = express();

const DB_URI = process.env.MONGODB_URI;

// ---------------- MONGODB CONNECTION ----------------
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToMongoDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(DB_URI)
      .then((mongooseInstance) => {
        console.log("✅ Connected to MongoDB");
        return mongooseInstance;
      })
      .catch((error) => {
        console.error("❌ MongoDB Error:", error);
        cached.promise = null;
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// ---------------- MIDDLEWARES ----------------
app.use(express.json());
app.use(cookieParser());

// CORS setup
app.use(
  cors({
    origin: process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL // deployed frontend URL
      : "http://localhost:5173", // dev frontend URL
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Check MongoDB connection before each request
app.use(async (req, res, next) => {
  try {
    await connectToMongoDB();
    next();
  } catch (error) {
    next(error);
  }
});

// ---------------- ROUTES ----------------
app.use("/user", userRoute);
app.use("/todo", todoRoute);

// ---------------- EXPORT APP ----------------
export default app;







// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";
// import todoRoute from "./src/Routes/todo.route.js";
// import userRoute from "./src/Routes/user.route.js";
// import cookieParser from "cookie-parser";
// import { id } from "zod/locales";
// const app = express();
// dotenv.config();

// const PORT = process.env.PORT || 4002;
// const DB_URI = process.env.MONGODB_URI;

// // middlewares
// app.use(express.json());
// app.use(cookieParser());
// app.use(
//   cors({
//     origin: true,
//     credentials: true,
//     methods: "GET,POST,PUT,DELETE",
//     allowedHeaders: ["Content-Type", "Authorization"], // Add other headers you want to allow here.
//   }),
// );

// // let isConnected = false;

// // async function connectToMongoDB() {
// //   try {
// //     await mongoose.connect(DB_URI, {
// //       // useNewUrlParser: true, // is used to parse the connection string correctly iska matlab hai ki agar connection string me koi special characters hain to unko sahi tarike se handle karega.
// //       // useUnifiedTopology: true, // is used to opt in to the MongoDB driver's new connection management engine. Ye naye engine me connection pooling aur monitoring ke liye better support provide karta hai.
// //     });
// //     isConnected = true;
// //     console.log("Connected to MongoDB");
// //   } catch (error) {
// //     console.error("Error connecting to MongoDB:", error);
// //   }
// // }

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// async function connectToMongoDB() {

//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(DB_URI)
//       .then((mongooseInstance) => {
//         console.log("✅ Connected to MongoDB");
//         return mongooseInstance;
//       })
//       .catch((error) => {
//         console.error("❌ MongoDB Error:", error);

//         cached.promise = null;   // 🔥 MOST IMPORTANT LINE
//         throw error;             // 🔥 MOST IMPORTANT LINE
//       });
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// }
// // middleware to check MongoDB connection before handling requests
// app.use(async (req, res, next) => {
//   try {
//     await connectToMongoDB();
//     next();
//   } catch (error) {
//     next(error);
//   }
// });
// // routes
// app.use("/todo", todoRoute);
// app.use("/user", userRoute);

// // app.listen(PORT, () => {
// //   console.log(`Server is running on port ${PORT}`);
// // });

// // do not use app.listen() in vercel because vercel will handle the serverless function and it will automatically start the server when a request is made to the endpoint. So we should not start the server manually in vercel.

// export default app; // Export the app for testing purposes

// // Database connection code

// // try {
// //   await mongoose.connect(DB_URI);
// //   console.log("Connected to MongoDB");
// // } catch (error) {
// //   console.log(error);
// // }

// // Database verce connection code
