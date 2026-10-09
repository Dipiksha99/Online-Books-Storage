console.log("Books JavaScript connected");

const container = document.querySelector(".container");
container.textContent = "Loading books...";

let allBooks = [];

const token = sessionStorage.getItem("token");

if (!token) {
  container.textContent = "Please login first.";
} else {
  fetch("http://localhost:5000/api/books", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (response) => {
      const result = await response.text();
      console.log("Books API status:", response.status);
      console.log("Books API response:", result);

      if (!response.ok) {
        throw new Error(result);
      }

      return JSON.parse(result);
    })
    .then((books) => {
      allBooks = books;

      const input = document.querySelector("#searchbook");
      const searchbtn = document.getElementById("find");
      const catFilter = document.getElementById("categoryFilter");

      function filterBooks() {
        const searchText = input.value.trim().toLowerCase();
        const category = catFilter.value;

        const result = allBooks.filter(function (book) {
          return (
            (book.title || "").toLowerCase().includes(searchText) &&
            (category === "all" || book.category === category)
          );
        });

        console.log(result);
        displayBooks(result);
      }

      catFilter.addEventListener("change", function () {
        filterBooks();
      });

      searchbtn.addEventListener("click", function () {
        filterBooks();
      });

      input.addEventListener("input", function () {
        filterBooks();
      });

      function displayBooks(books) {
        container.textContent = "";

        if (books.length === 0) {
          container.textContent = "No books found.";
          return;
        }

        books.forEach(function (book) {
          const card = document.createElement("div");
          card.className = "book";

          const image = document.createElement("img");
          image.src = "images/" + (book.image || "");
          image.alt = book.title || "Book cover";
          card.appendChild(image);

          const title = document.createElement("p");
          title.textContent = book.title || "Untitled";
          card.appendChild(title);

          const author = document.createElement("p");
          author.textContent = "Author: " + (book.author || "Unknown");
          card.appendChild(author);

          const price = document.createElement("p");
          price.textContent = "Price: ₹" + (book.price ?? "N/A");
          card.appendChild(price);

          const category = document.createElement("p");
          category.textContent = "Category: " + (book.category || "Other");
          card.appendChild(category);

          const button = document.createElement("button");
          button.className = "btn";
          button.textContent = "View Details";

          button.addEventListener("click", function () {
            window.location.href =
              "book-details.html?id=" + encodeURIComponent(book._id);
          });

          card.appendChild(button);
          container.appendChild(card);
        });
      }

      displayBooks(allBooks);
      console.log("Rendered book cards:", container.querySelectorAll(".book").length);
      console.log("Books received:", allBooks.length);
      console.log("Books container:", container);
    })
    .catch((error) => {
      console.error("Books loading error:", error);
      container.textContent = "Unable to load books. Please try again.";
    });
}
