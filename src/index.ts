import express from "express";

// Entry point for Auth Identity Service
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  console.log("Default endpoint has been hit!");
  res.send("Auth Identity Service is running!");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
