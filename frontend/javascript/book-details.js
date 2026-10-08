const params = new URLSearchParams(window.location.search);

const bookId = params.get("id");

console.log("Book ID:", bookId);

const bookDetails = document.getElementById("bookDetails");

fetch("http://localhost:5000/api/books/" + bookId)
  .then((response) => response.json())
  .then((book) => {
    console.log(book);

    bookDetails.innerHTML = `
  <div class="book-content">

    <div class="book-image">
      <img src="images/${book.image}" alt="${book.title}">
    </div>

    <div class="book-info">
      <h2>${book.title}</h2>
      <p>Author: ${book.author}</p>
      <p>Price: ₹${book.price}</p>
      <p>Category: ${book.category}</p>
      <p>Description: ${book.description}</p>
      <p>Stock: ${book.stock}</p>
    </div>

  </div>
`;
  })
  .catch((error) => {
    console.log(error);
    bookDetails.textContent = "Unable to load book details.";
  });