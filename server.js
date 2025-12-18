const express = require("express");
const AWS = require("aws-sdk");
const cors = require("cors");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// AWS config
AWS.config.update({
  region: "us-east-1"
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "Notes";

// Create note
app.post("/notes", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Note text required" });
  }

  const note = {
    NotesID: uuidv4(),
    text,
    createdAt: new Date().toISOString()
  };

  try {
    await dynamoDB.put({
      TableName: TABLE_NAME,
      Item: note
    }).promise();

    res.status(201).json(note);
  } catch (err) {
    console.error("DynamoDB Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all notes
app.get("/notes", async (req, res) => {
  try {
    const data = await dynamoDB.scan({
      TableName: TABLE_NAME
    }).promise();

    res.json(data.Items || []);
  } catch (err) {
    console.error("Scan Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
