const ordersContainer = document.getElementById("ordersContainer");
const ordersMessage = document.getElementById("ordersMessage");

async function loadOrders() {
  const token = sessionStorage.getItem("token");

  if (!token) {
    ordersMessage.textContent = "Please log in to view your orders.";
    return;
  }

  ordersMessage.textContent = "Loading your orders...";

  try {
    const response = await fetch("http://localhost:5000/api/orders/my-orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to load orders.");
    }

    if (!Array.isArray(data) || data.length === 0) {
      ordersMessage.textContent = "You have not placed any orders yet.";
      ordersContainer.replaceChildren();
      return;
    }

    ordersContainer.replaceChildren();
    ordersMessage.textContent = "";

    data.forEach((order) => {
      const card = document.createElement("section");
      card.className = "order-card";

      const heading = document.createElement("h2");
      heading.textContent = `Order #${String(order._id).slice(-6)}`;

      const status = document.createElement("p");
      status.textContent = `Status: ${order.status}`;

      const date = document.createElement("p");
      date.textContent = `Date: ${
        order.createdAt
          ? new Date(order.createdAt).toLocaleString()
          : "Not available"
      }`;

      const itemsList = document.createElement("ul");

      (order.items || []).forEach((item) => {
        const li = document.createElement("li");
        li.textContent = `${item.title} × ${item.quantity} — ₹${(
          Number(item.price) * Number(item.quantity)
        ).toFixed(2)}`;
        itemsList.appendChild(li);
      });

      const total = document.createElement("h3");
      total.textContent = `Total: ₹${Number(order.totalAmount).toFixed(2)}`;

      card.append(heading, status, date, itemsList, total);
      ordersContainer.appendChild(card);
    });
  } catch (error) {
    ordersMessage.textContent = error.message;
  }
}

loadOrders();
