const express = require("express");
const path = require("path");
const jsonServer = require("json-server");

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'dist/limble-tagging' directory
app.use(express.static(path.join(__dirname, "dist/limble-tagging/browser")));

// JSON Server routes
const router = jsonServer.router("db.json");
app.use("/api", router);

// For Angular routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/limble-tagging/browser/index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
