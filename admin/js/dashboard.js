const API = "http://localhost:5000/api";
const token = sessionStorage.getItem("token");

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", function (event) {
    event.preventDefault();
    sessionStorage.removeItem("token");
    window.location.href = "login.html";
  });
}

if (!token) {
  window.location.href = "login.html";
}

async function loadDashboard() {
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const [booksResponse, ordersResponse] = await Promise.all([
      fetch(`${API}/books`, { headers }),
      fetch(`${API}/orders`, { headers }),
    ]);

    if (!booksResponse.ok || !ordersResponse.ok) {
      throw new Error("Dashboard data fetch nahi hua.");
    }

    const books = await booksResponse.json();
    const orders = await ordersResponse.json();

    document.getElementById("totalBooks").textContent = books.length;
    document.getElementById("totalOrders").textContent = orders.length;

    const tbody = document.getElementById("ordersTableBody");
    tbody.innerHTML = "";

    orders.slice(0, 5).forEach((order) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${order._id || "—"}</td>
        <td>${order.customerName || "—"}</td>
        <td>${order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}</td>
        <td>${order.status || "Pending"}</td>
        <td>₹${order.totalAmount ?? 0}</td>
      `;

      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Dashboard error:", error);
  }
}

loadDashboard();
