const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Function to get all books
async function getAllBooks(req, res) {
  try {
    const result = await pool.query("SELECT * FROM books");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}

// Function to add a new book
async function addBook(req, res) {
  try {
    const { title, author, genre, image_url } = req.body;
    const result = await pool.query(
      "INSERT INTO books (title, author, genre, image_url) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, author, genre, image_url]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}

// Function to move a book to the read list
async function moveToReadList(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "INSERT INTO user_books (book_id, status, date_added, date_read) VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *",
      [book_id, "read"]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}

// Function to delete a book
async function deleteBook(req, res) {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM books WHERE id = $1", [id]);
    res.status(200).send(`Book with ID ${id} deleted`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}

module.exports = {
  getAllBooks,
  addBook,
  moveToReadList,
  deleteBook,
};
