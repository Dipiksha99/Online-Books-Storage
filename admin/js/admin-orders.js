const API_URL = "http://localhost:5000/api/orders";

const ordersTableBody = document.getElementById("ordersTableBody");
const searchInput = document.getElementById("searchInput");
const selectedOrderId = document.getElementById("selectedOrderId");
const currentStatus = document.getElementById("currentStatus");
const orderStatus = document.getElementById("orderStatus");
const updateStatusBtn = document.getElementById("updateStatusBtn");
const statusMessage = document.getElementById("statusMessage");

let allOrders = [];
let selectedOrder = null;

// Load all orders from backend
async function loadOrders() {
  try {
    const token = sessionStorage.getItem("token");

    if (!token) {
      ordersTableBody.innerHTML =
        '<tr><td colspan="6">Please login as admin first.</td></tr>';
      return;
    }

    ordersTableBody.innerHTML =
      '<tr><td colspan="6">Loading orders...</td></tr>';

    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to load orders");
    }

    if (!Array.isArray(data)) {
      throw new Error("Unexpected response from server");
    }

    allOrders = data;
    renderOrders(allOrders);
  } catch (error) {
    console.error("Load orders error:", error);

    ordersTableBody.innerHTML = `
      <tr>
        <td colspan="6">${escapeHTML(error.message)}</td>
      </tr>
    `;
  }
}

// Display orders in the table
function renderOrders(orders) {
  ordersTableBody.innerHTML = "";

  if (orders.length === 0) {
    ordersTableBody.innerHTML =
      '<tr><td colspan="6">No orders found.</td></tr>';
    return;
  }

  orders.forEach((order) => {
    const row = document.createElement("tr");

    const id = order._id || "";
    const customer = order.customerName || "Name not available";
    const date = order.createdAt
      ? new Date(order.createdAt).toLocaleDateString("en-IN")
      : "N/A";
    const total = Number(order.totalAmount || 0);
    const status = order.status || "Pending";

    row.innerHTML = `
      <td>${escapeHTML(id)}</td>
      <td>${escapeHTML(customer)}</td>
      <td>${escapeHTML(date)}</td>
      <td>₹${total.toFixed(2)}</td>
      <td>${escapeHTML(status)}</td>
      <td>
        <button type="button" class="select-order-btn">
          Select
        </button>
      </td>
    `;

    row.querySelector(".select-order-btn").addEventListener("click", () => {
      selectOrder(order);
    });

    ordersTableBody.appendChild(row);
  });
}

// Select an order to view its current status
function selectOrder(order) {
  selectedOrder = order;

  selectedOrderId.textContent = order._id || "N/A";
  currentStatus.textContent = order.status || "Pending";
  orderStatus.value = order.status || "Pending";

  orderStatus.disabled = false;
  updateStatusBtn.disabled = false;
  statusMessage.textContent = "";
}

// Search by order ID or customer name
searchInput.addEventListener("input", () => {
  const searchText = searchInput.value.trim().toLowerCase();

  const filteredOrders = allOrders.filter((order) => {
    const id = String(order._id || "").toLowerCase();
    const customer = String(order.customerName || "").toLowerCase();

    return id.includes(searchText) || customer.includes(searchText);
  });

  renderOrders(filteredOrders);
});

// Escape text before inserting it into HTML
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

updateStatusBtn.addEventListener("click", async () => {
  if (!selectedOrder) {
    statusMessage.textContent = "Please select an order first.";
    return;
  }

  try {
    const token = sessionStorage.getItem("token");
    const newStatus = orderStatus.value;

    updateStatusBtn.disabled = true;
    statusMessage.textContent = "Updating status...";

    const response = await fetch(`${API_URL}/${selectedOrder._id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Status update failed");
    }

    selectedOrder = data.order;
    currentStatus.textContent = data.order.status;
    statusMessage.textContent = "Status updated successfully!";

    await loadOrders();
  } catch (error) {
    console.error("Update status error:", error);
    statusMessage.textContent = error.message;
  } finally {
    updateStatusBtn.disabled = false;
  }
});

loadOrders();
