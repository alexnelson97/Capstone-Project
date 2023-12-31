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
app.get("/books/unread", bookController.getUnreadBooks);
app.post("/books", bookController.addBook);
app.put("/books/:id/read", bookController.markBookAsRead);
app.delete("/books/:id", bookController.deleteBook);
app.get("/books/read", bookController.getReadBooks);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
