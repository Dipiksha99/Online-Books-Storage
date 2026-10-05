console.log("Books JavaScript connected");

const container = document.querySelector(".container");
container.textContent = "Loading books...";

fetch("http://localhost:5000/api/books")
  .then((response) => response.json())
  .then((books) => {
    container.textContent = "";
    books.forEach((book) => {
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
      card.appendChild(button);

      container.appendChild(card);
    });
  })

  .catch((error) => {
    console.log(error);
    container.textContent = "Unable to load books.";
});
