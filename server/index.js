require("dotenv").config();

const express = require("express");
const cors = require("cors");

const bookController = require("./controller");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/books", bookController.getAllBooks);
app.post("/books", bookController.addBook);
app.put("/books/:id/read", bookController.moveToReadList);
app.delete("/books/:id", bookController.deleteBook);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
