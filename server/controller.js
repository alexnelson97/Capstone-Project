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
    const bookResult = await pool.query(
      "INSERT INTO books (title, author, genre, image_url) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, author, genre, image_url]
    );

    if (bookResult.rows.length > 0) {
      const book = bookResult.rows[0];
      await pool.query(
        "INSERT INTO user_books (book_id, status, date_added) VALUES ($1, $2, CURRENT_TIMESTAMP)",
        [book.id, "unread"]
      );
      res.json(book);
    } else {
      throw new Error("Book could not be added");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}

// Function to delete a book
async function deleteBook(req, res) {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    await client.query("BEGIN");

    await client.query("DELETE FROM user_books WHERE book_id = $1", [id]);

    await client.query("DELETE FROM books WHERE id = $1", [id]);

    await client.query("COMMIT");
    res.status(200).send(`Book with ID ${id} deleted`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).send("Server error");
  } finally {
    client.release();
  }
}

// Function to get all read books
async function getReadBooks(req, res) {
  try {
    const result = await pool.query(
      "SELECT books.* FROM books JOIN user_books ON books.id = user_books.book_id WHERE user_books.status = 'read'"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}

// Function to get all unread books
async function getUnreadBooks(req, res) {
  try {
    const result = await pool.query(
      "SELECT books.* FROM books JOIN user_books ON books.id = user_books.book_id WHERE user_books.status = 'unread'"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}

// Function to mark book as read
async function markBookAsRead(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "UPDATE user_books SET status = 'read', date_read = CURRENT_TIMESTAMP WHERE book_id = $1 RETURNING *",
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}

module.exports = {
  getAllBooks,
  getReadBooks,
  getUnreadBooks,
  addBook,
  deleteBook,
  markBookAsRead,
};
