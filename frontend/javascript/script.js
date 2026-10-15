const API_URL = "http://localhost:5000/api/books";
const container = document.getElementById("book-container");

async function loadBooks() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }

    const result = await response.json();
    const books = Array.isArray(result) ? result : result.books;

    if (!Array.isArray(books) || books.length === 0) {
      container.textContent = "No books available.";
      return;
    }

    container.innerHTML = "";

    books.forEach((book) => {
      const card = document.createElement("div");
      card.className = "book";

      const image = document.createElement("img");
      image.src = book.image
        ? (book.image.startsWith("http")
            ? book.image
            : `http://localhost:5000${book.image}`)
        : "images/logo2.png";
      image.alt = book.title || "Book cover";

      const title = document.createElement("h3");
      title.textContent = book.title || "Untitled";

      const author = document.createElement("p");
      author.textContent = `Author: ${book.author || "Unknown"}`;

      const price = document.createElement("p");
      price.textContent = `Price: ₹${book.price ?? 0}`;

      const detailsButton = document.createElement("button");
      detailsButton.className = "btn";
      detailsButton.textContent = "More Details";

      detailsButton.addEventListener("click", () => {
        const token = sessionStorage.getItem("token");

        if (!token) {
          alert("Please login first!");
          window.location.href = "login.html";
          return;
        }

        window.location.href =
          `book-details.html?id=${encodeURIComponent(book._id)}`;
      });

      card.append(image, title, author, price, detailsButton);
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading books:", error);
    container.textContent =
      "Unable to load books. Please check the backend server.";
  }
}

loadBooks();
