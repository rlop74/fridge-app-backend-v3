import express from "express";
import apiRoutes from "./routes/api";

const app = express();

// middlewares
app.use(express.json()); // to be able to use req.body

// app.use(express.urlencoded({ extended: true }))

// health check
app.get("/ping", (req, res) => {
  // http://localhost:<port>/ping
  res.send("pong");
});


// routes
// http://localhost:<port>/api/...
app.use("/api", apiRoutes);

export default app;
