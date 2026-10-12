const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get input values
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // Validate inputs
    if (!email || !password) {
        message.textContent = "Please enter email and password.";
        message.style.color = "red";
        return;
    }

    // Show loading message
    message.textContent = "Logging in...";
    message.style.color = "#3b194f";

    try {
        // Send login request to backend
        const response = await fetch(
            "http://localhost:5000/api/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        // Read JSON response
        const data = await response.json();

        // Handle login errors
        if (!response.ok) {
            message.textContent =
                data.message || "Invalid email or password.";
            message.style.color = "red";
            return;
        }

        // Check token
        if (!data.token) {
            message.textContent = "Login token not received.";
            message.style.color = "red";
            return;
        }

        // Save token
        sessionStorage.setItem("token", data.token);

        // Show success message
        message.textContent = data.message || "Login successful!";
        message.style.color = "green";

        // Redirect to dashboard
        window.location.href = "dashboard.html";

    } catch (error) {
        console.error("Login error:", error);

        message.textContent =
            "Server se connect nahi ho pa raha!";
        message.style.color = "red";
    }
});