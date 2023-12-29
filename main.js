// Function to fetch and display books
async function fetchBooks() {
  try {
    const response = await fetch("http://localhost:3000/books"); // Adjust URL as needed
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const books = await response.json();
    displayBooks(books);
    setupEventListeners(); // Setup listeners after books are displayed
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

// Function to fetch and display read books
async function fetchReadBooks() {
  try {
    const response = await fetch("http://localhost:3000/books/read");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const readBooks = await response.json();
    console.log("Read books:", readBooks);
    displayBooks(readBooks, true); // Add a parameter to distinguish read books
  } catch (error) {
    console.error("Error fetching read books:", error);
  }
}

// Unified function to display books on booklist.html and readbooks.html
function displayBooks(books, isReadList = false) {
  console.log("Displaying books. Read list:", isReadList);
  const bookListContainer = isReadList ? ".read-books-list" : ".book-list";
  const bookList = document.querySelector(bookListContainer);

  if (bookList) {
    bookList.innerHTML = "";

    if (books.length === 0) {
      const emptyStateDiv = document.createElement("div");
      emptyStateDiv.className = "empty-state";
      emptyStateDiv.innerHTML = `
        <h2>No Books Found</h2>
        <p>${
          isReadList
            ? "Books that you mark as read will appear here. Start exploring and enjoy reading!"
            : "No books available. Please add some books."
        }</p>
      `;
      bookList.appendChild(emptyStateDiv);
    } else {
      books.forEach((book) => {
        const bookDiv = document.createElement("div");
        bookDiv.className = "book-item";
        bookDiv.innerHTML = `
          <img src="${book.image_url}" alt="Book Cover">
          <h3>${book.title}</h3>
          <p>Author: ${book.author}</p>
          <p>Genre: ${book.genre}</p>
          <button class="remove-btn" data-book-id="${book.id}">Remove</button>
          ${
            isReadList
              ? ""
              : `<button class="read-btn" data-book-id="${book.id}">Mark as Read</button>`
          }
        `;
        bookList.appendChild(bookDiv);
      });
    }
  } else {
    console.error("Book list element not found on this page.");
  }
}

// Function to handle book submission
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
    fetchBooks();
  } catch (error) {
    console.error("Error adding book:", error);
  }
}

// Event listener for adding a book
const addBookForm = document.getElementById("addBookForm");
if (addBookForm) {
  addBookForm.addEventListener("submit", handleBookSubmission);
}

// Event listener for remove and mark as read buttons
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
  console.log(bookId);
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

// Fetch books when the page loads
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.endsWith("booklist.html")) {
    console.log("Fetching books for booklist");
    fetchBooks();
  } else if (window.location.pathname.endsWith("readbooks.html")) {
    console.log("Fetching read books for readbooks list");
    fetchReadBooks();
  }
});
