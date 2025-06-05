import express from "express";
import cors from "cors";
import passport from "./config/passport"
import { AppError } from "./utils/AppError";
import { globalErrorHandler } from "./middleware/errorMiddleware";
import { sendResponse } from "./utils/responseHandler";
import executeQuery from "./config/db";
import session from "express-session";


const authRouter = require("./routes/auth.router")
const oauthRouter = require("./routes/oauth.router")

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
 
app.use(
    session({
      secret: process.env.SESSION_SECRET as string, // Store this in .env
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }, // Set true if using HTTPS
    })
  );

app.use(passport.initialize())
app.use(passport.session());

app.use('/auth', authRouter)
app.use('/oauth', oauthRouter)


app.get("/ping", async (req, res, next) => {
  try {
    const result = await executeQuery("SELECT 1+1 AS result", [] )
    sendResponse(true, res, 200, result)
  } catch (error) {
    next(new AppError("DB Connection Failed", 500))
  }
});

// Global error handler middleware
app.use(globalErrorHandler);
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
