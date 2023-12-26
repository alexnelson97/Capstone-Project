async function fetchBooks() {
  try {
    const response = await fetch("http://localhost:3000/books");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const books = await response.json();
    displayBooks(books);
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

function displayBooks(books) {
  const bookList = document.querySelector(".book-list");
  if (bookList) {
    bookList.innerHTML = "";

    books.forEach((book) => {
      const bookDiv = document.createElement("div");
      bookDiv.className = "book-item";
      bookDiv.innerHTML = `
              <img src="${book.image_url}" alt="Book Cover">
              <h3>${book.title}</h3>
              <p>Author: ${book.author}</p>
              <p>Genre: ${book.genre}</p>
              <button class="remove-btn" data-book-id="${book.id}">Remove</button>
    <button class="read-btn" data-book-id="${book.id}">Mark as Read</button>
          `;
      bookList.appendChild(bookDiv);
    });
  }
}

async function handleBookSubmission(event) {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const genre = document.getElementById("genre").value;
  const image_url = document.getElementById("image_url").value;

  try {
    const response = await fetch("http://localhost:3000/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, author, genre, image_url }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Book added:", data);
  } catch (error) {
    console.error("Error adding book:", error);
  }
}

const addBookForm = document.getElementById("addBookForm");
if (addBookForm) {
  addBookForm.addEventListener("submit", handleBookSubmission);
}

function setupEventListeners() {
  const bookList = document.querySelector(".book-list");
  if (bookList) {
    bookList.addEventListener("click", function (event) {
      const bookId = event.target.getAttribute("data-book-id");
      if (event.target.matches(".remove-btn")) {
        removeBook(bookId);
      } else if (event.target.matches(".read-btn")) {
        markAsRead(bookId);
      }
    });
  }
}

async function removeBook(bookId) {
  console.log("test-remove:", bookId);
  try {
    const response = await fetch(`http://localhost:3000/books/${bookId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    console.log("Book removed");
    fetchBooks();
  } catch (error) {
    console.error("Error removing book:", error);
  }
}

async function markAsRead(bookId) {
  console.log("test-mark as read:", bookId);
  try {
    const response = await fetch(`http://localhost:3000/books/${bookId}/read`, {
      method: "PUT",
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    console.log("Book marked as read");
    fetchBooks();
  } catch (error) {
    console.error("Error marking book as read:", error);
  }
}

if (window.location.pathname.endsWith("booklist.html")) {
  document.addEventListener("DOMContentLoaded", fetchBooks);
}
