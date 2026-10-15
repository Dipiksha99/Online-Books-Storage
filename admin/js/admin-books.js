const API_URL = "http://localhost:5000/api/books";
const token = sessionStorage.getItem("token");

const tableBody = document.getElementById("ordersTableBody");
const searchInput = document.getElementById("searchInput");
const bookForm = document.querySelector(".book-add");
const addButton = document.querySelector(".header .del");
const logoutBtn = document.getElementById("logoutBtn");

let books = [];
let editingBookId = null;

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", function (event) {
    event.preventDefault();
    sessionStorage.removeItem("token");
    window.location.href = "login.html";
  });
}

// Login token check
if (!token) {
  window.location.href = "login.html";
}

// Show message
function showMessage(message) {
  alert(message);
}

// Load all books
async function loadBooks() {
  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Books load nahi hui. Login dobara check karo.");
    }

    books = await response.json();
    displayBooks(books);
  } catch (error) {
    console.error("Load books error:", error);
    showMessage(error.message);
  }
}

// Display books in table
function displayBooks(bookList) {
  tableBody.innerHTML = "";

  if (bookList.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="7">No books found.</td></tr>';
    return;
  }

  bookList.forEach((book) => {
    const row = document.createElement("tr");

    // ID
    const idCell = document.createElement("td");
    idCell.textContent = book._id ?? "";
    row.appendChild(idCell);

    // Image
    const imageCell = document.createElement("td");
    const img = document.createElement("img");

    if (book.image) {
      // img.src = book.image;
      img.src = `http://localhost:5000${book.image}`;
    }

    img.alt = book.title || "Book cover";
    img.style.width = "60px";
    img.style.height = "75px";
    img.style.objectFit = "cover";
    img.style.borderRadius = "5px";

    img.onerror = function () {
      this.style.display = "none";
      imageCell.textContent = "Image unavailable";
    };

    imageCell.appendChild(img);
    row.appendChild(imageCell);

    // Title
    const titleCell = document.createElement("td");
    titleCell.textContent = book.title ?? "";
    row.appendChild(titleCell);

    // Author
    const authorCell = document.createElement("td");
    authorCell.textContent = book.author ?? "";
    row.appendChild(authorCell);

    // Price
    const priceCell = document.createElement("td");
    priceCell.textContent = `₹${book.price ?? 0}`;
    row.appendChild(priceCell);

    // Stock
    const stockCell = document.createElement("td");
    stockCell.textContent = book.stock ?? 0;
    row.appendChild(stockCell);

    // Actions
    const actions = document.createElement("td");

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "edit-btn";
    editButton.type = "button";
    editButton.addEventListener("click", () => editBook(book));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-btn";
    deleteButton.type = "button";
    deleteButton.addEventListener("click", () => deleteBook(book._id));

    actions.append(editButton, deleteButton);
    row.appendChild(actions);

    tableBody.appendChild(row);
  });
}

// Search books
if (searchInput) {
  searchInput.addEventListener("input", function () {
    const query = this.value.toLowerCase();

    const filteredBooks = books.filter((book) =>
      [book._id, book.title, book.author].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(query),
      ),
    );

    displayBooks(filteredBooks);
  });
}

// Open Add Book form
if (addButton && bookForm) {
  addButton.addEventListener("click", function () {
    editingBookId = null;
    bookForm.reset();

    bookForm.querySelector("h1").textContent = "Add Book";
    bookForm.querySelector(".save").textContent = "Save";

    bookForm.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

// Edit book
function editBook(book) {
  editingBookId = book._id;

  document.getElementById("title").value = book.title || "";
  document.getElementById("Author").value = book.author || "";
  document.getElementById("price").value = book.price ?? "";
  document.getElementById("stock").value = book.stock ?? "";
  document.getElementById("imageUrl").value = book.image || "";

  bookForm.querySelector("h1").textContent = "Edit Book";
  bookForm.querySelector(".save").textContent = "Update";

  bookForm.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

// Save or Update book
if (bookForm) {
  bookForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("Author").value.trim();
    const priceValue = document.getElementById("price").value;
    const stockValue = document.getElementById("stock").value;
    const image = document.getElementById("imageUrl").value.trim();

    const price = Number(priceValue);
    const stock = Number(stockValue);

    if (
      !title ||
      !author ||
      !image ||
      priceValue === "" ||
      stockValue === "" ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      showMessage("Please enter valid book details.");
      return;
    }

    const bookData = {
      title,
      author,
      price,
      stock,
      image,
    };

    try {
      const response = await fetch(
        editingBookId ? `${API_URL}/${editingBookId}` : API_URL,
        {
          method: editingBookId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bookData),
        },
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Book save nahi hui.");
      }

      showMessage(
        editingBookId
          ? "Book updated successfully!"
          : "Book added successfully!",
      );

      editingBookId = null;
      bookForm.reset();

      bookForm.querySelector("h1").textContent = "Add/Edit Book";
      bookForm.querySelector(".save").textContent = "Save";

      await loadBooks();
    } catch (error) {
      console.error("Save book error:", error);
      showMessage(error.message);
    }
  });
}

// Delete book
async function deleteBook(id) {
  const confirmed = confirm("Are you sure you want to delete this book?");

  if (!confirmed) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Book delete nahi hui.");
    }

    showMessage("Book deleted successfully!");
    await loadBooks();
  } catch (error) {
    console.error("Delete book error:", error);
    showMessage(error.message);
  }
}

// Initial load
if (token) {
  loadBooks();
}
