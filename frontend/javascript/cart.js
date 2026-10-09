
console.log("Cart JavaScript connected");

const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const clearCartButton = document.getElementById("clearCart");
const checkoutButton = document.getElementById("checkoutBtn");

function getCart() {
  try {
    return JSON.parse(localStorage.getItem("bookCart") || "[]");
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("bookCart", JSON.stringify(cart));
}

function displayCart() {
  const cart = getCart();
  cartItems.replaceChildren();

  if (cart.length === 0) {
    cartItems.textContent = "Your cart is empty.";
    cartTotal.textContent = "0";
    return;
  }

  let total = 0;

  cart.forEach(book => {
    const quantity = Number(book.quantity) || 1;
    const price = Number(book.price) || 0;
    total += price * quantity;

    const item = document.createElement("div");
    item.className = "cart-item";

    const details = document.createElement("div");

    const title = document.createElement("h3");
    title.textContent = book.title || "Untitled";

    const author = document.createElement("p");
    author.textContent = "Author: " + (book.author || "Unknown");

    const priceText = document.createElement("p");
    priceText.textContent = "Price: ₹" + price;

    const subtotal = document.createElement("p");
    subtotal.textContent = "Subtotal: ₹" + price * quantity;

    details.append(title, author, priceText, subtotal);

    const controls = document.createElement("div");
    controls.className = "quantity-controls";

    const minus = document.createElement("button");
    minus.textContent = "−";
    minus.type = "button";
    minus.setAttribute("aria-label", "Decrease quantity");

    const quantityText = document.createElement("span");
    quantityText.textContent = quantity;

    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.type = "button";
    plus.setAttribute("aria-label", "Increase quantity");

    minus.addEventListener("click", () => {
      const updatedCart = getCart();
      const selected = updatedCart.find(item => item._id === book._id);
      if (!selected) return;

      selected.quantity -= 1;

      if (selected.quantity <= 0) {
        saveCart(updatedCart.filter(item => item._id !== book._id));
      } else {
        saveCart(updatedCart);
      }

      displayCart();
    });

    plus.addEventListener("click", () => {
      const updatedCart = getCart();
      const selected = updatedCart.find(item => item._id === book._id);
      if (!selected) return;

      if (selected.quantity >= Number(selected.stock)) {
        alert("No more stock available.");
        return;
      }

      selected.quantity += 1;
      saveCart(updatedCart);
      displayCart();
    });

    controls.append(minus, quantityText, plus);

    const removeButton = document.createElement("button");
    removeButton.className = "remove-btn";
    removeButton.textContent = "Remove";
    removeButton.type = "button";

    removeButton.addEventListener("click", () => {
      saveCart(getCart().filter(item => item._id !== book._id));
      displayCart();
    });

    item.append(details, controls, removeButton);
    cartItems.appendChild(item);
  });

  cartTotal.textContent = total.toFixed(2);
}

clearCartButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear the cart?")) {
    saveCart([]);
    displayCart();
  }
});

checkoutButton.addEventListener("click", () => {
  if (getCart().length === 0) {
    alert("Your cart is empty.");
    return;
  }

  window.location.href = "checkout.html";
});

displayCart();