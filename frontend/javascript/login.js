const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    message.textContent = "Please enter email and password.";
    return;
  }

  console.log("Email:", email);

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const result = await response.text();

    if (!response.ok) {
      message.textContent = result;
      return;
    }

    const data = JSON.parse(result);

    sessionStorage.setItem("token", data.token);
    message.textContent = data.message;

    window.location.href = "books.html";
  } catch (error) {
    message.textContent = "Server se connect nahi ho pa raha!";
    console.log(error);
  }
});
