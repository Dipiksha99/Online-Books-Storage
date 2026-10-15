const token = sessionStorage.getItem("token");

const container = document.querySelector(".container");

console.log("Books JavaScript connected");

if (!token) {
  alert("Please login first!");
  window.location.href = "login.html";
} else if (!container) {
  console.error("Books container not found in books.html");
} else {
  container.textContent = "Loading books...";

  let allBooks = [];

  fetch("http://localhost:5000/api/books", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }

      return response.json();
    })
    .then((books) => {
      allBooks = Array.isArray(books) ? books : [];

      console.log("Books loaded:", allBooks);

      displayBooks(allBooks);
    })
    .catch((error) => {
      console.error("Error loading books:", error);
      container.textContent =
        "Unable to load books. Please try again.";
    });

  function displayBooks(books) {
    container.innerHTML = "";

    if (books.length === 0) {
      container.textContent = "No books available.";
      return;
    }

    books.forEach((book) => {
      const card = document.createElement("div");
      card.className = "book-card";

      const image = document.createElement("img");
      image.src = `http://localhost:5000${book.image || ""}`;
      image.alt = book.title || "Book cover";

      image.onerror = function () {
        this.alt = "Book image unavailable";
      };

      const title = document.createElement("h3");
      title.textContent = book.title || "Untitled";

      const author = document.createElement("p");
      author.textContent = `Author: ${book.author || "Unknown"}`;

      const price = document.createElement("p");
      price.textContent = `Price: ₹${book.price ?? 0}`;

      const category = document.createElement("p");
      category.textContent = `Category: ${book.category || "General"}`;

      const button = document.createElement("button");
      button.textContent = "View Details";

      button.addEventListener("click", function () {
        window.location.href =
          `book-details.html?id=${encodeURIComponent(book._id)}`;
      });

      card.append(image, title, author, price, category, button);
      container.appendChild(card);
    });
  }

  // Search functionality
  const searchInput = document.querySelector("#searchbook");

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const searchText = this.value.toLowerCase().trim();

      const filteredBooks = allBooks.filter((book) =>
        `${book.title || ""} ${book.author || ""} ${book.category || ""}`
          .toLowerCase()
          .includes(searchText)
      );

      displayBooks(filteredBooks);
    });
  }

  // Category filter
  const categoryFilter = document.querySelector("#categoryFilter");

  if (categoryFilter) {
    categoryFilter.addEventListener("change", function () {
      const selectedCategory = this.value;

      const filteredBooks = allBooks.filter((book) => {
        const matchesSearch = searchInput
          ? `${book.title || ""} ${book.author || ""} ${book.category || ""}`
              .toLowerCase()
              .includes(searchInput.value.toLowerCase().trim())
          : true;

        const matchesCategory =
          !selectedCategory ||
          selectedCategory === "all" ||
          book.category === selectedCategory;

        return matchesSearch && matchesCategory;
      });

      displayBooks(filteredBooks);
    });
  }
}
