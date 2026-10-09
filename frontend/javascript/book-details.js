
console.log("Book Details JavaScript connected");

const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");
const bookDetails = document.getElementById("bookDetails");
const token = sessionStorage.getItem("token");

async function loadBookDetails() {
  if (!bookId) {
    bookDetails.textContent = "Book ID not found.";
    return;
  }

  if (!token) {
    bookDetails.textContent = "Please login first.";
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/books/${encodeURIComponent(bookId)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const book = await response.json();

    bookDetails.replaceChildren();

    const content = document.createElement("div");
    content.className = "book-content";

    const imageSection = document.createElement("div");
    imageSection.className = "book-image";

    const image = document.createElement("img");
    image.src = "images/" + (book.image || "");
    image.alt = book.title || "Book cover";
    image.onerror = () => image.style.display = "none";
    imageSection.appendChild(image);

    const info = document.createElement("div");
    info.className = "book-info";

    const title = document.createElement("h2");
    title.textContent = book.title || "Untitled";

    const author = document.createElement("p");
    author.textContent = "Author: " + (book.author || "Unknown");

    const price = document.createElement("p");
    price.textContent = "Price: ₹" + (book.price ?? "N/A");

    const category = document.createElement("p");
    category.textContent = "Category: " + (book.category || "Other");

    const description = document.createElement("p");
    description.textContent =
      "Description: " + (book.description || "No description available.");

    const stock = document.createElement("p");
    stock.textContent = "Stock: " + (book.stock ?? 0);

    const addButton = document.createElement("button");
    addButton.className = "btn";
    addButton.textContent = "Add to Cart";
    addButton.type = "button";

    addButton.addEventListener("click", () => {
      const cart = JSON.parse(localStorage.getItem("bookCart") || "[]");
      const existingBook = cart.find(item => item._id === book._id);

      if (Number(book.stock) <= 0) {
        alert("This book is out of stock.");
        return;
      }

      if (existingBook) {
        if (existingBook.quantity >= Number(book.stock)) {
          alert("No more stock available.");
          return;
        }
        existingBook.quantity += 1;
      } else {
        cart.push({
          _id: book._id,
          title: book.title,
          author: book.author,
          price: Number(book.price),
          image: book.image,
          stock: Number(book.stock),
          quantity: 1
        });
      }

      localStorage.setItem("bookCart", JSON.stringify(cart));
      alert("Book added to cart!");
    });

    const cartButton = document.createElement("button");
    cartButton.className = "btn";
    cartButton.textContent = "View Cart";
    cartButton.type = "button";
    cartButton.addEventListener("click", () => {
      window.location.href = "cart.html";
    });

    info.append(
      title, author, price, category, description, stock,
      addButton, cartButton
    );

    content.append(imageSection, info);
    bookDetails.appendChild(content);

    console.log("Book details loaded:", book.title);
  } catch (error) {
    console.error("Book details loading error:", error);
    bookDetails.textContent = "Unable to load book details. Please try again.";
  }
}

loadBookDetails();