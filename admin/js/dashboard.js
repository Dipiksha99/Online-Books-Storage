// Logout
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", function (event) {
        event.preventDefault();

        sessionStorage.removeItem("token");

        window.location.href = "login.html";
    });
}