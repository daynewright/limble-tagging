const express = require("express");
const path = require("path");
const jsonServer = require("json-server");

const app = express();
const port = process.env.PORT || 3000;

// Serve the Angular app
app.use(express.static(path.join(__dirname, "dist/limble-tagging")));

// JSON Server routes
const router = jsonServer.router("db.json");
app.use("/api", router);

// Catch all other routes and return the index file (Angular)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/limble-tagging/index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
