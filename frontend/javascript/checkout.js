
const checkoutForm = document.getElementById("checkoutForm");
const orderSummary = document.getElementById("orderSummary");
const checkoutTotal = document.getElementById("checkoutTotal");
const message = document.getElementById("message");

const customerName = document.getElementById("customerName");
const phone = document.getElementById("phone");
const address = document.getElementById("address");

const CART_KEY = "bookCart";

function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

function displayCheckout() {
  const cart = getCart();

  orderSummary.innerHTML = "";

  if (cart.length === 0) {
    orderSummary.textContent = "Your cart is empty. Please add books first.";
    checkoutTotal.textContent = "0";
    checkoutForm.querySelector('button[type="submit"]').disabled = true;
    return;
  }

  checkoutForm.querySelector('button[type="submit"]').disabled = false;

  let total = 0;

  cart.forEach((item) => {
    const quantity = Number(item.quantity);
    const price = Number(item.price);

    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      return;
    }

    const subtotal = price * quantity;
    total += subtotal;

    const row = document.createElement("p");
    row.textContent =
      `${item.title || item.name} × ${quantity} — ₹${subtotal.toFixed(2)}`;

    orderSummary.appendChild(row);
  });

  checkoutTotal.textContent = total.toFixed(2);
}

checkoutForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const cart = getCart();
  const token = sessionStorage.getItem("token");

  if (cart.length === 0) {
    message.textContent = "Your cart is empty.";
    return;
  }

  if (!token) {
    message.textContent = "Please log in before placing your order.";
    return;
  }

  const button = checkoutForm.querySelector('button[type="submit"]');
  button.disabled = true;
  message.textContent = "Placing your order...";

  try {
    const items = cart.map((item) => ({
      bookId: item.bookId || item._id,
      quantity: Number(item.quantity),
    }));

    const response = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items,
        customerName: customerName.value.trim(),
        phone: phone.value.trim(),
        address: address.value.trim(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to place order.");
    }

    localStorage.removeItem(CART_KEY);
    message.textContent = "Order placed successfully!";

    checkoutTotal.textContent = "0.00";
    orderSummary.textContent = "Your order has been placed.";

    checkoutForm.reset();

    setTimeout(() => {
      window.location.href = "orders.html";
    }, 1200);
  } catch (error) {
    message.textContent = error.message || "Something went wrong.";
    button.disabled = false;
  }
});

displayCheckout();
