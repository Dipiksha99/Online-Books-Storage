console.log("Books JavaScript connected");

const container = document.querySelector(".container");
container.textContent = "Loading books...";

let allBooks = [];

fetch("http://localhost:5000/api/books")
  .then((response) => response.json())
  .then((books) => {
    allBooks = books;

    const input = document.querySelector("#searchbook");
    const searchbtn = document.getElementById("find");

    const catFilter = document.getElementById("categoryFilter");

    function filterBooks() {
      const searchText = input.value;
      const category = catFilter.value;

      const result = allBooks.filter(function (book) {
        return (
          book.title.toLowerCase().includes(searchText.toLowerCase()) &&
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

    function displayBooks(books) {
      container.textContent = "";

      books.forEach(function (book) {
        const card = document.createElement("div");
        card.className = "book";

        const image = document.createElement("img");
        image.src = "images/" + book.image;
        image.alt = book.title;
        card.appendChild(image);

        const title = document.createElement("p");
        title.textContent = book.title;
        card.appendChild(title);

        const author = document.createElement("p");
        author.textContent = book.author;
        card.appendChild(author);

        const price = document.createElement("p");
        price.textContent = book.price;
        card.appendChild(price);

        const category = document.createElement("p");
        category.textContent = book.category;
        card.appendChild(category);

        const button = document.createElement("button");
        button.className = "btn";
        button.textContent = "View Details";

        // View Details button
        button.addEventListener("click", function () {
          window.location.href = "book-details.html?id=" + book._id;
        });

        card.appendChild(button);

        container.appendChild(card);
      });
    }

    displayBooks(allBooks);
  })

  .catch((error) => {
    console.log(error);
    container.textContent = "Unable to load books.";
  });