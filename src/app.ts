import express from 'express';
import cors from 'cors';
import router from './app/routes';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './app/middlewares/globalErrorHandeler';
import notFoundHandler from './app/middlewares/notFoundHandler';

const app = express();

// Enable cookie parsing
app.use(cookieParser());

// Middleware for parsing JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(express.static("./uploads"));
// Middleware for handling CORS with credentials
app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));

// Root route
app.get('/', (req, res) => {
  res.send("Welcome to Bright Tuition Care!");
});

// Application routes
app.use('/api/v1', router);

// Catch-all route for handling 404 errors
app.use(notFoundHandler);

// Global error handling middleware
app.use(globalErrorHandler);

export default app;
